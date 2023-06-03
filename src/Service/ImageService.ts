import axios from "axios";
import fs from "fs";
import AWS, {Endpoint} from 'aws-sdk';
//import * as recipeService from "./RecipeService";
import util from 'util';
import rimraf from 'rimraf';
import {apiKeys} from "../../config";
//import sharp from "sharp";
import {getRepository} from "typeorm";
import {Image} from "../models/image.model";
import {User} from "../models/user.model";

export const uploadRecipeImageFromLink = async (imageUrl: string) => {

    let result = null;
    try {
        result = await axios.get(imageUrl, {
            responseType: 'arraybuffer'
        });
    } catch (e) {
        console.log('error');
    }

    if (process.env.NODE_ENV != 'production' && !fs.existsSync('images')) {
        fs.mkdirSync('images');
    }

    if (result) {

        const fileName = 'file-' + (Date.now()) + '.webp';
        const filePath = process.env.NODE_ENV == 'development' ? `images/${fileName}` : `/var/www/images/${fileName}`;

        fs.writeFileSync(`${filePath}`, result['data']);

        await uploadImageS3(fileName, result['data'])
        return fileName;
    }
};

export const uploadImageBase64 = async (base64: any, userId: any) => {

    for (const [key, value] of Object.entries(base64)) {

        const fileName = 'file-' + (Date.now()) + '.webp';
        if (process.env.NODE_ENV != 'production' && !fs.existsSync('images')) {
            fs.mkdirSync('images');
        }
        const newFilePath = process.env.NODE_ENV == 'development' ? `images/${fileName}` : `/var/www/images/${fileName}`;

        // @ts-ignore
        let buffer =  value.substring(value.indexOf('base64,')+7)
        // let buffer = value.replace(/^data:image\/jpeg;base64,/, "");

        fs.writeFileSync(`${newFilePath}`, buffer, {encoding: 'base64'});

        let result = await uploadImageS3(fileName, buffer)

        if (result) {

            let newImage = new Image()
            newImage.name = fileName



            const imageRepository = getRepository(Image);
            let image = await imageRepository.save(newImage);

            return {message: "Images uploaded successfully", name: fileName, id: image.id};

        } else {
            return {
                err: "There was issue in uploading image"
            }
        }
    }




};

export const renameImage = async (oldFileName: string, newFileName: string) => {

    const oldFilePath = process.env.NODE_ENV == 'development' ? `images/${oldFileName}` : `/var/www/images/${oldFileName}`;
    const newFilePath = process.env.NODE_ENV == 'development' ? `images/${newFileName}` : `/var/www/images/${newFileName}`;


    if (fs.existsSync(oldFilePath)) {
        fs.renameSync(oldFilePath, newFilePath);
        let buffer = fs.readFileSync(newFilePath);
        await uploadImageS3(newFileName, buffer)
    }

};


export const uploadFromTemp = async (fileNameTemp: string) => {
    const fileName = 'file-' + (Date.now()) + '.webp';
    if (process.env.NODE_ENV != 'production' && !fs.existsSync('images')) {
        fs.mkdirSync('images');
    }
    const oldFilePath = process.env.NODE_ENV == 'development' ? `images/tempImages/${fileNameTemp}` : `/var/www/images/tempImages/${fileNameTemp}`;
    const newFilePath = process.env.NODE_ENV == 'development' ? `images/${fileName}` : `/var/www/images/${fileName}`;

    let buffer = fs.readFileSync(oldFilePath);

    fs.writeFileSync(`${newFilePath}`, buffer);

    await uploadImageS3(fileName, buffer)

};

export const uploadRecipeImageFromLocal = async (files: any, userId: any) => {

    for (const [key, value] of Object.entries(files)) {

        const fileName = 'file-' + (Date.now()) + '.webp';
        if (process.env.NODE_ENV != 'production' && !fs.existsSync('images')) {
            fs.mkdirSync('images');
        }
        const newFilePath = process.env.NODE_ENV == 'development' ? `images/${fileName}` : `/var/www/images/${fileName}`;

        let buffer = fs.readFileSync(files[key].filepath);

        fs.writeFileSync(`${newFilePath}`, buffer);

        let result = await uploadImageS3(fileName, buffer)

        if (result) {

            let newImage = new Image()
            newImage.name = fileName



            const imageRepository = getRepository(Image);
            let image = await imageRepository.save(newImage);

            return {message: "Images uploaded successfully", name: fileName, id: image.id};

        } else {
            return {
                err: "There was issue in uploading image"
            }
        }

    }


};

