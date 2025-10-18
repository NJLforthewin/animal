# GabayLakad App

## Overview
GabayLakad is a web application designed to provide caregivers with tools to monitor and support visually impaired individuals. The application consists of a backend built with Express and TypeScript, and a frontend developed using React.

## Project Structure
The project is organized into two main directories: `backend` and `frontend`.

```
gabaylakad-app
├── backend
│   ├── src
│   │   ├── controllers
│   │   ├── routes
│   │   ├── models
│   │   ├── middleware
│   │   ├── utils
│   │   └── app.ts
│   ├── package.json
│   ├── tsconfig.json
│   └── README.md
├── frontend
│   ├── src
│   │   ├── components
│   │   ├── pages
│   │   ├── App.tsx
│   │   ├── index.tsx
│   │   └── styles
│   ├── package.json
│   ├── tsconfig.json
│   └── README.md
└── README.md
```

## Backend Setup
1. Navigate to the `backend` directory:
   ```
   cd backend
   ```

2. Install dependencies:
   ```
   npm install
   ```

3. Start the backend server:
   ```
   npm start
   ```

4. The backend will be running on `http://localhost:5000` (or the specified port in your configuration).

## Frontend Setup
1. Navigate to the `frontend` directory:
   ```
   cd frontend
   ```

2. Install dependencies:
   ```
   npm install
   ```

3. Start the frontend application:
   ```
   npm start
   ```

4. The frontend will be running on `http://localhost:3000` (or the specified port in your configuration).

## Features
- **User Authentication**: Secure login and registration for caregivers.
- **Dashboard**: A user-friendly interface to monitor and manage information.
- **Real-time Tracking**: Monitor the location and status of visually impaired individuals.

## Contributing
Contributions are welcome! Please submit a pull request or open an issue for any enhancements or bug fixes.

## License
This project is licensed under the MIT License. See the LICENSE file for more details.