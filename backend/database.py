from sqlalchemy import create_engine
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker

SQLALCHEMY_DATABASE_URL = "postgresql://postgres:hmF-uH+47@localhost/find_events_db"

engine = create_engine(SQLALCHEMY_DATABASE_URL)

SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

Base = declarative_base()

# Add this new function
def create_db_and_tables():
    # Import all the models, so Base knows about them before creating tables.
    from . import models
    Base.metadata.create_all(bind=engine)