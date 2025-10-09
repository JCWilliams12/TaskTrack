# TaskTrack - Task Management Application

A modern, full-stack task management application built with React, Node.js, Express, and MongoDB. Features user authentication, task CRUD operations, filtering, sorting, and a beautiful responsive UI.

## Features

### Authentication
- User registration and login
- JWT-based authentication
- Secure password hashing with bcrypt
- Protected routes and API endpoints

### Task Management
- Create, read, update, and delete tasks
- Task status tracking (Pending, In Progress, Completed)
- Priority levels (Low, Medium, High)
- Due date management
- Task descriptions

### User Interface
- Modern, responsive design
- Beautiful gradient backgrounds
- Interactive task cards with hover effects
- Real-time task statistics
- Advanced filtering and sorting
- Mobile-friendly interface

### Analytics
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

( This Project is hosted on the web at https://task-track-2xtlr3ehe-jcwilliams12s-projects.vercel.app/ ) 

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

   **Option A: Separate Development Servers (Recommended for Development)**
   
   **Terminal 1 - Backend**
   ```bash
   cd server
   npm run dev
   ```
   Backend will run on `http://localhost:5001`

   **Terminal 2 - Frontend**
   ```bash
   cd client
   npm run dev
   ```
   Frontend will run on `http://localhost:5173`

   **Option B: Full-Stack Development (Server serves both API and React app)**
   
   **Terminal 1 - Build and Start Backend**
   ```bash
   cd server
   npm run build
   npm start
   ```
   Full application will be available at `http://localhost:5001`

7. **Open the application**
   - **Separate servers**: Navigate to `http://localhost:5173` (frontend)
   - **Full-stack**: Navigate to `http://localhost:5001` (backend serves React app)
   - **API Health Check**: `http://localhost:5001/health`
   - **API Documentation**: `http://localhost:5001/api`

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
- `npm test -- --coverage` - Run tests with coverage report
- `npm test -- --watch` - Run tests in watch mode
- `npm test -- --verbose` - Run tests with detailed output

**Client**
- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint
- `npm test` - Run tests
- `npm test -- --coverage` - Run tests with coverage report
- `npm test -- --watch` - Run tests in watch mode

## Testing

This project includes comprehensive unit tests for both frontend and backend components.

### Test Structure

**Backend Tests (Jest)**
- **Location**: `server/src/tests/`
- **Test Files**:
  - `auth.test.ts` - Authentication functionality tests
  - `auth.validation.test.ts` - Authentication validation tests
  - `tasks.test.ts` - Task CRUD operations tests
  - `tasks.access.test.ts` - Task access control and authorization tests
  - `tasks.stats.test.ts` - Task statistics and analytics tests
  - `tasks.validation.test.ts` - Task validation tests

**Frontend Tests (Vitest)**
- **Location**: `client/src/` (co-located with components)
- **Test Files**:
  - `components/LoginForm.test.tsx` - Login form component tests
  - `components/RegisterForm.test.tsx` - Registration form component tests
  - `contexts/AuthContext.test.tsx` - Authentication context tests
  - `hooks/useTasks.test.tsx` - Custom tasks hook tests

### Running Tests

**Run All Backend Tests**
```bash
cd server
npm test
```

**Run All Frontend Tests**
```bash
cd client
npm test
```

**Run Tests with Coverage**
```bash
# Backend
cd server
npm test -- --coverage

# Frontend
cd client
npm test -- --coverage
```

**Run Tests in Watch Mode**
```bash
# Backend
cd server
npm test -- --watch

# Frontend
cd client
npm test -- --watch
```

**Run Specific Test Files**
```bash
# Backend - Run specific test file
cd server
npm test -- auth.test.ts

# Frontend - Run specific test file
cd client
npm test -- LoginForm.test.tsx
```

### Test Coverage

Both test suites generate detailed coverage reports:

- **Backend Coverage**: Generated in `server/coverage/` directory
- **Frontend Coverage**: Generated in `client/coverage/` directory

Coverage reports include:
- Line coverage percentage
- Branch coverage analysis
- Function coverage details
- HTML reports for detailed analysis

### Test Configuration

**Backend (Jest)**
- Uses Jest with TypeScript support
- MongoDB Memory Server for database testing
- Comprehensive middleware and controller testing
- API endpoint testing with Supertest

**Frontend (Vitest)**
- Uses Vitest with React Testing Library
- jsdom environment for DOM testing
- Component rendering and interaction testing
- Hook and context testing

### Writing Tests

**Backend Test Example**
```typescript
// server/src/tests/auth.test.ts
describe('Authentication', () => {
  test('should register a new user', async () => {
    const userData = {
      username: 'testuser',
      email: 'test@example.com',
      password: 'password123'
    };
    
    const response = await request(app)
      .post('/api/auth/register')
      .send(userData)
      .expect(201);
      
    expect(response.body.token).toBeDefined();
  });
});
```

**Frontend Test Example**
```typescript
// client/src/components/LoginForm.test.tsx
import { render, screen, fireEvent } from '@testing-library/react';
import { LoginForm } from './LoginForm';

test('renders login form', () => {
  render(<LoginForm />);
  expect(screen.getByLabelText(/username/i)).toBeInTheDocument();
  expect(screen.getByLabelText(/password/i)).toBeInTheDocument();
});
```

### Development Workflow

**Before making changes:**
1. Run tests to ensure everything is working
   ```bash
   # Backend tests
   cd server && npm test
   
   # Frontend tests  
   cd client && npm test
   ```

**During development:**
1. Use watch mode for continuous testing
   ```bash
   # Backend watch mode
   cd server && npm test -- --watch
   
   # Frontend watch mode
   cd client && npm test -- --watch
   ```

**Before committing:**
1. Run all tests with coverage
   ```bash
   # Backend coverage
   cd server && npm test -- --coverage
   
   # Frontend coverage
   cd client && npm test -- --coverage
   ```

2. Ensure all tests pass and coverage meets requirements

### Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. **Add tests for new functionality**
5. **Ensure all existing tests pass**
6. **Run coverage reports to verify test quality**
7. Submit a pull request

**Testing Requirements:**
- New features must include appropriate unit tests
- Test coverage should not decrease
- All tests must pass before submitting PR
- Include both positive and negative test cases

## License

This project is licensed under the MIT License.

## Support

For support or questions, please open an issue in the repository.
