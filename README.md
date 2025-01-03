# Egyptian Premier League Match Reservation System

## Overview
This project is a web-based application designed to automate the ticket reservation process for the Egyptian Premier League. It enables different user roles (administrators, EFA managers, fans, and guests) to interact with the system, each with specific functionalities like managing matches, reserving seats, and viewing match details.

## Technology Stack
- **Frontend**: React
- **Backend**: Node.js with Express
- **Database**: MongoDB (Cloud-hosted)

## Features
1. User Authentication: Login and registration for different user roles.
2. Match Management: Creation, editing, and viewing of match details by EFA managers.
3. Seat Reservation: Graphical seat selection and real-time status updates.
4. Role-Based Access: Site administrators, EFA managers, fans, and guests have distinct permissions.

## Installation and Setup
1. Clone the repository and open 2 terminals:
```bash
git clone https://github.com/goushaa/Egyptian-League-App.git
cd Egyptian-League-App
```

2. In the backend terminal:
```bash
cd backned
npm install
npm start
```

3. In the backend terminal:
```bash
cd frontend
npm install
npm start
```

4. Open the app in your browser at `http://localhost:3001`.