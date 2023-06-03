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
            .where(`ps.parkingLotId = '${parkingLotId}'`)
            .getMany();
        return result;
    };

    getSingleParkingSlot = async (id: any): Promise<any | undefined> => {
        let result = await this.createQueryBuilder("ps")
            .where(`ps.id = '${id}'`)
            .getMany();
        return result;
    };

    insertParkingSlot = async (parkingSlot: ParkingSlot): Promise<any | undefined> => {
        let result = await this.createQueryBuilder("ps")
            .insert()
            .into(ParkingSlot)
            .values([
                {
                    number:parkingSlot.number,
                    isAvailable:parkingSlot.isAvailable,
                    engagedFor: parkingSlot.engagedFor,
                    parkingLotId:parkingSlot.parkingLotId,
                }
            ])

            .execute();
        return result;
    };
    
    insertParkingSlots = async (parkingSlots: ParkingSlot[]): Promise<any | undefined> => {
        let result = await this.createQueryBuilder("ps")
            .insert()
            .into(ParkingSlot)
            .values(parkingSlots)
            .execute();
        return result;
    };

    updateParkingSlot = async (parkingSlot:any, id: number): Promise<any> => {
        let result = await this.createQueryBuilder("ps")
            .update(ParkingSlot)
            .set(parkingSlot)
            .where(`ps.id = '${id}'`)
            .execute();
        return result;
    }

}
