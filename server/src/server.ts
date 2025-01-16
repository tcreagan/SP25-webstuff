/**
 * Serves as the web servers main entrypoint
 * 
 * Created By: Chris Morgan
 */

//#region imports
import express, {Express, Request, Response} from 'express';
import path from 'path';
import env from 'dotenv'

import EventRouter from "./routers/EventRouter"
import PageLayoutRouter from "./routers/PageLayoutRouter"
import PageRouter from "./routers/PageRouter"
import ProjectRouter from "./routers/ProjectRouter"
import RoleRouter from "./routers/EventRouter"
import SectionLayoutRouter from "./routers/SectionLayoutRouter"
import UserRouter from "./routers/UserRouter"
import UserTypesRouter from "./routers/UserTypesRouter"
import WidgetRouter from "./routers/WidgetRouter"
//#endregion

env.config()

const app: Express = express();

const port = process.env.PORT

// Base Routers
const rootRouter = express.Router();
const apiRouter = express.Router();



// Configure to use static files from the React build
const buildPath = path.normalize(path.join(__dirname, './client'));
app.use(express.static(buildPath));

app.use((req, res, next) => {
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
rootRouter.get('(/*)?', async (req, res, next) => {
  res.sendFile(path.join(buildPath, 'index.html'));
});

app.use(rootRouter);

app.listen(port, ()=> {
console.log(`[Server]: Listening on port:${port}`);
});