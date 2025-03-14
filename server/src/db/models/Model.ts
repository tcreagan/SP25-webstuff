import DBConnector from "db/dbConnector"
import { populate } from "dotenv"
import "reflect-metadata"

export const MDKeys = {
  isColumn: "isColumn",
  isGenerated: "isGenerated",
  isRequired: "isRequired",
  tableName: "tableName",
  HasOne: "HasOne",
  HasMany: "HasMany",
  BelongsTo: "BelongsTo",
  Relations: "Relations",
  RelationTable: "RelationTable"
}

// #region Types

type RelationMetadata<T extends Model> = {
  getRecords:()=>Promise<any[]>,
  propKey:string|symbol
}

export type ModelConstructor<T extends Model> = {
  new ():T;
  create<T extends Model>(this: ModelConstructor<T>, data: Partial<T>) : T
  find<T extends Model>(this:ModelConstructor<T>, id:number):Promise<T>
  tableName:()=>string,
}

type RelationTableData = {
  tableName:string, // name of the join table
  relatedTableName:string, // name of the table holding the
                           // related records
  idCol:string, // Column in the join table pointing to the source Model
  relatedIdCol:string // Column in the join table pointing to the related Model
}

type ModelErrors = {
  [key:string]: string[]
}

// #endregion

// #region Decorators

export const Column:PropertyDecorator = (target:object, propertyKey:string | symbol):void => {
  Reflect.defineMetadata(MDKeys.isColumn, true, target, propertyKey)
}

export const Generated:PropertyDecorator = (target:object, propertyKey:string | symbol):void => {
  Reflect.defineMetadata(MDKeys.isGenerated, true, target, propertyKey)
}

export const Required:PropertyDecorator = (target:object, propertyKey:string | symbol):void => {
  Reflect.defineMetadata(MDKeys.isRequired, true, target, propertyKey)
}

// #region relations

// Generates a 'getRecords' function for a relation using the given parameters
const relationGetFactory = (table:string, col:string, val:any, ) => {
  return async () => {
    let args:{[key:string]:any} = {}
    args[col] = val
    const res = await Model.DbConnector.findAll(table, args)
    return res
  }
}

// Generates a 'getRecords' function for a relation that uses a join table
const joinTableGetFactory = (data:RelationTableData, id:number) => {
  return async () => {
    // First we need to get the rows from the join table pointing to this record
    let args:{[key:string]:any} = {}
    args[data.idCol] = id
    const joinTableRows = await Model.DbConnector.findAll(data.tableName, args)

    // Initialize an array to hold the records we find
    let res:any[] = []

    // Then we use the join table entries to query the target table
    for (let id = 0; id < joinTableRows.length; id++) {
      const record = joinTableRows[id];
      
      const targetId = record[data.relatedIdCol]

      // get the related record and push it to the result array
      res.push(await Model.DbConnector.find(data.relatedTableName, targetId))
    }

    return res;
  }
}

export const HasOne = <T extends Model>(getRelatedModel:()=>ModelConstructor<T>, identifier:string|RelationTableData) => {
  return function(target:object, propertyKey:string|symbol):void{
    let getRecords:()=>Promise<any[]>;

    // if the identifier is a string - we treat it as the name of the id column pointing to the related record
    if(identifier instanceof String){
      getRecords = relationGetFactory(getRelatedModel().tableName(), identifier as string, (target as T).id)
    }
    // otherwise, identifier is an object with data needed for building a join table based relation
    else{
      getRecords = joinTableGetFactory(identifier as RelationTableData, (target as T).id!)
    }

    // Create relation metadata object to store on the model
    const data:RelationMetadata<T> = {getRecords:getRecords, propKey:propertyKey}
    // Get current metadata array or initialize to an empty one
    const relations:RelationMetadata<T>[] = Reflect.getMetadata(MDKeys.HasOne, target) ?? []

    relations.push(data)

    //Register the relation to the model
    Reflect.defineMetadata(MDKeys.HasOne, data, target, propertyKey)
  }
}

export const BelongsTo = <T extends Model>(getRelatedModel:()=>ModelConstructor<T>,  identifier:string|RelationTableData) => {
  return function(target:object, propertyKey:string|symbol):void{
    let getRecords:()=>Promise<any[]>;

    if(identifier instanceof String){
      getRecords = relationGetFactory(getRelatedModel().tableName(), "id", (target as T)[identifier as keyof T])
    }
    else{
      getRecords = joinTableGetFactory(identifier as RelationTableData, (target as T).id!)
    }
    
    // Create relation metadata object to store on the model
    const data:RelationMetadata<T> = {getRecords:getRecords, propKey:propertyKey}
    // Get current metadata array or initialize to an empty one
    const relations:RelationMetadata<T>[] = Reflect.getMetadata(MDKeys.HasMany, target) ?? []

    relations.push(data)

    //Register the relation to the model
    Reflect.defineMetadata(MDKeys.BelongsTo, data, target, propertyKey)
  }
}

