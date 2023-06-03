import {AbstractRepository, EntityRepository} from "typeorm";
import {User} from "../models/user.model";
import {ParkingLot} from "../models/parkingLot";
import {Token} from "../models/token.model";

@EntityRepository(ParkingLot)
export class CustomParkingLotRepository extends AbstractRepository<User> {

    /**
     * Get All users with the role CHEF
     * @param recipeId
     */
    getAllParkingLots = async (): Promise<any | undefined> => {
        let result = await this.createQueryBuilder("p").getMany();
        return result;
    };

    getSingleParking = async (id: any): Promise<any | undefined> => {
        let result = await this.createQueryBuilder("p")
            .where(`p.id = '${id}'`)
            .getOne();
        return result;
    };

    insertParking = async (body: any): Promise<any | undefined> => {
        let result = await this.createQueryBuilder("dt")
            .insert()
            .into(ParkingLot)
            .values([
                {name: body.name,
                    parkingSlots: body.parkingSlots,
                    address: body.address,
                    totalCapacity: body.totalCapacity,
                    availableSlots: body.totalCapacity }
            ])
            .execute();

        return result;
    };

    updateParking = async (parkingLot: any, id: any): Promise<any> => {
        let result = await this.createQueryBuilder("parking_lot")
            .update(ParkingLot)
            .set(parkingLot)
            .where(`parking_lot.id='${id}'`)
            .execute();
        return result;
    }

}
