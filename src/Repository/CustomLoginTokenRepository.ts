import {AbstractRepository, EntityRepository} from "typeorm";
import {User} from "../models/user.model";
import {Token} from "../models/token.model";


@EntityRepository(Token)
export class CustomLoginTokenRepository extends AbstractRepository<User> {

    saveNewToken = async  (tokenDetails: Token): Promise<any> => {
        let result = await this.createQueryBuilder("dt")
            .insert()
            .into(Token)
            .values([
                {value: tokenDetails.value, type: tokenDetails.type }
            ])
            .execute();
        return result;
    };

    deleteToken = async  (token: any) => {

        await this.createQueryBuilder("dt")
            .delete()
            .from(User)
            .where("value = :value", {value: token})
            .execute();

    }


    checkTokenExists = async (token: any) => {

        let result = await this.createQueryBuilder("dt")
            .where(`dt.value = '${token}'`)
            .getOne();

        return result;

    }

}
