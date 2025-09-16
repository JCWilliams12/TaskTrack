# TaskTrack - Task Management Application

A modern, full-stack task management application built with React, Node.js, Express, and MongoDB. Features user authentication, task CRUD operations, filtering, sorting, and a beautiful responsive UI.

## Features

### 🔐 Authentication
- User registration and login
- JWT-based authentication
- Secure password hashing with bcrypt
- Protected routes and API endpoints

### 📋 Task Management
- Create, read, update, and delete tasks
- Task status tracking (Pending, In Progress, Completed)
- Priority levels (Low, Medium, High)
- Due date management
- Task descriptions

### 🎨 User Interface
- Modern, responsive design
- Beautiful gradient backgrounds
- Interactive task cards with hover effects
- Real-time task statistics
- Advanced filtering and sorting
- Mobile-friendly interface

### 📊 Analytics
- Task completion rate
- Status breakdown
- Priority distribution
- Total task count

## Tech Stack

### Frontend
- **React 19** - UI framework
- **TypeScript** - Type safety
- **Vite** - Build tool and dev server
- **Axios** - HTTP client
- **CSS3** - Modern styling with gradients and animations

### Backend
- **Node.js** - Runtime environment
- **Express.js** - Web framework
- **MongoDB** - Database
- **Mongoose** - ODM for MongoDB
- **JWT** - Authentication tokens
- **bcryptjs** - Password hashing
- **CORS** - Cross-origin resource sharing

## Getting Started

### Prerequisites
- Node.js (v16 or higher)
- MongoDB (local or cloud instance)
- npm or yarn

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd TaskTrack
   ```

2. **Install server dependencies**
   ```bash
   cd server
   npm install
   ```

3. **Install client dependencies**
   ```bash
   cd ../client
   npm install
   ```

4. **Set up environment variables**

   **Server (.env)**
   ```bash
   cd ../server
   cp env.example .env
   ```
   
   Edit `.env` file:
   ```
   MONGO_URI=mongodb://localhost:27017/tasktrack
   JWT_SECRET=your-super-secret-jwt-key-here
   PORT=5001
   CLIENT_URL=http://localhost:5173
   ```

   **Client (.env)**
   ```bash
   cd ../client
   cp env.example .env
   ```
   
   Edit `.env` file:
   ```
   VITE_API_URL=http://localhost:5001
   ```

5. **Start MongoDB**
   Make sure MongoDB is running on your system.

6. **Start the development servers**

   **Terminal 1 - Backend**
   ```bash
   cd server
   npm run dev
   ```

   **Terminal 2 - Frontend**
   ```bash
   cd client
   npm run dev
   ```

7. **Open the application**
   Navigate to `http://localhost:5173` in your browser.

## API Endpoints

### Authentication
- `POST /api/auth/register` - Register a new user
- `POST /api/auth/login` - Login user
- `GET /api/auth/me` - Get current user info

### Tasks
- `GET /api/tasks` - Get all tasks (with filtering and sorting)
- `GET /api/tasks/:id` - Get a specific task
- `POST /api/tasks` - Create a new task
- `PUT /api/tasks/:id` - Update a task
- `DELETE /api/tasks/:id` - Delete a task
- `GET /api/tasks/stats/summary` - Get task statistics

### Query Parameters for GET /api/tasks
- `status` - Filter by status (pending, in-progress, completed)
- `priority` - Filter by priority (low, medium, high)
- `sortBy` - Sort by field (createdAt, dueDate, priority, title)
- `sortOrder` - Sort order (asc, desc)

## Project Structure

```
TaskTrack/
├── client/                 # React frontend
│   ├── src/
│   │   ├── components/     # React components
│   │   ├── contexts/       # React contexts
│   │   ├── hooks/          # Custom hooks
│   │   ├── types/          # TypeScript types
│   │   ├── api/            # API configuration
│   │   └── ...
│   └── package.json
├── server/                 # Node.js backend
│   ├── src/
│   │   ├── models/         # MongoDB models
│   │   ├── routes/         # API routes
│   │   ├── middleware/     # Custom middleware
│   │   └── server.ts       # Main server file
│   └── package.json
└── README.md
```

## Usage

1. **Register/Login**: Create an account or login with existing credentials
2. **Create Tasks**: Click "New Task" to add tasks with title, description, priority, and due date
3. **Manage Tasks**: Use the action buttons to edit, delete, or change task status
4. **Filter & Sort**: Use the filter controls to organize your tasks
5. **Track Progress**: View completion statistics and task breakdowns

## Features in Detail

### Task Management
- **Status Workflow**: Pending → In Progress → Completed → (back to Pending)
- **Priority System**: Visual indicators for task importance
- **Due Dates**: Optional due dates with overdue highlighting
- **Rich Descriptions**: Detailed task descriptions up to 500 characters

### User Experience
- **Responsive Design**: Works on desktop, tablet, and mobile
- **Real-time Updates**: Changes reflect immediately
- **Intuitive Interface**: Clean, modern design with smooth animations
- **Error Handling**: User-friendly error messages and validation

### Security
- **Password Hashing**: Secure password storage with bcrypt
- **JWT Tokens**: Stateless authentication
- **Input Validation**: Server-side validation for all inputs
- **CORS Protection**: Configured for secure cross-origin requests

## Development

### Available Scripts

**Server**
- `npm run dev` - Start development server with hot reload
- `npm run build` - Build for production
- `npm start` - Start production server
- `npm test` - Run tests

**Client**
- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint

### Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## License

This project is licensed under the MIT License.

## Support

For support or questions, please open an issue in the repository.