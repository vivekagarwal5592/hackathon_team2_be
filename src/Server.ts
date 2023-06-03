import express from "express";
import blogsController from "./routes/blogs.controller";
import adminController from "./routes/admin/admin.controller"
import adminBlogController from "./routes/admin/admin.blog.controller";
import adminImagesController from "./routes/admin/admin.images.controller";
import adminUserController from "./routes/admin/admin.user.controller";
import cookies from "cookie-parser"
// import tokenController from "./routes/token.controller"
import {createConnection} from "typeorm";
import bodyParser from "body-parser";
import cors from "cors";
import {Blog} from "./models/blog.model";
import {Token} from "./models/token.model"
import {User} from "./models/user.model";
import {apiKeys} from "../config"
import {Image} from "./models/image.model";
import imageController from "./routes/image.controller";

require("reflect-metadata");
const app = express();

const port = 8080; // default port to listen

//options for cors midddleware
const options: cors.CorsOptions = {
    origin: ['http://localhost:80',
        'http://localhost:8080',
        'http://localhost:3000',
        'https://www.lazytravller.com',
        'https://lazytravller.com']
};

//Connects to the Database -> then starts the express
createConnection({
    type: "postgres",
    host: "localhost",
    port: 5432,
    username: apiKeys.db_user,
    password: apiKeys.db_password,
    database: apiKeys.db_name,
    synchronize: true,
    logging: false,
    entityPrefix: "",
    entities: [
        Blog,
        User,
        Token,
        Image,
    ],
}).then(async (connection: any) => {
    app.use(cookies());
    app.use(bodyParser.json()); // support json encoded bodies
    app.use(bodyParser.urlencoded({extended: true})); // support encoded bodies
    app.use(cors(options));
    app.use("/api/blogs", blogsController);
    app.use("/api/image", imageController);
    app.use("/api/admin/blogs", adminBlogController);
    app.use("/api/admin/images", adminImagesController);
    app.use("/api/admin/users", adminUserController);
    app.use("/api/admin", adminController);
    app.use("/api/auth", adminController);
    // app.use("/api/token", tokenController);
    // app.use("/favicon.ico", process.env.NODE_ENV == 'development' ? express.static("./build/favicon.ico") : express.static("../../build/favicon.ico"));
    // app.use("/logo192.png", process.env.NODE_ENV == 'development' ? express.static("./build/logo192.png") : express.static("../../build/logo192.png"));
    // app.use("/mobile_logo.webp", process.env.NODE_ENV == 'development' ? express.static("./build/mobile_logo.webp") : express.static("../../build/mobile_logo.webp"));
    // app.use("/magnifying_glass.webp", process.env.NODE_ENV == 'development' ? express.static("./build/magnifying_glass.webp") : express.static("../../build/magnifying_glass.webp"));
    //
    // app.use("/logo512.png", process.env.NODE_ENV == 'development' ? express.static("./build/logo512.png") : express.static("../../build/logo512.png"));
    // app.use("/tagmanager.js", process.env.NODE_ENV == 'development' ? express.static("./build/tagmanager.js") : express.static("../../build/tagmanager.js"));
    //
    // app.use("/manifest.json", process.env.NODE_ENV == 'development' ? express.static("./build/manifest.json") : express.static("../../build/manifest.json"));
    // app.use("/static", process.env.NODE_ENV == 'development' ? express.static("./build/static") : express.static("../../build/static"));

    // start the Express server
    app.listen(port, () => {
        console.log('app started')
    });
}).catch((err: any) => {
    console.log('error');
    console.log(err)
});
