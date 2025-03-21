import express, { Router } from "express"
import DBConnector from "../db/dbConnector";
import { Models } from "../db/initConnection";

/**
 * Defines the router which handles requests going to /api/Roles
 * 
 * Created By: Chris Morgan
 */

const router = express.Router()

const Role = Models.Role

/**
 * Get Roles index
 */
router.get("/", async (req, res) => {
  let records = await Role.findAll()

  if(!records || records.length === 0){
    res.sendStatus(404);
  }

  res.json(records.map(r => r.columns))
  res.sendStatus(200)
})

/**
 * Get Role details
 */
router.get("/:id", async (req, res) => {
  const id = parseInt(req.params.id)
  let record = await Role.find(id)

  if(!record){
    res.sendStatus(404)
  }

  res.json(record.columns)
  res.sendStatus(200)
})

/**
 * Create new Role
 */
router.put("/new", async (req, res) => {
  let record = Role.create(req.body)

  await record.save()

  res.json(record.columns)
  res.sendStatus(200)
})


/**
 * Update Page Layout with given ID
 */
router.patch("/:id", async (req, res) => {
  const id = parseInt(req.params.id)
  let record = Role.create(req.body)

  if(record.columns.id !== id){
    res.sendStatus(400)
  }

  await record.save()

  res.sendStatus(200)
})

/**
 * Delete Role with given ID
 */
router.delete("/:id", async (req, res) => {
  const id = parseInt(req.params.id)
  let record = await Role.find(id)
  if(!record){
    res.sendStatus(404)
  }

  record.delete()
  res.sendStatus(200)
})


export default router;