# Mini CRM Backend

This is the backend for a mini CRM application. It provides a RESTful API for managing users, customers, and tasks.

## Features

* User authentication (login)
* User management (CRUD)
* Role-based access control
* Customer management (CRUD)
* Task management (CRUD)

## Tech Stack

* Node.js
* Express
* MongoDB
* Mongoose

## Getting Started

1. Clone the repository
2. Install dependencies: `npm install`
3. Create a `.env` file and add the following environment variables:
   ```
   MONGO_URI=mongodb://localhost:27017/mini-crm
   JWT_SECRET=your_jwt_secret
   PORT=5000
   ```
4. Start the server: `npm start`
