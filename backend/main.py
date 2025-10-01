from fastapi import Depends, FastAPI, HTTPException, status, Response
from fastapi.security import OAuth2PasswordBearer, OAuth2PasswordRequestForm
from jose import JWTError, jwt
from sqlalchemy.orm import Session

from . import crud, models, schemas, security
from .config import settings
from .database import SessionLocal, engine, create_db_and_tables

from fastapi.middleware.cors import CORSMiddleware

create_db_and_tables()

app = FastAPI()

#_______________________________________________________________________
#this section for testing in same system
origins = [
    "http://localhost:5173", # The address of the React app
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"], # Allow all methods
    allow_headers=["*"], # Allow all headers
)
#_________________________________________________________________________

# Dependency to get a DB session for each request
def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()


# This creates a dependency that looks for the token in the "Authorization" header
oauth2_scheme = OAuth2PasswordBearer(tokenUrl="auth/login")

# Dependency to get the current user from a token
def get_current_user(db: Session = Depends(get_db), token: str = Depends(oauth2_scheme)):
    credentials_exception = HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail="Could not validate credentials",
        headers={"WWW-Authenticate": "Bearer"},
    )
    try:
        payload = jwt.decode(token, settings.SECRET_KEY, algorithms=[settings.ALGORITHM])
        email: str = payload.get("sub")
        if email is None:
            raise credentials_exception
        token_data = schemas.TokenData(email=email)
    except JWTError:
        raise credentials_exception
    user = crud.get_user_by_email(db, email=token_data.email)
    if user is None:
        raise credentials_exception
    return user

@app.post("/auth/register", response_model=schemas.User)
def create_user(user: schemas.UserCreate, db: Session = Depends(get_db)):
    db_user = crud.get_user_by_email(db, email=user.email)
    if db_user:
        raise HTTPException(status_code=400, detail="Email already registered")
    return crud.create_user(db=db, user=user)

@app.post("/auth/login", response_model=schemas.Token)
def login_for_access_token(db: Session = Depends(get_db), form_data: OAuth2PasswordRequestForm = Depends()):
    user = crud.get_user_by_email(db, email=form_data.username) # The form sends "username"
    if not user or not security.verify_password(form_data.password, user.hashed_password):
        raise HTTPException(
            status_code=401,
            detail="Incorrect email or password",
            headers={"WWW-Authenticate": "Bearer"},
        )
    access_token = security.create_access_token(
        data={"sub": user.email}
    )
    return {"access_token": access_token, "token_type": "bearer"}

# The new protected endpoint
@app.get("/users/me/", response_model=schemas.User)
def read_users_me(current_user: models.User = Depends(get_current_user)):
    return current_user

@app.post("/colleges/", response_model=schemas.College)
def create_college(
    college: schemas.CollegeCreate,
    db: Session = Depends(get_db),
    current_user: models.User = Depends(get_current_user)
):
    return crud.create_college(db=db, college=college, user_id=current_user.id)

# Dependency for requiring a user to be an ADMIN
def get_current_admin_user(current_user: models.User = Depends(get_current_user)):
    if current_user.role != "ADMIN":
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="The user does not have administrative privileges"
        )
    return current_user

@app.get("/admin/colleges/pending/", response_model=list[schemas.College])
def read_pending_colleges(
    db: Session = Depends(get_db),
    admin_user: models.User = Depends(get_current_admin_user)
):
    colleges = crud.get_unapproved_colleges(db)
    return colleges

@app.put("/admin/colleges/{college_id}/approve", response_model=schemas.College)
def approve_college_endpoint(
    college_id: int,
    db: Session = Depends(get_db),
    admin_user: models.User = Depends(get_current_admin_user)
):
    approved_college = crud.approve_college(db=db, college_id=college_id)
    if approved_college is None:
        raise HTTPException(status_code=404, detail="College not found")
    return approved_college

@app.put("/admin/users/{user_id}/assign-rep", response_model=schemas.User)
def assign_rep_role_endpoint(
    user_id: int,
    request: schemas.AssignRepRequest, # Use the new schema
    db: Session = Depends(get_db),
    admin_user: models.User = Depends(get_current_admin_user)
):
    updated_user = crud.assign_reprole(db=db, user_id=user_id, college_id=request.college_id)
    if updated_user is None:
        raise HTTPException(
            status_code=404, detail="User or approved college not found"
        )
    return updated_user

# Dependency for requiring a user to be a REP
def get_current_rep_user(current_user: models.User = Depends(get_current_user)):
    if current_user.role != "REP" or not current_user.college_id:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="User must be a College Representative to create events",
        )
    return current_user

@app.post("/events/", response_model=schemas.Event)
def create_event(
    event: schemas.EventCreate,
    db: Session = Depends(get_db),
    rep_user: models.User = Depends(get_current_rep_user)
):
    # A rep can only create an event for their own college
    return crud.create_college_event(db=db, event=event, college_id=rep_user.college_id)

