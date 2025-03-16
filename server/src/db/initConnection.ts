import DBConnector from "../db/dbConnector";
import { ModelBuilder } from "./models/Models";

export const dbConnector = new DBConnector()

export const Models = ModelBuilder(dbConnector);
