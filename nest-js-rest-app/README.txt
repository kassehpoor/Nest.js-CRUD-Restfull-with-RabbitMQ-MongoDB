# Nest REST App

This is a sample Nest.js application that demonstrates CRUD operations, MongoDB integration, RabbitMQ events, and more.

## Prerequisites

- Node.js and npm installed
- MongoDB server running
- RabbitMQ server running

## Installation

1.Install dependencies:
cd nest-rest-app
npm install

2.Set up environment variables:

Create a `.env` file in the root directory with the following content:
MONGODB_URI=your_mongodb_connection_string
RMQ_URL=amqp://localhost:5672
RMQ_QUEUE=user_queue

## Building the App
To build the app, run:
npm run build

##Running the App
To start the app in development mode, run:
npm run start:dev

The app will be accessible at `http://localhost:3000`.

## Testing
To run tests, use:
npm test

## API Endpoints

-POST /users: Create a new user.
-GET /users: Get a list of all users.
-GET /users/:id: Get details of a specific user.
-PUT /users/:id: Update details of a specific user.
-DELETE /users/:id: Delete a specific user.

## Technology Stack
Nest.js
MongoDB
RabbitMQ

## Contributing
Contributions are welcome! If you find any issues or want to add new features, please contact by my email : `kasehpoor.k@gmail.com` .

## License
This project is licensed under the MIT License - see the LICENSE.md file for details.

Make sure to replace placeholders like `your_mongodb_connection_string` with your actual MongoDB connection string.

Feel free to add or modify sections based on your specific project details.

