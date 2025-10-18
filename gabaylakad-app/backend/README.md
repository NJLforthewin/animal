# GabayLakad Backend Application

## Overview
The GabayLakad backend application is built using Node.js and Express, providing a RESTful API for user authentication and contact management. This application serves as the backend for the GabayLakad project, which aims to support caregivers in monitoring and assisting visually impaired individuals.

## Features
- User authentication (login and registration)
- Secure password storage using hashing
- Contact management for caregivers
- Middleware for authentication and authorization

## Getting Started

### Prerequisites
- Node.js (version 14 or higher)
- npm (Node package manager)

### Installation
1. Clone the repository:
   ```
   git clone https://github.com/yourusername/gabaylakad-app.git
   ```
2. Navigate to the backend directory:
   ```
   cd gabaylakad-app/backend
   ```
3. Install the dependencies:
   ```
   npm install
   ```

### Configuration
- Create a `.env` file in the `backend` directory to store environment variables such as database connection strings and secret keys.

### Running the Application
To start the backend server, run:
```
npm run start
```
The server will be running on `http://localhost:3000`.

### API Endpoints
- **POST /api/auth/login**: Authenticate a user and return a token.
- **POST /api/auth/register**: Register a new user.

## Testing
To run tests, use:
```
npm test
```

## License
This project is licensed under the MIT License. See the LICENSE file for details.

## Acknowledgments
- Thanks to the contributors and the open-source community for their support and resources.