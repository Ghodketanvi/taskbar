# Taskbar - Task Tracker

A full-stack MERN application for managing tasks and job applications with user authentication, status tracking, search, and filtering capabilities.

## Features

- ✅ **User Authentication**: Secure signup/login with JWT tokens
- ✅ **Task Management**: Create, read, update, and delete tasks
- ✅ **Job Applications**: Track job applications with custom statuses
- ✅ **Status Tracking**: Monitor task progress (pending, in-progress, completed, on-hold)
- ✅ **Search & Filter**: Find tasks by title, description, company, or job title
- ✅ **Priority Levels**: Organize tasks by priority (low, medium, high)
- ✅ **Dashboard**: View statistics and task counts at a glance
- ✅ **Sorting**: Sort by due date, priority, or creation date

## Tech Stack

### Backend
- **Node.js** with Express.js
- **MongoDB** for data persistence
- **JWT** for authentication
- **bcryptjs** for password hashing
- **express-validator** for input validation

### Frontend
- React.js (to be created in client folder)
- Redux or Context API for state management
- Axios for API calls

## Setup Instructions

### Prerequisites
- Node.js (v14 or higher)
- MongoDB (local or MongoDB Atlas)
- npm or yarn

### Backend Setup

1. Clone the repository:
```bash
git clone https://github.com/Ghodketanvi/taskbar.git
cd taskbar
```

2. Install dependencies:
```bash
npm install
```

3. Create a `.env` file:
```bash
cp .env.example .env
```

4. Configure your `.env` file:
```env
MONGODB_URI=mongodb://localhost:27017/taskbar
JWT_SECRET=your_secure_secret_key_here
PORT=5000
NODE_ENV=development
```

5. Start the server:
```bash
npm run dev
```

The backend will run on `http://localhost:5000`

### Frontend Setup

1. Create React app in client folder:
```bash
npx create-react-app client
cd client
```

2. Install additional dependencies:
```bash
npm install axios react-router-dom
```

3. Create a `.env` file in client folder:
```env
REACT_APP_API_URL=http://localhost:5000/api
```

4. Start the frontend:
```bash
npm start
```

The frontend will run on `http://localhost:3000`

## API Endpoints

### Authentication
- `POST /api/auth/signup` - Register a new user
- `POST /api/auth/login` - Login user

### Tasks
- `GET /api/tasks` - Get all tasks (with filters: status, priority, type, search, sortBy)
- `POST /api/tasks` - Create a new task
- `GET /api/tasks/:id` - Get task by ID
- `PUT /api/tasks/:id` - Update a task
- `DELETE /api/tasks/:id` - Delete a task
- `GET /api/tasks/stats/dashboard` - Get dashboard statistics

## Task Object Structure

```json
{
  "_id": "ObjectId",
  "userId": "ObjectId",
  "title": "string",
  "description": "string",
  "status": "pending|in-progress|completed|on-hold",
  "priority": "low|medium|high",
  "type": "task|job-application",
  "dueDate": "Date",
  "company": "string",
  "jobTitle": "string",
  "applicationStatus": "applied|under-review|interview|rejected|accepted",
  "tags": ["string"],
  "createdAt": "Date",
  "updatedAt": "Date"
}
```

## Usage Examples

### Create a Task
```bash
curl -X POST http://localhost:5000/api/tasks \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "title": "Complete project",
    "description": "Finish the MERN stack project",
    "status": "in-progress",
    "priority": "high",
    "type": "task",
    "dueDate": "2024-12-31"
  }'
```

### Search Tasks
```bash
curl -X GET "http://localhost:5000/api/tasks?search=project&status=in-progress" \
  -H "Authorization: Bearer YOUR_TOKEN"
```

### Get Dashboard Stats
```bash
curl -X GET http://localhost:5000/api/tasks/stats/dashboard \
  -H "Authorization: Bearer YOUR_TOKEN"
```

## Folder Structure

```
taskbar/
├── models/
│   ├── User.js
│   └── Task.js
├── routes/
│   ├── authRoutes.js
│   └── taskRoutes.js
├── middleware/
│   └── authMiddleware.js
├── server.js
├── package.json
├── .env.example
└── README.md
```

## Future Enhancements

- [ ] Email notifications for task reminders
- [ ] Recurring tasks
- [ ] Collaborative task management
- [ ] Task attachments
- [ ] Calendar view
- [ ] Export/Import functionality
- [ ] Dark mode support
- [ ] Mobile app with React Native

## License

MIT License - feel free to use this project for personal or commercial purposes.

## Support

For issues or questions, please create an issue in the GitHub repository.
