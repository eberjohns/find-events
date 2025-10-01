## Getting Started & Local Development
To run this project locally, you will need to set up your own database and environment variables.

**1. Fork and Clone the Repository**

First, fork this repository to your own GitHub account and then clone it to your local machine.
```Bash
git clone https://github.com/eberjohns/find-events.git
cd find-events
```
**2. Set Up the Backend**

The backend is built with FastAPI and uses a PostgreSQL database. We recommend using Supabase for a quick and easy setup.

- Create a Supabase Project:
    1. Go to supabase.com, create an account, and start a new project.
    2. Save your database password securely.
    3. Go to **Project Settings > Database** and copy the **Connection string**.
- Set Up Environment Variables:

    1. In the ```backend directory```, create a copy of the example environment file:(run below code in root folder)
        ```Bash
        cp backend/.env.example backend/.env
        ```
    2. Open the new ```backend/.env``` file.
    3. Replace the placeholder value for ```DATABASE_URL``` with the connection string you copied from Supabase (make sure to include your password).
    4. You can also generate a new ```SECRET_KEY``` for better security.
- Install Dependencies and Run:
    ```Bash
    # Navigate to the backend directory
    cd backend

    # (Recommended) Create and activate a virtual environment
    python -m venv venv
    source venv/bin/activate # on Windows use `venv\Scripts\activate`

    # Install dependencies
    pip install -r requirements.txt

    # Run the server
    uvicorn backend.main:app --reload
    ```
    The ```create_db_and_tables()``` function will automatically create the necessary tables in your Supabase database when the application starts.
    
**3. Set Up the Frontend**

Install Dependencies and Run:
```Bash
# Navigate to the backend directory
cd frontend

# Install dependencies
npm install

# Run the server
npm run dev
```

**Register first user and set it to role ADMIN:**
```SQL
UPDATE users SET role = 'ADMIN' WHERE id = 1;
```
