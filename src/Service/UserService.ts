import {User} from "../models/user.model";
import {getCustomRepository, getRepository} from "typeorm";
import {CustomUserRepository} from "../Repository/CustomUserRepository"
import * as imageService from "../Service/ImageService"

/**
 * Get All Chefs in the database
 */
export const getAllUser = async (start: string): Promise<any> => {
    if (parseInt(start) > 5) {
        let chefs: User[] = [];
        return chefs;
    }

    let userRepository = getCustomRepository(CustomUserRepository);
    let searchResult = await userRepository.findAllAdmin();
    return searchResult;
};

export const getProfile = async (id: any): Promise<any> => {
    let userRepository = getCustomRepository(CustomUserRepository);
    let userDetails = await userRepository.getProfile(id)
    return userDetails
}

export const updateProfile = async (id: any, body: any): Promise<any> => {

    let imageData: any = await imageService.uploadImageBase64({
        image: body.imageBase64
    }, id)
    let userRepository = getRepository(User);

    let userData = {
        name: body.name,
        id: id,
        email: body.email,
        image: {
            id: imageData.id
        }
    }

    let userDetails = await userRepository.save(userData)

    return {
        "message": "user updated successfully"
    }
}


export const getSingleUserById = async (id: any): Promise<any> => {
    let userRepository = getCustomRepository(CustomUserRepository);
    let userDetails = await userRepository.getProfile(id)
    return userDetails
}


