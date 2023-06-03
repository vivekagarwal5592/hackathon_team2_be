import {User} from "../models/user.model";
import {getCustomRepository, getRepository} from "typeorm";
import * as plotService from "../Service/parkingLotService";
import { CustomParkingSlotRepository } from "../Repository/CustomParkingSlotRepository";
import { ParkingSlot } from "../models/parkingSlot.model";

export const getAllParkingSlots = async (): Promise<ParkingSlot> => {
    let parkingSlotRepository = getCustomRepository(CustomParkingSlotRepository);
    let searchResult = await parkingSlotRepository.getAllParkingSlots();
    return searchResult;
};

export const getAllParkingSlotsForParkingLot = async (parkingLotId: number): Promise<ParkingSlot> => {
    let parkingSlotRepository = getCustomRepository(CustomParkingSlotRepository);
    let searchResult = await parkingSlotRepository.getParkingSlotsForParkingLot(parkingLotId);
    return searchResult;
}

export const getSingleParkingSlot = async (id: any): Promise<ParkingSlot> => {
    let parkingSlotRepository = getCustomRepository(CustomParkingSlotRepository);
    let searchResult = await parkingSlotRepository.getSingleParkingSlot(id);
    return searchResult;
}

export const createParkingSlots = async (parkingSlotNumbers: string[], parkingLotId:number): Promise<any> => {
    const parkingSlots:any[] = parkingSlotNumbers.map(number=>{
        return {
            number:number,
            isAvailable:true,
            parkingLotId: parkingLotId
        }
    });
    let parkingSlotRepository = getCustomRepository(CustomParkingSlotRepository);
    let insertResult = await parkingSlotRepository.insertParkingSlots(parkingSlots);
    return insertResult;
}

export const parkVehicle = async (body: any): Promise<any> => {
    const userId = body.userId;
    const parkingSlotId = body.parkingSlotId;
    const engagedFor = body.engagedFor;
    const updatedParkingSlot = {
      userId: userId,
      engagedFor: engagedFor,
      isAvailable: false,
    };
    let parkingSlotRepository = getCustomRepository(CustomParkingSlotRepository);
    const pSlot = await parkingSlotRepository.getSingleParkingSlot(parkingSlotId);
    console.log("Pslot",pSlot);
    
    const pLot = await plotService.getSingleParkingLot(pSlot.parkingLotId);
    const updatedParkingLot = {
        availableSlots: pLot.availableSlots-1
    }
    const updateParkingLotReq = plotService.updateParkingLot({parkingLot:updatedParkingLot, id:pLot.id});
    const updateParkingSlotReq = parkingSlotRepository.updateParkingSlot(updatedParkingSlot, parkingSlotId);
    const updateResult = await Promise.all([updateParkingLotReq, updateParkingSlotReq]);
    return updateResult;
}

export const unParkVehicle = async (body: any): Promise<any> => {
    const userId = body.userId;
    const parkingSlotId = body.parkingSlotId;
    
    const updatedParkingSlot = {
      userId: null,
      engagedFor: null,
      isAvailable: true
    };

    let parkingSlotRepository = getCustomRepository(CustomParkingSlotRepository);
    const pSlot = await parkingSlotRepository.getSingleParkingSlot(parkingSlotId);
    
    const pLot = await plotService.getSingleParkingLot(pSlot.parkingLotId);
    const updatedParkingLot = {
        availableSlots: pLot.availableSlots+1
    }
    const updateParkingLotReq = plotService.updateParkingLot({parkingLot:updatedParkingLot, id:pLot.id});
    const updateParkingSlotReq = parkingSlotRepository.updateParkingSlot(updatedParkingSlot, parkingSlotId);
    const updateResult = await Promise.all([updateParkingLotReq, updateParkingSlotReq]);
    return updateResult;
}


