import {AbstractRepository, EntityRepository} from "typeorm";
import {User} from "../models/user.model";

@EntityRepository(User)
export class CustomUserRepository extends AbstractRepository<User> {

    /**
     * Get All users with the role CHEF
     * @param recipeId
     */
    findAllAdmin = async (): Promise<any | undefined> => {
        let result = await this.createQueryBuilder("user")
            .where("user.role = 'ADMIN'")
            .select(["user.name"])
            .orderBy("user.id")
            .getMany();

        return result;
    };

    getUserFromEmail = async (email: string): Promise<any> => {
        let result = await this.createQueryBuilder("u")
            .where(`u.email = '${email}'`)
            .select(['u.name', 'u.id','u.email', 'u.role', 'u.password'])
            .getOne();
        return result;
    }

    getProfile = async (id: any): Promise<any> => {
        let result = await this.createQueryBuilder("u")
           .leftJoin('u.image', 'i', 'u.image_id = i.id')
            .where(`u.id = ${id}`)
            .select(['u.name', 'u.id','u.email','i.name','i.id'])
            .getOne();
        return result;
    }

    getUserById = async (id: any): Promise<any> => {
        let result = await this.createQueryBuilder("user")
            .leftJoin('blog.image', 'i', 'u.image_id = i.id')
            .where(`user.id = '${id}'`)
            .select('u.name, u.id,u.email, i.id,i.name')
            .getOne();
        return result;
    }

}
