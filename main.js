import "./setup.js"
import User from './database/models/User.js';


const john = new User("John", 33);
await john.save();

john.age = 34;

console.log(john.greet()); 


const bob = await User.findById(  1747857952650 )

bob.name = "Bob";
bob.age = 39;
bob.save()

console.log(bob.greet()); 


const jesse = await User.findById(  1747857952650 )

// jesse.name = "Jesse";

console.log(jesse.greet()); 
// john.delete();