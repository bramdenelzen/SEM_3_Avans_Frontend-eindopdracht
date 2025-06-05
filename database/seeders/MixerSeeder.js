import BaseSeeder from "./BaseSeeder.js";
import MixingRoom from "../models/MixingRoom.js";
import Mixer from "../models/Mixer.js";

export default class MixerSeeder extends BaseSeeder {
  static async run() {
    let mixers = await Mixer.find({});
    mixers.forEach(async (mixer) => {
      if (mixer.jarId) {
        mixer.jarId = null; // Reset jarId to null
        await mixer.save(); // Save the changes
      }
    });
  }
}
