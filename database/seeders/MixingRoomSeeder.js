import BaseSeeder from "./BaseSeeder.js";
import MixingRoom from "../models/MixingRoom.js";


export default class MixingRoomSeeder extends BaseSeeder {
  static async run() {
    let mixingRooms = await MixingRoom.find({});
    const totalMixingRooms = 3;

    if (mixingRooms.length < totalMixingRooms) {
      const roomsToAdd = totalMixingRooms - mixingRooms.length;
      for (let i = 0; i < roomsToAdd; i++) {
        const mixingRoom = new MixingRoom({ color: "red", displayName: `Mixing Room ${mixingRooms.length + 1}` });
        await mixingRoom.save();
        mixingRooms.push(mixingRoom);
      }
    } else if (mixingRooms.length > totalMixingRooms) {
      // Optionally delete extras if too many exist
      const excessRooms = mixingRooms.slice(totalMixingRooms);
      for (const room of excessRooms) {
        await room.delete()
      }
      mixingRooms = mixingRooms.slice(0, totalMixingRooms);
    }
  }
}
