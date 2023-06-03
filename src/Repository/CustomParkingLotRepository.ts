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
            .getMany();
        return result;
    };

    insertParking = async (body: any): Promise<any | undefined> => {
        let result = await this.createQueryBuilder("dt")
            .insert()
            .into(ParkingLot)
            .values([
                {name: body.name,
                    address: body.address,
                    totalCapacity: body.totalCapacity,
                    availableSlots: body.totalCapacity }
            ])

            .execute();
        return result;
    };

    // updateParking = async (body: any, id: any): Promise<any> => {
    //     let result = await this.createQueryBuilder("dt")
    //         .update()
    //         .into(ParkingLotModel)
    //         .values([
    //             {name: body.name,
    //             address: body.address,
    //             totalCapacity: body.totalCapacity,
    //             availableSlots: body.totalCapacity }
    //         ])
    //
    //         .execute();
    //     return result;
    // }

}
