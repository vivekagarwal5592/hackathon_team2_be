import { User } from "../models/user.model";
import { getCustomRepository, getRepository } from "typeorm";
import { CustomParkingLotRepository } from "../Repository/CustomParkingLotRepository";
import * as imageService from "../Service/ImageService";
import * as pSlotService from "../Service/parkingSlotService";
import { ParkingLot } from "../models/parkingLot";
import {ParkingSlot} from "../models/parkingSlot.model";

export const getAllParkingLots = async (): Promise<any> => {
  let parkingLotRepository = getCustomRepository(CustomParkingLotRepository);
  let searchResult = await parkingLotRepository.getAllParkingLots();
  return searchResult;
};

export const getSingleParkingLot = async (id: any): Promise<any> => {
  let parkingLotRepository = getCustomRepository(CustomParkingLotRepository);
  let searchResult = await parkingLotRepository.getSingleParking(id);
  return searchResult;
};

export const insertParkingLot = async (body: any): Promise<any> => {
  const { name, address, totalCapacity, parkingSlotIds } = body;

  const parkingLot: ParkingLot = {
    name: name,
    address: address,
    totalCapacity: totalCapacity,
    availableSlots: totalCapacity,
    parkingSlots: [],
  };

  let parkingLotRepository = getCustomRepository(CustomParkingLotRepository);

  parkingSlotIds.forEach((item: any) => {
    let parkingLotSlot = new ParkingSlot()
    parkingLotSlot.number = item
    parkingLotSlot.isAvailable = true
    parkingLotSlot.engagedFor = 0
    parkingLot.parkingSlots.push(parkingLotSlot)
  });

  const parkingRepository = getRepository(ParkingLot);
  let result = await parkingRepository.save(parkingLot);

  return result;
};

export const updateParkingLot = async (body: any): Promise<any> => {
  // let userRepository = getCustomRepository(CustomUserRepository);
  // let searchResult = await userRepository.findAllAdmin();
  // return searchResult;
};
