import express, { Router } from "express"
import DBConnector from "../db/dbConnector";
import { Models } from "../db/initConnection";

/**
 * Defines the router which handles requests going to /api/Users
 * 
 * Created By: Chris Morgan
 */

  const router = express.Router()

  const User = Models.User

  /**
   * Get Users index
   */
  router.get("/", async (req, res) => {
    let records = await User.findAll()

    if (!records || records.length === 0) {
      res.sendStatus(404);
    }
  
    res.json(records.map(r => r.columns))
    res.sendStatus(200)
  })

  /**
   * Get User details
   */
  router.get("/:id", async (req, res) => {
    const id = parseInt(req.params.id)
    let record = await User.find(id)
  
    if (!record) {
      res.sendStatus(404)
    }
  
    res.json(record.columns)
    res.sendStatus(200)
  })

  /**
   * Create new User
   */
  router.put("/new", async (req, res) => {
    let record = User.create(req.body)

    await record.save()
  
    res.json(record.columns)
    res.sendStatus(200)
  })


  /**
   * Update Page Layout with given ID
   */
  router.patch("/:id", async (req, res) => {
    const id = parseInt(req.params.id)
    let record = User.create(req.body)
  
    if (record.columns.id !== id) {
      res.sendStatus(400)
    }
  
    await record.save()
  
    res.sendStatus(200)
  })

  /**
   * Delete User with given ID
   */
  router.delete("/:id", async (req, res) => {
    const id = parseInt(req.params.id)
    let record = await User.find(id)
    if (!record) {
      res.sendStatus(404)
    }
  
    record.delete()
    res.sendStatus(200)
  })
// gpt generated 
// needs review 
import { createUserHandler, assignUserRoleHandler, getUserDetailsHandler, listUsersHandler } from '../controllers/userController';

const router = Router();

// Route to create a new user
router.post('/', createUserHandler);

// Route to assign a role to a user
router.post('/:userId/roles/:roleId', assignUserRoleHandler);

// Route to get user details (including roles)
router.get('/:userId', getUserDetailsHandler);

// Route to list all users (optional)
router.get('/', listUsersHandler);

//gpt generated 

// POST /register - User registration route
router.post('/register', registerUser);

// POST /login - User login route
router.post('/login', loginUser);

// POST /logout - User logout route (only for authenticated users)
router.post('/logout', authenticateJWT, logoutUser);

export default router
