import "./setup.js";
import User from "./database/models/User.js";

const john = new User("John", 33);
const joasdashn = new User("Jasdasohn", 33);
const joasdhn = new User("Johdasdsan", 33);
const joshn = new User("Jsdasdohn", 33);

joasdashn.save();
const savedjohn = await john.save();

john.age = 34;

console.log(john);

const bob = await User.findById(savedjohn.id);

console.log(bob);

bob.name = "Bob";

bob.age = 39;
await bob.save();
console.log(bob.greet());

console.log(await User.find())
