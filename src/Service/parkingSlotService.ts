import {User} from "../models/user.model";
import {getCustomRepository, getRepository} from "typeorm";
import * as imageService from "../Service/ImageService"
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

export const insertParkingSlots = async (parkingSlots: ParkingSlot[]): Promise<any> => {
    let parkingSlotRepository = getCustomRepository(CustomParkingSlotRepository);
    let insertResult = await parkingSlotRepository.insertParkingSlots(parkingSlots);
    return insertResult;
}

export const updateParkingSlot = async (parkingSlot: any, id:number): Promise<any> => {
    let parkingSlotRepository = getCustomRepository(CustomParkingSlotRepository);
    let updateResult = await parkingSlotRepository.updateParkingSlot(parkingSlot, id);
    return updateResult;
}


