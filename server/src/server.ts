/**
 * Serves as the web servers main entrypoint
 * 
 * Created By: Chris Morgan
 */

//#region imports
import { Request, Response} from 'express-serve-static-core';
import path from 'path';
import env from 'dotenv'
const express = require('express');  // CommonJS import style
import EventRouter from "./routers/EventRouter"
import PageLayoutRouter from "./routers/PageLayoutRouter"
import PageRouter from "./routers/PageRouter"
import ProjectRouter from "./routers/ProjectRouter"
import RoleRouter from "./routers/RoleRouter"
import SectionLayoutRouter from "./routers/SectionLayoutRouter"
import UserRouter from "./routers/UserRouter"
import UserTypesRouter from "./routers/UserTypesRouter"
import WidgetRouter from "./routers/WidgetRouter"
import axios from 'axios' 
import cors from 'cors'; 
//#endregion

env.config()

const app: Express = express();
app.use(express.json());
const port = process.env.PORT || 3000;

// Base Routers
const rootRouter = express.Router();
const apiRouter = express.Router();

// Logging requests for better visibility
app.use((req: Request, res: Response, next: any) => {
  console.log(`[Request] ${req.method} ${req.url}`);
  next();
});

// Simple test route to verify server status
app.get('/status', (req: Request, res: Response) => {
  res.send('Server is up and running');
});


// Configure to use static files from the React build
const buildPath = path.normalize(path.join(__dirname, './client'));
app.use(express.static(buildPath));

// Simple route to verify server status
apiRouter.get('/test', (req: Request, res: Response) => {
  res.json({ message: 'Server is working' });
});

// Apply API router
app.use('/api', apiRouter);

app.use((req: Request, res: Response, next: any) => {
  console.log(req.url)
  next();
})


// Configure a final fallback middleware for the api router
apiRouter.use((req, res, next) => {
  try{
    next()
  }
  catch{
    res.sendStatus(500)
  }
})

// Serve the frontend for any unmatched routes
app.get('/*', (req: Request, res: Response) => {
  res.sendFile(path.join(__dirname, '../client/build/index.html'));
});

// Implement the `/register` route in the main server (or move it to UserRouter if preferred)
apiRouter.post('/register', (req: Request, res: Response) => {
  const { username, password } = req.body;

  console.log('Register request received:', req.body); // Logging the request

  // Simple validation (you should add more complex validation & password hashing)
  if (!username || !password) {
    return res.status(400).json({ message: 'Username and password are required' });
  }

  // Example user store (you would use a database in a real-world app)
  const users = [{ username: 'existingUser', password: 'password123' }];
  const userExists = users.find(user => user.username === username);

  if (userExists) {
    return res.status(409).json({ message: 'Username already taken' });
  }

  // Simulate user registration (in-memory, replace with database logic)
  const newUser = { username, password };
  users.push(newUser);

  console.log('New user registered:', newUser);

  // Respond with success (including a dummy token)
  return res.status(201).json({ username, token: 'dummy-token' });
});

// Configure all the routing for the backend api
apiRouter.use("/events", EventRouter);
apiRouter.use("/pagelayouts", PageLayoutRouter);
apiRouter.use("/pages", PageRouter);
apiRouter.use("/projects", ProjectRouter);
apiRouter.use("/roles", RoleRouter);
apiRouter.use("/sectionlayouts", SectionLayoutRouter);
apiRouter.use("/users", UserRouter);
apiRouter.use("/usertypes", UserTypesRouter);
apiRouter.use("/widgets", WidgetRouter);

rootRouter.use("/api", apiRouter);

// Default all other paths to be handled by the react router
rootRouter.get('(/*)?', async (req: Request, res: Response, next: any) => {
  res.sendFile(path.join(buildPath, 'index.html'));
});
//router image gallery
apiRouter.get("/pexels", async (req: Request, res: Response) => {
  const query = req.query.query || "Nature";
  const page = req.query.page || 1;
  const url = `https://api.pexels.com/v1/search?query=${query}&per_page=10&page=${page}`;

  try {
    const response = await axios.get(url, {
      headers: { Authorization: process.env.PEXELS_API_KEY } // Use your API key from .env
    });
    res.json(response.data); // Send the response back to the client
  } catch (error) {
    console.error("Error fetching images from Pexels", error);
    res.status(500).send("Error fetching images from Pexels");
  }
});

app.use(rootRouter);


// Global error handler for better logging
app.use((err: any, req: Request, res: Response, next: any) => {
  console.error(`[Error] ${err.message}`, err);
  res.status(500).json({ message: 'Internal Server Error' });
});

app.listen(port, ()=> {
console.log(`[Server]: Listening on port: ${port}`);
});
});
