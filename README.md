# Job Application Tracker

## Project Description
- Built a Job Application Tracker where users can log jobs they have applied to with AI-powered insights
- Full-stack application with a REST API, a React frontend and an AI-powered cover letter feature
- Built using PostgreSQL, Express, React, Node.js
- Added AI feature to generate cover letter through Groq API key
- Deployed project to a live URL
 

## Setup Instructions
Ensure before running these 3 commands:
- Node.js
- PostgreSQL running locally
- Create the database: `CREATE DATABASE job_tracker;`
- Change .env.example to .env and fill in your credentials


#### **To run project locally:**

You need two terminals open at the same time.

#### Terminal 1 — Job_Application_Tracker:
    npm install
    npm run migrate
    npm start

API will be live at `http://localhost:3000/`

#### Terminal 2 — Frontend:
    cd frontend
    npm install
    npm run dev

UI will be live at `http://localhost:5173/`


## Environment Variables
Reference example for what goes inside .env file:

    PORT=3000

    PGHOST=localhost

    PGPORT=5432

    PGUSER=db_user

    PGPASSWORD=db_password

    PGDATABASE=job_tracker

    GROQ_API_KEY=groq_api_key


## Live URL
Live URL Link: https://job-application-tracker-jade-omega.vercel.app/

## Loom Walkthrough Link
Loom Walkthrough Link: https://www.loom.com/share/0530192cdb714ebc9fef6d5624b177f2

## Improvements
I would explore futher on how to improve the AI native feature to generate a better quality cover letter for a job application if I was given more time.