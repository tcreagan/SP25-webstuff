/**
 * This module will be used to manage connecting and querying the database
 * 
 * Created By: Chris Morgan
 * 
 * see https://github.com/mysqljs/mysql for details on mysql js library
 */

import mysql from 'mysql'

require("dotenv").config()

export default class DBConnector {
  connectionPool!: mysql.Pool

  constructor() {
    this.connectionPool = mysql.createPool({
      connectionLimit: 10,
      host: process.env.dbhost,
      user: process.env.dbuser,
      password: process.env.dbpass,
      database: process.env.dbname
    })
  }

  close() {
    this.connectionPool.end()
  }

  async create(tableName: string, payload: { [key: string]: any }) {
    let sql = mysql.format(`INSERT INTO ?? SET ?`, [tableName, payload], false)

    const res = await this.runQuery(sql)

    const newRecord = await this.runQuery(`SELECT * FROM ${tableName} WHERE id = ${res.insertId}`)

    return newRecord[0]
  }

  update(tableName: string, payload: { [key: string]: string }) {
    let sql = mysql.format("UPDATE ?? SET ? WHERE id = ?", [tableName, payload, payload["id" as keyof object]])

    return this.runQuery(sql)
  }

  delete(tableName: string, id: number | string) {
    let query = mysql.format(`DELETE FROM ? WHERE id = ?`, [tableName, id])

    return this.runQuery(query)
  }

  async find(tableName: string, id: number | string) {
    let query = mysql.format(`SELECT * FROM ? WHERE ID = ?`, [tableName, id])

    let res = await this.runQuery(query)

    return res[0]
  }

  findAll(tableName: string, args?:{[key:string]:any}) {
    let query = !!args ? mysql.format("SELECT * FROM ? WHERE ?", [tableName, args]):mysql.format("SELECT * FROM ?",[tableName]);

    return this.runQuery(query);
  }

  /**
   * Gets all records from targetTable such that each ID corresponds to a row
   * in the relation table also pointing to source table
   * @param targetTable Table containing data which will be returned
   * @param sourceTable Table containing the search ID to be used agains the relation table
   * @param relationTable Name of the table used to define the relation
   * @param relationTargetId name of the Column on the relation table which points to the target table
   * @param relationSourceId name of the column on the relation table which points to the source table
   * @returns 
   */
  findAllVia(targetTable:string, sourceTable:string, relationTable:string, relationTargetId:number, relationSourceId:number){
    const prototype = "SELECT DISTINCT ?.*\n" + 
                      "FROM ??\n" + 
                      "JOIN ?? on ?.? = ?.id\n" + 
                      "JOIN ?? on ?.? = ?.id"
    /**
     * SELECT DISTINCT targetTable.*
     * FROM relationTable
     * JOIN targetTable on relationTable.relationTargetId = targetTable.id
     * JOIN sourceTable on relationTable.relationSourceId = sourceTable.id
     */
    const sql = mysql.format(prototype, [targetTable, relationTable, targetTable,
                                         relationTable, relationTargetId, targetTable,
                                         sourceTable, relationTable, relationSourceId,
                                         sourceTable])

    return this.runQuery(sql)
  }

  //#region helpers

  /**
   * A wrapper function to ensure safe connection management of executed sql queries
   */
  executionWrapper(func: (con: mysql.Connection) => void) {
    this.connectionPool.getConnection((err, connection) => {
      if (err) {
        console.error('error connecting to db: ' + err.stack)
        return;
      }

      console.log(`Connected as id: ${connection.threadId}`)
      func(connection)
      connection.release()
    })
  }

  /**
   * Run the given query against the database
   * @param query 
   * @returns 
   */
  async runQuery(query: string) {
    let result: any;
    console.log(`Executing query:\n${query}`)
    await new Promise<void>((resolve) => {
      this.executionWrapper((connection) => {
        connection.query(query, (err, res, fields) => {
          if (err) throw err;
          result = res;
          resolve()
        })
      })
    })
    return result;
  }

  //#endregion
}