export const HasMany = <T extends Model>(getRelatedModel:()=>ModelConstructor<T>, identifier:string|RelationTableData) => {
  return function(target:object, propertyKey:string|symbol):void{
    let getRecords:()=>Promise<any[]>;

    if(identifier instanceof String){
      getRecords = relationGetFactory(getRelatedModel().tableName(), identifier as string, (target as T).id)
    }
    else{
      getRecords = joinTableGetFactory(identifier as RelationTableData, (target as T).id!)
    }

    // Create relation metadata object to store on the model
    const data:RelationMetadata<T> = {getRecords:getRecords, propKey:propertyKey}
    // Get current metadata array or initialize to an empty one
    const relations:RelationMetadata<T>[] = Reflect.getMetadata(MDKeys.HasMany, target) ?? []

    relations.push(data)

    //Register the relation to the model
    Reflect.defineMetadata(MDKeys.HasMany, data, target, propertyKey)
  }
}

export const TableName = (tableName:string):ClassDecorator => {
  return function(target){
    Reflect.defineMetadata(MDKeys.tableName, tableName, target)
  }
}

// #endregion

export class Model {

  // #region Static Properties

  static DbConnector:DBConnector

  // #endregion

  // #region instance Properties
  
  @Column
  @Generated
  id?:number

  @Column
  @Generated
  created_at?:Date

  errors:ModelErrors = {}

  //#endregion


  // #region Instance Methods

  /**
   * Validate the models column marked properties, Assign any errors to this instance's
   * error property, and return true if there are no errors
   * @returns true if model is valid
   */
  validate():boolean{
    Object.keys(this).forEach(key => {
      // Only validate if this property is marked as a column and
      // is not marked as generated
      if(Reflect.getMetadata(MDKeys.isColumn, this, key) &&
         !Reflect.getMetadata(MDKeys.isGenerated, this, key)){
            this.validateColumn(key, this[key as keyof this])      
         }
    })
    // Since the model may have had errors in the past, we just want to check
    // if any of the existing arrays contain any values. If any do, there is at
    // least one error
    return !Object.values(this.errors).map(errs => errs.length > 0).includes(true)
  }

  /**
   * Validate the given key, value pair and update the error object when appropriate
   * @param key 
   * @param value 
   */
  private validateColumn(key:string, value:any){
    let errors:string[] = []
    if(!value && Reflect.getMetadata(MDKeys.isRequired, this, key)){
      errors.push("Field is required")
    }

    this.errors[key] = errors
  }

  /**
   * Attempt to save this model instance to the database. If it has not yet been created
   * a new record will be added. if it has been created, then the existing record will be updated
   * @returns True if saved successfully and false if not
   */
  async save():Promise<boolean>{
    if(this.validate()){
      const saveProps:{[key:string]:any} = {}
  
      Object.keys(this).forEach(key => {
        if(Reflect.getMetadata(MDKeys.isColumn, this, key) &&
           !Reflect.getMetadata(MDKeys.isGenerated, this, key)){
            saveProps[key] = this[key as keyof this]
           }
      })
  
      if(this.isSaved){
        const res:Partial<this> = await Model.DbConnector.update(this.tableName, saveProps)
        if(res){
          Object.assign(this, res)
          return true
        }
  
        return false
      }
      else{
        const res:Partial<this> = await Model.DbConnector.create(this.tableName, saveProps)
        if(res){
          Object.assign(this, res)
          return true
        }
  
        return false
      }
    }

    return false;
  }

  async delete(){
    if(this.id){
      await Model.DbConnector.delete(this.tableName, this.id)
    }
  }

  // #region Getters & Helpers

  // Get the properties registered as db columns for this model
  get columns(){
    let cols:{[key:string]:any} = {}

    Object.keys(this).forEach(k => {
      if(Reflect.getMetadata(MDKeys.isColumn, this, k)){
        cols[k] = this[k as keyof this]
      }
    })

    return cols
  }

  /**
   * True if this Model has been saved to the database
   */
  get isSaved():boolean{
    return !!this.id && !!this.created_at
  }


  /**
   * The table name associated with this model
   */
  get tableName():string{
    // If no tableName has been defined assume it is the classname converted using this rule:
    // ClassNameExample --> class_name_example
    const def = this.constructor.name.match(/[A-Z][a-z]+/g)?.map((v) => {return v.toLowerCase()}).join("_")
    return Reflect.getMetadata(MDKeys.tableName, this) ?? def
  }

  // #endregion

  // #endregion

  // #region Static Methods

  //Static methods modeled after answer found here:
  //https://stackoverflow.com/questions/65711386/typescript-work-with-child-class-in-static-method

  static tableName<T extends Model>(this: ModelConstructor<T>){
    // If no tableName has been defined assume it is the classname converted using this rule:
    // ClassNameExample --> class_name_example
    const def = this.constructor.name.match(/[A-Z][a-z]+/g)?.map((v) => {return v.toLowerCase()}).join("_")
    return Reflect.getMetadata(MDKeys.tableName, this) ?? def
  }

