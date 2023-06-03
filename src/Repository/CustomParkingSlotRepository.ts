import {AbstractRepository, EntityRepository} from "typeorm";
import {User} from "../models/user.model";
import {ParkingLot} from "../models/parkingLot";
import {Token} from "../models/token.model";
import { ParkingSlot } from "../models/parkingSlot.model";

@EntityRepository(ParkingSlot)
export class CustomParkingSlotRepository extends AbstractRepository<ParkingSlot> {

    getAllParkingSlots = async (): Promise<any | undefined> => {
        let result = await this.createQueryBuilder("ps").getMany();
        return result;
    };

    getParkingSlotsForParkingLot = async (parkingLotId: any): Promise<any | undefined> => {
        let result = await this.createQueryBuilder("ps")
            .where(`ps.parkinglot_id = '${parkingLotId}'`)
            .getMany();
        return result;
    };

    getSingleParkingSlot = async (id: any): Promise<any | undefined> => {
        let result = await this.createQueryBuilder("ps")
            .select(['ps.id', 'ps.number', 'ps.isAvailable', 'ps.engagedFor', 'ps.parkinglot_id'])
            .where(`ps.id = '${id}'`)
            .getRawOne();

        result = {
            id:result.ps_id,
            number: result.ps_number,
            isAvailable: result.ps_isAvailable,
            engagedFor:result.ps_engagedFor,
            parkingLotId:result.parkinglot_id
        }
        return result;
    };

    // insertParkingSlot = async (parkingSlot: ParkingSlot): Promise<any | undefined> => {
    //     let result = await this.createQueryBuilder("ps")
    //         .insert()
    //         .into(ParkingSlot)
    //         .values([
    //             {
    //                 number:parkingSlot.number,
    //                 isAvailable:parkingSlot.isAvailable,
    //                 engagedFor: parkingSlot.engagedFor,
    //                 parkingLotId:parkingSlot.parkingLotId,
    //             }
    //         ])

    //         .execute();
    //     return result;
    // };
    
    insertParkingSlots = async (parkingSlots: ParkingSlot[]): Promise<any | undefined> => {
        let result = await this.createQueryBuilder("ps")
            .insert()
            .into(ParkingSlot)
            .values(parkingSlots)
            .execute();
        return result;
    };

    updateParkingSlot = async (parkingSlot:any, id: number): Promise<any> => {
        let result = await this.createQueryBuilder("parking_slot")
            .update(ParkingSlot)
            .set(parkingSlot)
            .where(`parking_slot.id = '${id}'`)
            .execute();
        return result;
    }

}
