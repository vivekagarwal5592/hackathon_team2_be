import { User } from "../models/user.model";
import { getCustomRepository, getRepository } from "typeorm";
import { CustomParkingLotRepository } from "../Repository/CustomParkingLotRepository";
import * as imageService from "../Service/ImageService";
import * as pSlotService from "../Service/parkingSlotService";
import { ParkingLot } from "../models/parkingLot";

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
  const parkingSlots: any[] = parkingSlotIds.map((number: any) => {
    return {
      number: number,
      isAvailable: true,
    };
  });
  parkingLot.parkingSlots = parkingSlots;
  let result = await parkingLotRepository.insertParking(parkingLot);
  pSlotService.createParkingSlots(parkingSlotIds, result.id);
  return result;
};

export const updateParkingLot = async (body: any): Promise<any> => {
  // let userRepository = getCustomRepository(CustomUserRepository);
  // let searchResult = await userRepository.findAllAdmin();
  // return searchResult;
};