  /**
   * Create a new instance of this model with the given data
   * @param this 
   * @param data 
   * @returns 
   */
  static create<T extends Model>(this: ModelConstructor<T>, data: Partial<T>) {
    let instance = new this;
    for (let [key, value] of Object.entries(data)) {
        const k = key as keyof T;
        instance[k] = value as T[typeof k];
    }

    return instance;
  }

  /**
   * Try to find a record of this Model with the given ID
   * @param this 
   * @param id 
   * @returns 
   */
  public static async find<T extends Model>(this:ModelConstructor<T>, id:number):Promise<T>{
    const tableName = this.tableName()
    let val:T
    if(tableName){
      const res = await Model.DbConnector.find(tableName, id)
      if(res){
        val = this.create(res)

        Model.populateRelations(val)
      }
    }


    throw new Error("Table name is not defined")
  }

  /**
   * Attempt to populate the defined relation proerties for the given model
   * @param val 
   */
  private static async populateRelations<T extends Model>(val:T){
    // Retrieve (possibly undefined) relation metadata
    const hasOneRelations:RelationMetadata<T>[] = Reflect.getMetadata(MDKeys.HasOne, val)
    const belongsToRelations:RelationMetadata<T>[] = Reflect.getMetadata(MDKeys.BelongsTo, val)
    const hasManyRelations:RelationMetadata<T>[] = Reflect.getMetadata(MDKeys.HasMany, val)

    // Loop through hasOne relations if any exist and attempt to populate the related model
    // property
    if(hasOneRelations){
      for(let i=0; i < hasOneRelations.length; i++){
        const rel = hasOneRelations[i]
        const records = await rel.getRecords()
        val[rel.propKey as keyof T] = records[0]
      }
    }

    // Loop through belongsTo relations if any exist and attempt to populate the related model
    // property
    if(belongsToRelations){
      for(let i = 0; i < belongsToRelations.length; i++){
        const rel = belongsToRelations[i]
        const records = await rel.getRecords()
        val[rel.propKey as keyof T] = records[0]
      }
    }

    // Loop through hasMany relations if any exist and attempt to populate the related model
    // property
    if(hasManyRelations){
      for(let i = 0; i < hasManyRelations.length; i++){
        const rel = hasManyRelations[i]
        const records = await rel.getRecords()
        Reflect.defineProperty(val, rel.propKey, records)            
      }
    }
  }

  /**
   * Get all records for this model
   * @param this 
   * @returns 
   */
  public static async findAll<T extends Model>(this: ModelConstructor<T>){
    const tableName = Reflect.getMetadata("tableName", this)

    if(tableName){
      const res:T[] = await Model.DbConnector.findAll(tableName as string)
      if(res){
        return res.map(val => {
          let record = this.create(val)
          Model.populateRelations(record)
          return record
        })
      }
    }

    throw new Error("Table name is not defined")
  }

  /**
   * Search the database for records matching the given arguments
   * @param this 
   * @param args 
   */
  public static async where<T extends Model>(this: ModelConstructor<T>, args:Partial<T>){
    return await Model.DbConnector.findAll(this.tableName(), args)
  }

  // #endregion

}
/*
//ensures that operations are atomic
static async transaction<T>(callback: () => Promise<T>): Promise<T> {
    try {
      await Model.DbConnector.beginTransaction();  // Start transaction
      const result = await callback();  // Run the callback with the transaction
      await Model.DbConnector.commit();  // Commit the transaction if successful
      return result;
    } catch (error) {
      await Model.DbConnector.rollback();  // Rollback the transaction on error
      logError(error);
      throw new Error(`Transaction failed: ${error.message}`);
    }
  }
}
// gpt helped
// used to bult insert, update, and delete

  /**
   * Insert multiple records at once (bulk insert)
   
  public static async bulkInsert<T extends Model>(this: ModelConstructor<T>, records: Partial<T>[]): Promise<void> {
    const tableName = this.tableName();
    if (tableName) {
      await Model.DbConnector.createMany(tableName, records);
    } else {
      throw new Error('Table name is not defined');
    }
  }

  /**
   * Update multiple records at once (bulk update)
   
  public static async bulkUpdate<T extends Model>(this: ModelConstructor<T>, records: Partial<T>[]): Promise<void> {
    const tableName = this.tableName();
    if (tableName) {
      await Model.DbConnector.updateMany(tableName, records);
      } else {
      throw new Error('Table name is not defined');
    }
  }

  /**
   * Delete multiple records at once (bulk delete)
   
  public static async bulkDelete<T extends Model>(this: ModelConstructor<T>, ids: number[]): Promise<void> {
    const tableName = this.tableName();
    if (tableName) {
      await Model.DbConnector.deleteMany(tableName, ids);
    } else {
      throw new Error('Table name is not defined');
    }
  }
*/ 
