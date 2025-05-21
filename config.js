import LocalStorageDB from "./database/handlers/LocalStorageDB.js";



export default {
  // Database configuration
  db: {
    handler: LocalStorageDB
  },
  debug: true,
};