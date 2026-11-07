# Study Planner — Full-Stack Web Application

**Name:** R. Dheeraj Kumar
**Registration Number:** 2024070093

## 🔗 Submission Links

- **GitHub Repository:** `<PASTE YOUR GITHUB REPO LINK HERE>`
- **Live Deployment (Vercel):** `<PASTE YOUR VERCEL LINK HERE>`

---

## 1. Problem Statement

Students often struggle to keep track of assignments, exam preparation and deadlines across several subjects. Notes get scattered across notebooks, chats and sticky notes, which leads to missed deadlines and last-minute stress.

**Study Planner** is a simple web application that lets a student record study tasks with a subject, due date and priority, mark them as completed, edit them and delete them, all in one place.

## 2. Features

- Add, view, edit and delete study tasks (full CRUD)
- Subject, due date and priority (High / Medium / Low) for every task
- Mark tasks as done / pending with a checkbox
- Filter tasks: All / Pending / Done
- Progress counter (completed / total)
- Input validation (title required) and error messages
- Fully responsive UI (works on mobile and desktop)

## 3. Technology Stack

| Layer      | Technology                                   |
|------------|----------------------------------------------|
| Frontend   | HTML, CSS, JavaScript, ReactJS (Vite)        |
| Backend    | NodeJS, ExpressJS (RESTful API)              |
| Database   | MongoDB (via `MONGODB_URI`) or JSON file store |
| Deployment | GitHub + Vercel                              |

**Storage note:** The data layer (`db.js`) supports MongoDB. If the `MONGODB_URI` environment variable is set, all CRUD operations are performed on a MongoDB collection (`studyplanner.tasks`). If it is not set, the app uses a local JSON file (`data/tasks.json`) so it runs with zero setup. The REST API and the React frontend behave identically in both modes. On Vercel without MongoDB, the JSON store is temporary (data resets when the serverless function restarts); set `MONGODB_URI` for permanent storage.

## 4. REST API Endpoints

| Method | Endpoint           | Description         |
|--------|--------------------|---------------------|
| GET    | `/api/health`      | Health check        |
| GET    | `/api/tasks`       | Get all tasks       |
| POST   | `/api/tasks`       | Create a new task   |
| PUT    | `/api/tasks/:id`   | Update a task       |
| DELETE | `/api/tasks/:id`   | Delete a task       |

Example task object:

```json
{
  "id": "uuid",
  "title": "Revise Chapter 5",
  "subject": "Physics",
  "dueDate": "2026-11-12",
  "priority": "High",
  "done": false,
  "createdAt": "2026-11-06T10:00:00.000Z"
}
```

## 5. Project Structure

```
study-planner/
├── api/index.js        # Vercel serverless entry (wraps Express app)
├── app.js              # Express app and REST routes
├── db.js               # Data layer (MongoDB or JSON file)
├── server.js           # Local server (serves API + built React app)
├── data/tasks.json     # JSON data file with sample tasks
├── vercel.json         # Vercel build/routing configuration
├── package.json        # Backend dependencies and scripts
└── client/             # React frontend (Vite)
    ├── index.html
    ├── vite.config.js
    └── src/
        ├── main.jsx
        ├── App.jsx
        └── styles.css
```

## 6. Run Locally

Requirements: Node.js 18+

```bash
npm install
npm run build      # installs client deps and builds the React app
npm start          # open http://localhost:5000
```

Development mode (two terminals):

```bash
npm install
node server.js                     # terminal 1 - API on :5000
cd client && npm install && npm run dev   # terminal 2 - React on :5173
```

To use MongoDB, set `MONGODB_URI` (for example a MongoDB Atlas connection string) before starting the server.

## 7. Deployment

1. Push the code to GitHub.
2. Import the repository in Vercel (vercel.com → Add New → Project).
3. Set the Vercel project root to the repository root and click **Deploy**. The root `vercel.json` configures the Express API and Vite client as separate services, routing `/api/*` to the API and all other paths to the client.
4. Optional: add the `MONGODB_URI` environment variable in Vercel project settings for persistent MongoDB storage.

The API and client currently communicate through the public same-origin `/api` routes, so no internal service binding is required.

## 8. Conclusion

The project demonstrates a complete full-stack workflow: a responsive React user interface, a RESTful API built with Node and Express, CRUD operations on persistent storage, version control with Git/GitHub and cloud deployment on Vercel.
