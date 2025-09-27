from pydantic import BaseModel
from typing import Optional
from datetime import datetime
from typing import List

ALLOWED_EVENT_TAGS = [
    'Workshop',
    'Seminar',
    'Hackathon',
    'Cultural',
    'Sports',
    'Tech Talk',
    'Competition',
    'Webinar',
    'Festival',
    'Other'
]

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

    @classmethod
    def validate(cls, values):
        tags = values.get('tags', [])
        invalid = [tag for tag in tags if tag not in ALLOWED_EVENT_TAGS]
        if invalid:
            raise ValueError(f"Invalid tags: {invalid}. Allowed tags: {ALLOWED_EVENT_TAGS}")
        return values

    class Config:
        arbitrary_types_allowed = True
        validate_assignment = True
        extra = 'forbid'

    # Pydantic v1: use root_validator
    @classmethod
    def __get_validators__(cls):
        yield from super().__get_validators__()
        yield cls.validate

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
