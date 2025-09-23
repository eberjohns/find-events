from sqlalchemy.orm import Session
from . import models, schemas, security

def get_user_by_email(db: Session, email: str):
    return db.query(models.User).filter(models.User.email == email).first()

def create_user(db: Session, user: schemas.UserCreate):
    hashed_password = security.get_password_hash(user.password)
    db_user = models.User(email=user.email, hashed_password=hashed_password)
    db.add(db_user)
    db.commit()
    db.refresh(db_user)
    return db_user

def create_college(db: Session, college: schemas.CollegeCreate, user_id: int):
    db_college = models.College(**college.model_dump(), registered_by_id=user_id)
    db.add(db_college)
    db.commit()
    db.refresh(db_college)
    return db_college

def get_unapproved_colleges(db: Session):
    return db.query(models.College).filter(models.College.is_approved == False).all()

def approve_college(db: Session, college_id: int):
    db_college = db.query(models.College).filter(models.College.id == college_id).first()
    if db_college:
        db_college.is_approved = True
        db.commit()
        db.refresh(db_college)
    return db_college

def assign_reprole(db: Session, user_id: int, college_id: int):
    db_user = db.query(models.User).filter(models.User.id == user_id).first()
    db_college = db.query(models.College).filter(models.College.id == college_id).first()

    # Check if user and an approved college exist
    if db_user and db_college and db_college.is_approved:
        db_user.role = "REP"
        db_user.college_id = college_id
        db.commit()
        db.refresh(db_user)
        return db_user
    return None

def create_college_event(db: Session, event: schemas.EventCreate, college_id: int):
    db_event = models.Event(**event.model_dump(), college_id=college_id)
    db.add(db_event)
    db.commit()
    db.refresh(db_event)
    return db_event

# Function to get all approved colleges
def get_approved_colleges(db: Session):
    return db.query(models.College).filter(models.College.is_approved == True).all()

# Function to get all events
def get_events(db: Session):
    return db.query(models.Event).all()

def get_event_by_id(db: Session, event_id: int):
    return db.query(models.Event).filter(models.Event.id == event_id).first()

def update_event(db: Session, event_id: int, event_update: schemas.EventCreate):
    db_event = get_event_by_id(db, event_id)
    if db_event:
        # Update the event's data from the request
        for key, value in event_update.model_dump().items():
            setattr(db_event, key, value)
        db.commit()
        db.refresh(db_event)
    return db_event

def delete_event(db: Session, event_id: int):
    db_event = get_event_by_id(db, event_id)
    if db_event:
        db.delete(db_event)
        db.commit()
    return db_event

# Function to get all users
def get_users(db: Session):
    return db.query(models.User).all()

def save_event_for_user(db: Session, user: models.User, event: models.Event):
    user.saved_events.append(event)
    db.commit()
    return user

def unsave_event_for_user(db: Session, user: models.User, event: models.Event):
    user.saved_events.remove(event)
    db.commit()
    return user