export const uploadVideoFromLocal = async (oldFilePath: any) => {

    const fileName = 'video-file.mp4';

    const newFilePath = process.env.NODE_ENV == 'development' ? `images/video` : `/var/www/images/video`;

    if (!fs.existsSync(newFilePath)) {
        fs.mkdirSync(newFilePath);
    }

    let buffer = fs.readFileSync(oldFilePath);
    fs.writeFileSync(`${newFilePath}/${fileName}`, buffer);
    return fileName;
};


export const processVideo = async (startTime: string) => {

    const exec = util.promisify(require('child_process').exec);

    const {
        stdout,
        stderr
    } = await exec(process.env.NODE_ENV != 'production' ? 'python3 python/read_video_file.py ' + " " + startTime : 'python3 /var/www/nodejs/releases/package/python/read_video_file.py' + " " + startTime);

    let arr = stdout.split('\n');
    arr.pop();
    let result: any = [];
    let imageData: any = null;
    arr.forEach((imageName: string) => {
        result.push({
            name: imageName,
            // base64: imageData
        })
    });
    return result;

};

// export const updateAllImageLink = async () => {
//     let result = await recipeService.getAllRecipes("0", 70, {}, false, "en");
//
//     for (let recipe of result) {
//         let data = await recipeService.getSingleRecipeById(recipe.id, false);
//         if (data && data.image) {
//             let imageName = await uploadRecipeImageFromLink(data.image);
//             data.image = imageName;
//             await recipeService.saveNewRecipe(data)
//         }
//     }
//
//     return "All Image links updated";
// };


//////////////////////////////GET////////////////////////////////////////

export const getAllImageFiles = async (page: number, limit: number) => {

    let arr: any = [];

    const dir = process.env.NODE_ENV == 'development' ? `images` : `/var/www/images`;
    let endPoint = (fs.readdirSync(dir).length) - (limit * page);
    let startPoint = endPoint - limit;

    let f = fs.readdirSync(dir);

    f.map((fileName) => {
        return {
            name: fileName,
            time: fs.statSync(dir + '/' + fileName).mtime.getTime()
        };
    }).sort((a: any, b: any) => a.time - b.time)
        .map((v) => v.name)
        .slice(startPoint, endPoint).forEach(fileName => {
        arr.push(fileName)
    });

    return arr.reverse();
};

export const getRecipeImage = async (fileName: string, compress: boolean) => {

    if (process.env.NODE_ENV == 'development') {
        return compress ? await compressImage(fs.readFileSync(`images/${fileName}`)) :
            fs.readFileSync(`images/${fileName}`);
    } else {
        return compress ? await compressImage(fs.readFileSync(`/var/www/images/${fileName}`)) :
            fs.readFileSync(`/var/www/images/${fileName}`);
    }
};

export const getTempImage = async (fileName: string) => {
    if (process.env.NODE_ENV == 'development') {
        return fs.readFileSync(`images/tempImages/${fileName}`)
    } else {
        return fs.readFileSync(`/var/www/images/tempImages/${fileName}`);
    }
};

////////////////////// DELETE //////////////////////////////


export const deleteImage = async (fileName: string) => {
    if (process.env.NODE_ENV == 'development') {
        return fs.unlinkSync(`images/${fileName}`);
    } else {
        fs.unlinkSync(`/var/www/images/${fileName}`);

    }
};


// export const deleteTempVideo = async () => {
//     const filePath = process.env.NODE_ENV == 'development' ? `images/video`: `/var/www/images/video`;
//
//     if(fs.existsSync(filePath)) {
//         rimraf.sync(filePath);
//         return "Images Successfully deleted";
//     }
// };

export const deleteTempImages = async () => {

    const filePath = process.env.NODE_ENV == 'development' ? `images/tempImages` : `/var/www/images/tempImages`;

    if (fs.existsSync(filePath)) {
        rimraf.sync(filePath);
        return "Video Successfully deleted";
    }
};


const uploadImageS3 = async (fileName: string, buffer: any) => {

    const s3 = new AWS.S3({
        'accessKeyId': "",
        'secretAccessKey': "",
        'region': 'PAR'
    });

    s3.endpoint = new Endpoint("https://s3.fr-par.scw.cloud");

    const options = {
        Bucket: process.env.NODE_ENV == 'development' ? 'lazy-traveller-images-dev' : 'lazy-traveller-images',
        Key: "blog/" + fileName,
        Body: buffer
    };

    try {
        await s3.putObject(options).promise()
    } catch (e: any) {
        return false
    }

    return true

};

///////////// UTILITY ////////////////////////////////

const compressImage = async (file: any) => {
    // let newFile = await sharp(file)
    //     .resize(550)
    //     .toBuffer();
    //
    // return newFile

     return file;

};




