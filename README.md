P2P is a full-stack web application built using React for the frontend and Node.js with Express for the backend. It includes authentication, data storage using MongoDB, and provides a seamless user experience.

Prerequisites

Before running this project, ensure you have the following installed:

Node.js (Recommended version: 16.x or later)

MongoDB (Either locally installed or a cloud database like MongoDB Atlas)

Installation

Clone the Repository

git clone <repository_url>
cd p2p

Install Dependencies

npm install

Setup Environment Variables

Create a .env file in the backend directory and add the necessary configurations, such as:

MONGO_URI="mongodb+srv://yaaryash:yaaryash3434@cluster0.bt1wv.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0"

JWT_SECRET=yaaryash
PORT=5000

Running the Application

Backend Server

To start the backend server:

cd backend
npm run dev

If you encounter issues, install nodemon:

npm install -g nodemon

Frontend Server

To start the frontend application:

cd frontend
npm start

If the frontend doesn’t start, try reinstalling dependencies:

npm install

Folder Structure

/p2p
│── frontend/      # React application
│── backend/       # Node.js & Express backend
│── package.json   # Project metadata
│── README.md      # Project documentation

Technologies Used

Frontend

React (^19.0.0)

Material-UI

Axios

React Router DOM

Backend

Node.js

Express

MongoDB & Mongoose

JSON Web Token (JWT) for authentication

bcrypt.js for password hashing

dotenv for environment variables

cors for cross-origin requests

API Endpoints (Backend)

Method

Endpoint

Description

POST

/api/auth/register

Register a new user

POST

/api/auth/login

Authenticate user

GET

/api/data

Fetch application data

Troubleshooting

If you encounter CORS issues, make sure your frontend is correctly configured to communicate with the backend.

If MongoDB fails to connect, verify that the connection string in .env is correct.

Contributing

Contributions are welcome! Please submit a pull request with detailed explanations for any improvements.
