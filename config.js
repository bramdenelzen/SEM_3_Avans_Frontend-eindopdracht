import BaseDbHandler from "./database/handlers/BaseDbHandler.js";



export const config = {
  db: {
    handler: BaseDbHandler.constructor,
  },
  debug: true,
};