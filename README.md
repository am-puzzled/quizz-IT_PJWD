# Quiz Web Application

This project is a React-based quiz web application that generates random quiz questions
using external APIs (football and country data). The application consists of a frontend
and a backend, which are organized in separate folders.

---

## Project Structure
/frontend(quiiz-IT) -> React application (Vite)
/backend -> Node.js / Express backend
README.md  -> Installation and run instructions


---

## Technologies Used

Frontend:
- React (Vite)
- React Router
- React Icons
- JavaScript
- Google Fonts (Play & Playball)
- Tailwind CSS(with PostCSS & Autoprefixer) and inline CSS

Backend:
- Node.js
- Express
- MongoDB Atlas
- Mongoose (MongoDB)
- CORS
- dotenv
- (Optional) nodemon for development

External Services:
- restcountries,apisports & openligadb APIs
- Pexels API (for images)
- MongoDB Atlas (cloud database)

Deployment:
- Frontend: Netlify
- Backend: Render

---

## Prerequisites

To run this project locally, you need:
- Node.js (v18 or higher recommended)
- npm
- Internet connection (for APIs and MongoDB Atlas)

---

## Environment Variables

### Backend (`/backend/.env`)
A `.env` file is required for the backend to run. For your convenience, the ZIP submission
already includes a preconfigured `.env` file with demo API credentials, so no additional setup
is required.

The `.env` file should contain the following variables:

 - PORT=5000
 - MONGO_URI=real_mongodb_atlas_connection_string
 - API_KEY=real_api_key_here
 - PEXELS_API_KEY=real_pexels_api_key_here

> If you wish to use your own credentials, replace the values in the `.env` file accordingly.

> Note: MongoDB Atlas is used as a cloud database. The database was configured to allow
external access.

---

### Frontend (`/frontend/.env`)
A `.env` file is required for the frontend. The ZIP submission already includes a working `.env` file.

The `.env` file should contain:

    VITE_API_URL=http://localhost:5000

> If you want to use a different backend URL, update this variable.


---

## Installation Instructions

### 1. Clone or extract the repository
If using the ZIP submission:
- Extract the ZIP file to a local folder.

---



### 2. Install backend dependencies
    - cd backend
    - npm install
---

Backend dependencies include:
- express
- mongoose
- cors
- dotenv
- (Optional) nodemon
 
 > The backend dependencies (express, mongoose, cors, dotenv, etc.) are already listed in package.json and will be installed automatically.

 > Nodemon is optional and can be used for development (npm install --save-dev nodemon).



### 3. Install frontend dependencies
    - cd quiiz-IT
    - npm install
---

Frontend dependencies include:
- react
- react-dom
- react-router-dom
- react-icons
- tailwindcss
- postcss
- autoprefixer
- Google Fonts: @fontsource/play & @fontsource/playball

 > The frontend is already configured with React, React Router, React Icons, Tailwind CSS, PostCSS, and Google Fonts (@fontsource/play & @fontsource/playball).


## Running the Application Locally

### 1. Start the backend server
    - cd backend
    - npm start


The backend will run on: http://localhost:5000
---

### 2. Start the frontend
     - cd quiiz-IT
     - npm run dev

The frontend will run on: http://localhost:5173



---

## Notes

- The application uses lazy loading to improve performance.
- When using the deployed backend on Render, the first request may take a few seconds
  to respond due to server cold start.
- API keys are required to fetch quiz data and images.
- Make sure both frontend and backend are running at the same time for the application to work correctly.
- The provided MONGO_URI points to a cloud MongoDB Atlas database with IP access open (0.0.0.0/0) so the application works out of the box.

---

## GitHub Repository

The full source code and documentation are available in the GitHub repository linked
in the course submission.