@app.get("/colleges/", response_model=list[schemas.College])
def read_colleges(db: Session = Depends(get_db)):
    colleges = crud.get_approved_colleges(db)
    return colleges

@app.get("/events/", response_model=list[schemas.Event])
def read_events(db: Session = Depends(get_db)):
    from datetime import date as dtdate
    today = dtdate.today()
    events = crud.get_events(db)
    # Set display=False for past events, True for upcoming
    for event in events:
        if hasattr(event, 'date') and event.date:
            event.display = event.date >= today
        else:
            event.display = True
    # Only return events with display True
    return [e for e in events if getattr(e, 'display', True)]

@app.put("/events/{event_id}", response_model=schemas.Event)
def update_event_endpoint(
    event_id: int,
    event_update: schemas.EventCreate,
    db: Session = Depends(get_db),
    rep_user: models.User = Depends(get_current_rep_user)
):
    db_event = crud.get_event_by_id(db, event_id)
    if not db_event:
        raise HTTPException(status_code=404, detail="Event not found")

    # Authorization Check: Is the rep updating an event for their own college?
    if db_event.college_id != rep_user.college_id:
        raise HTTPException(status_code=403, detail="Not authorized to update this event")

    return crud.update_event(db=db, event_id=event_id, event_update=event_update)

@app.delete("/events/{event_id}")
def delete_event_endpoint(
    event_id: int,
    db: Session = Depends(get_db),
    current_user: models.User = Depends(get_current_user)
):
    db_event = crud.get_event_by_id(db, event_id)
    if not db_event:
        raise HTTPException(status_code=404, detail="Event not found")

    # Authorization Check:
    is_admin = current_user.role == "ADMIN"
    is_rep_owner = (
        current_user.role == "REP" and
        db_event.college_id == current_user.college_id
    )

    if not is_admin and not is_rep_owner:
        raise HTTPException(status_code=403, detail="Not authorized to delete this event")

    crud.delete_event(db=db, event_id=event_id)
    return Response(status_code=status.HTTP_204_NO_CONTENT)

@app.get("/events/{event_id}", response_model=schemas.Event)
def read_event(event_id: int, db: Session = Depends(get_db)):
    db_event = crud.get_event_by_id(db, event_id=event_id)
    if db_event is None:
        raise HTTPException(status_code=404, detail="Event not found")
    return db_event

@app.get("/admin/users", response_model=list[schemas.User])
def read_users(
    db: Session = Depends(get_db),
    admin_user: models.User = Depends(get_current_admin_user)
):
    users = crud.get_users(db)
    return users

@app.post("/users/me/saved-events/{event_id}", response_model=schemas.User)
def save_event(
    event_id: int,
    db: Session = Depends(get_db),
    current_user: models.User = Depends(get_current_user)
):
    event_to_save = crud.get_event_by_id(db, event_id)
    if not event_to_save:
        raise HTTPException(status_code=404, detail="Event not found")
    return crud.save_event_for_user(db=db, user=current_user, event=event_to_save)

@app.delete("/users/me/saved-events/{event_id}", response_model=schemas.User)
def unsave_event(
    event_id: int,
    db: Session = Depends(get_db),
    current_user: models.User = Depends(get_current_user)
):
    event_to_unsave = crud.get_event_by_id(db, event_id)
    if not event_to_unsave:
        raise HTTPException(status_code=404, detail="Event not found")
    return crud.unsave_event_for_user(db=db, user=current_user, event=event_to_unsave)

@app.post("/rep-applications/", response_model=schemas.RepApplication)
def apply_for_rep(
    application: schemas.RepApplicationCreate,
    db: Session = Depends(get_db),
    current_user: models.User = Depends(get_current_user)
):
    return crud.create_rep_application(db, user_id=current_user.id, college_id=application.college_id)

@app.get("/rep-applications/", response_model=list[schemas.RepApplication])
def get_rep_applications(
    db: Session = Depends(get_db),
    rep_user: models.User = Depends(get_current_rep_user)
):
    return crud.get_rep_applications_for_college(db, college_id=rep_user.college_id)

@app.put("/rep-applications/{application_id}/approve", response_model=schemas.RepApplication)
def approve_application(
    application_id: int,
    db: Session = Depends(get_db),
    rep_user: models.User = Depends(get_current_rep_user)
):
    application = crud.get_rep_application_by_id(db, application_id)
    if not application or application.college_id != rep_user.college_id:
        raise HTTPException(status_code=404, detail="Application not found")
    return crud.approve_rep_application(db, application_id)

@app.put("/rep-applications/{application_id}/reject", response_model=schemas.RepApplication)
def reject_application(
    application_id: int,
    db: Session = Depends(get_db),
    rep_user: models.User = Depends(get_current_rep_user)
):
    application = crud.get_rep_application_by_id(db, application_id)
    if not application or application.college_id != rep_user.college_id:
        raise HTTPException(status_code=404, detail="Application not found")
    return crud.reject_rep_application(db, application_id)