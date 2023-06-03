import {AbstractRepository, EntityRepository} from "typeorm";
import {User} from "../models/user.model";

@EntityRepository(User)
export class CustomUserRepository extends AbstractRepository<User> {

    getAllUsers = async (): Promise<any | undefined> => {
        let result = await this.createQueryBuilder("u")
            .select(['u.id', 'u.name', 'u.email', 'u.phone', 'u.role'])
            .orderBy("u.id")
            .getMany();
        return result;
    };

    getUserById = async (id: any): Promise<any | undefined> => {
        let result = await this.createQueryBuilder("u")
            .select(['u.id', 'u.name', 'u.email', 'u.phone', 'u.role'])
            .where(`u.id = '${id}'`)
            .getOne();
        return result;
    };

    getUserFromEmail =async (email:string) : Promise<any> => {
        const result = await this.createQueryBuilder("u")
                            .where(`u.email = '${email}'`)
                            .getOne();
        return result;
    }

    updateUser =async (userDetails:any, id:number) => {
        const result = await this.createQueryBuilder("public.user")
            .update(User)
            .set(userDetails)
            .where(`public.user.id = '${id}'`)
            .execute();
        return result;
    }
}
