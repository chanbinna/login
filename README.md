# Login System (Next.js, GraphQL, MongoDB)

This repository contains a login system built with Next.js for the frontend, GraphQL for the backend, and MongoDB for the database.

## Setup Guide

Follow these steps to set up and run the login system:

### 1. Clone the Repository
- Clone this repository to your local machine.

### 2. Configure Backend Environment
- Navigate to the `/backend` directory.
- Create a `.env` file and add your MongoDB connection string and a JWT secret as follows:
  ```env
  MONGO_URI=your_mongodb_connection_url
  JWT_SECRET=your_secret_key
  ```

### 3. Install Frontend Dependencies
- Navigate to the `/frontend` directory.
- Run the following command in the terminal to install all required packages:
  ```bash
  npm install
  ```

### 4. Start the Frontend
- In the `/frontend` directory, start the development server by running:
  ```bash
  npm run dev
  ```

### 5. Install Backend Dependencies
- Navigate to the `/backend` directory.
- Run the following command in the terminal to install all required packages:
  ```bash
  npm install
  ```

### 6. Start the Backend
- In the `/backend` directory, start the development server by running:
  ```bash
  npm run dev
  ```

## Access the Application

Your login system should now be running locally. Open your browser and navigate to the frontend URL:

- **Frontend URL**: [http://localhost:3000](http://localhost:3000)

You can now test the application. 🚀
