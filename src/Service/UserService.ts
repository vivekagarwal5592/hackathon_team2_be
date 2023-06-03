import { User } from "../models/user.model";
import { getCustomRepository, getRepository } from "typeorm";
import { CustomUserRepository } from "../Repository/CustomUserRepository";
import * as imageService from "../Service/ImageService";

export const getAllUsers = async (): Promise<any> => {
  let userRepository = getCustomRepository(CustomUserRepository);
  let searchResult = await userRepository.getAllUsers();
  return searchResult;
};

export const getUserById = async (id: any): Promise<any> => {
  let userRepository = getCustomRepository(CustomUserRepository);
  let userDetails = await userRepository.getUserById(id);
  return userDetails;
};

export const updateUser = async (body: any): Promise<any> => {
  const { userDetails, id } = body;
  let userRepository = getCustomRepository(CustomUserRepository);
  let updateResult = await userRepository.updateUser(userDetails, id);
  return updateResult;
};

// export const updateProfile = async (id: any, body: any): Promise<any> => {

//     let imageData: any = await imageService.uploadImageBase64({
//         image: body.imageBase64
//     }, id)
//     let userRepository = getRepository(User);

//     let userData = {
//         name: body.name,
//         id: id,
//         email: body.email,
//         image: {
//             id: imageData.id
//         }
//     }

//     let userDetails = await userRepository.save(userData)

//     return {
//         "message": "user updated successfully"
//     }
// }
