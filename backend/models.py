from sqlalchemy import Boolean, Column, ForeignKey, Integer, String, DateTime,Table
from sqlalchemy.orm import relationship
from .database import Base

# Association Table for User <-> Event relationship
user_saved_events = Table(
    "user_saved_events",
    Base.metadata,
    Column("user_id", Integer, ForeignKey("users.id"), primary_key=True),
    Column("event_id", Integer, ForeignKey("events.id"), primary_key=True),
)

class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)
    email = Column(String, unique=True, index=True)
    hashed_password = Column(String)
    is_active = Column(Boolean, default=True)
    role = Column(String, default="USER")

    # This is the new column for REP role
    college_id = Column(Integer, ForeignKey("colleges.id"), nullable=True)

    # This relationship defines which college a user represents.
    # We explicitly tell it to use the User.college_id column for the join.
    college = relationship("College", foreign_keys=[college_id])

    # This relationship defines the list of colleges a user has registered.
    # It's the other side of the College.owner relationship.
    registered_colleges = relationship("College", back_populates="owner", foreign_keys='College.registered_by_id')

    saved_events = relationship(
        "Event", secondary=user_saved_events, back_populates="saved_by_users"
    )

class College(Base):
    __tablename__ = "colleges"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, index=True)
    location = Column(String)
    is_approved = Column(Boolean, default=False)

    # This column links a college back to the user who created it.
    registered_by_id = Column(Integer, ForeignKey("users.id"))

    # This relationship defines the owner of the college.
    # We tell it to use the registered_by_id column for the join.
    owner = relationship("User", back_populates="registered_colleges", foreign_keys=[registered_by_id])

from sqlalchemy import JSON, Float, Date

class Event(Base):
    __tablename__ = "events"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, index=True)
    description = Column(String)
    date = Column(Date)
    registration_fee = Column(Float, default=0)
    tags = Column(JSON, default=list)  # List of strings
    image = Column(String, nullable=True)  # URL or base64 string
    external_links = Column(JSON, default=list)  # List of strings
    display = Column(Boolean, default=True)

    college_id = Column(Integer, ForeignKey("colleges.id"))
    college = relationship("College")

    saved_by_users = relationship(
        "User", secondary=user_saved_events, back_populates="saved_events"
    )

class RepApplication(Base):
    __tablename__ = "rep_applications"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"))
    college_id = Column(Integer, ForeignKey("colleges.id"))
    status = Column(String, default="pending")  # pending, approved, rejected

    user = relationship("User")
    college = relationship("College")