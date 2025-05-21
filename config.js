import LocalStorageDB from "./database/handlers/LocalStorageDB.js";
import RuntimeDBStorage from "./database/handlers/RuntimeStorageDB.js/index.js";
import SessionStorageDB from "./database/handlers/SessionStorageDB.js";



export default {
  // Database configuration
  db: {
    handler: RuntimeDBStorage
  },
  debug: true,
};