import * as cron from "node-cron";
import * as slotService from "./parkingSlotService";


export const updateParkingSlot = cron.schedule('*/1 * * * *', () => {
    console.log('here')
    slotService.updateParkingSlotByOneMinute().then((result: any)=>{
        console.log(result);
    });
});




