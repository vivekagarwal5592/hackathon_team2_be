import dotenv from 'dotenv';
dotenv.config();

export const apiKeys = {
    db_user: process.env.db_user,
    db_password: process.env.db_password,
    db_host: process.env.db_host,
    db_port: parseInt(process.env.db_port||"5432"),
    db_name: process.env.db_name,
    jwt_secret: process.env.jwt_secret
};



