import BaseSeeder from "./BaseSeeder.js";
import MixingRoom from "../models/MixingRoom.js";
import Mixer from "../models/Mixer.js";

export default class MixerSeeder extends BaseSeeder {
  static async run() {
    let mixers = await Mixer.find({});
    mixers.forEach(async (mixer) => {
      if (mixer.jarId) {
        mixer.jarId = null; 
        await mixer.save(); 
      }
    });

    const mixingRooms = await MixingRoom.find({});
    const mixersPerRoom = 2; 

    for (const room of mixingRooms) {
      const existingMixers = await Mixer.find({ mixingroomId: room.id });
      const mixersToAdd = mixersPerRoom - existingMixers.length;

      for (let i = 0; i < mixersToAdd; i++) {
        const mixer = new Mixer({
          mixingroomId: room.id,
          mixingSpeed:  10 * (i+1), 
        });
        await mixer.save();
      }
    }
  }
}
