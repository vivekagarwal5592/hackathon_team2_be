import {User} from "../models/user.model";
import {getCustomRepository, getRepository} from "typeorm";
import {CustomParkingLotRepository} from "../Repository/CustomParkingLotRepository"
import * as imageService from "../Service/ImageService"

/**
 * Get All Chefs in the database
 */
export const getAllParkingLots = async (): Promise<any> => {
    let parkingLotRepository = getCustomRepository(CustomParkingLotRepository);
    let searchResult = await parkingLotRepository.getAllParkingLots();
    return searchResult;
};

export const getSingleParkingLot = async (id: any): Promise<any> => {
    let parkingLotRepository = getCustomRepository(CustomParkingLotRepository);
    let searchResult = await parkingLotRepository.getSingleParking(id);
    return searchResult;
}

export const insertParkingLot = async (parkingLot: any): Promise<any> => {
    let parkingLotRepository = getCustomRepository(CustomParkingLotRepository);
    let searchResult = await parkingLotRepository.insertParking(parkingLot);
    return searchResult;
}

export const updateParkingLot = async (body: any): Promise<any> => {
    // let userRepository = getCustomRepository(CustomUserRepository);
    // let searchResult = await userRepository.findAllAdmin();
    // return searchResult;
}


