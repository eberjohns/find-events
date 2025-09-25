from pydantic import BaseModel
from typing import Optional
from datetime import datetime
from typing import List

# Schema for receiving data when creating a user
class UserCreate(BaseModel):
    email: str
    password: str

class Token(BaseModel):
    access_token: str
    token_type: str

class TokenData(BaseModel):
    email: str | None = None

# Schema for receiving data when creating a college
class CollegeCreate(BaseModel):
    name: str
    location: str

# Schema for sending college data back in a response
class College(BaseModel):
    id: int
    name: str
    location: str
    is_approved: bool
    registered_by_id: int

    class Config:
        from_attributes = True


from typing import List, Optional
from datetime import date

class EventCreate(BaseModel):
    name: str
    description: str
    date: date
    registration_fee: float = 0
    tags: List[str] = []
    image: Optional[str] = None
    external_links: List[str] = []


class Event(BaseModel):
    id: int
    name: str
    description: str
    date: date
    registration_fee: float = 0
    tags: List[str] = []
    image: Optional[str] = None
    external_links: List[str] = []
    college_id: int

    class Config:
        from_attributes = True

class AssignRepRequest(BaseModel):
    college_id: int

# Schema for sending user data back in a response
class User(BaseModel):
    id: int
    email: str
    is_active: bool
    role: str
    college_id: Optional[int] = None
    saved_events: List["Event"] = []

    class Config:
        from_attributes = True
