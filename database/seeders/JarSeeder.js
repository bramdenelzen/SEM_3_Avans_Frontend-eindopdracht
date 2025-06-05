import BaseSeeder from "./BaseSeeder.js";
import MixingRoom from "../models/MixingRoom.js";
import Mixer from "../models/Mixer.js";
import Jar from "../models/Jar.js";

export default class JarSeeder extends BaseSeeder {
  static async run() {
    let jars = await Jar.find({});
    const totalJars = 3 

    if (jars.length < totalJars) {
      const jarsToAdd = totalJars - jars.length;

      for (let i = 0; i < jarsToAdd; i++) {
        const jar = new Jar({ name: `Jar ${jars.length + 1}` });
        await jar.save();
        jars.push(jar);
      }

    }
  }
}
