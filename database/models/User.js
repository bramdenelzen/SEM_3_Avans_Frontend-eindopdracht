import BaseModel from './BaseModel.js';

export default class User extends BaseModel {
  static modelName = "users";

  static schema = {
    id: {
      type: "number",
      required: true,
    },
    name: {
      type: "string",
      required: true,
    },
    age: {
      type: "number",
      required: true,
    },
  };

  constructor(nameOrData, age) {
    // Support both `new User({ id, name, age })` and `new User(name, age)`
    let data;
    if (typeof nameOrData === 'object') {
      data = nameOrData;
    } else {
      data = { name: nameOrData, age };
    }

    super(User.modelName, data, User.schema);
  }

  greet() {
    return `Hi, I'm ${this.name} and I'm ${this.age}`;
  }
}
