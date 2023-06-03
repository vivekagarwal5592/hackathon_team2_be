import {google} from "googleapis";
import {getCustomRepository, getRepository} from "typeorm";
import {CustomUserRepository} from "../Repository/CustomUserRepository";
import {CustomLoginTokenRepository} from "../Repository/CustomLoginTokenRepository";
import jwt from "jsonwebtoken"
import {User} from "../models/user.model";

const googleApiId = "1087038364395-gu9iip4aug8nhibn784q86jrj9c5m7pa.apps.googleusercontent.com"
const clientSecret = "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"
const googleOAuthRedirectUrl = "postmessage"
import axios from "axios";
import {apiKeys} from "../../config";

const oauth2Client = new google.auth.OAuth2(
    googleApiId,
    clientSecret,
    googleOAuthRedirectUrl
);

const jwt_secret = apiKeys.jwt_secret as string;

export const authentication = async (req: any, res: any, next: any) => {

    let authorization = req.headers['authorization'];

    if(!authorization) {
        authorization = req.cookies['token']
    }

    let accessTokenResult: any = await verifyJWTToken(authorization?.split("~")[0])
    let refreshToken: any = authorization?.split("~")[1]

    if (!accessTokenResult || accessTokenResult.error) {
        if(accessTokenResult.tokenExpired) {
            let newTokens: any = await newToken(req.cookies.token)
            if(newTokens && !newTokens?.err) {
                res.cookie('token', newTokens.ACCESS_TOKEN + "~" + newTokens.REFRESH_TOKEN)
            }
        } else {
            res.redirect(302, '/login')
            return;
        }
    }

    let loginTokenRepository = getCustomRepository(CustomLoginTokenRepository);
    let tokenExists = await loginTokenRepository.checkTokenExists(refreshToken)

    if (!tokenExists) {
        res.status(302).send('http://localhost:3000/admin')
        return;
    }

    let userDetailsFromToken: any = jwt.decode(authorization.split("~")[0] as string)

    let userRepository = getCustomRepository(CustomUserRepository);
    let searchResult = await userRepository.getUserFromEmail(userDetailsFromToken.email);

    req.body.loggedInUser = searchResult;
    next();

};

export const authorization = (roles: string[]) => {

    const checkAuthorization  = (req: any, res: any, next: any) => {

        for (let i = 0; i < roles.length; i++) {
            if (req.body.loggedInUser.role == roles[i]) {
                next()
                return;
            }
        }

        res.redirect(302, '/')
        return;
    }

    return checkAuthorization
}


export const authenticationSSR = async (req: any, res: any, next: any) => {

    if (req.originalUrl.indexOf('user') < 0) {
        next();
        return
    }

    let authorization = req.headers['authorization'];

    if(!authorization) {
        authorization = req.cookies['token']
    }

    try {
        let accessTokenResult: any = await verifyJWTToken(authorization.split("~")[0])
        let refreshToken: any = authorization.split("~")[1]

        if (!accessTokenResult || accessTokenResult.error) {
            if(accessTokenResult.tokenExpired) {
                let newTokens: any = await newToken(req.cookies.token)

                if(newTokens && !newTokens?.err) {
                    // req.cookies.token = newTokens.ACCESS_TOKEN + "~" + newTokens.REFRESH_TOKEN
                    res.cookie('token', newTokens.ACCESS_TOKEN + "~" + newTokens.REFRESH_TOKEN)
                    next()
                    return
                }
            }
            res.redirect(302, '/')
            return;
        }

        let loginTokenRepository = getCustomRepository(CustomLoginTokenRepository);
        let tokenExists = await loginTokenRepository.checkTokenExists(refreshToken)

        if (!tokenExists) {
            res.status(302).send('/')
            return;
        }

        let userDetailsFromToken: any = jwt.decode(authorization.split("~")[0] as string)

        let userRepository = getCustomRepository(CustomUserRepository);
        let searchResult = await userRepository.getUserFromEmail(userDetailsFromToken.email);

        req.body.loggedInUser = searchResult
    } catch(error: any) {
        if(error.message.indexOf('Token used too late') >= 0) {
            next() // sending true for expired token because there is no need to redirect user to login page. User will automatically be issues new token
        }
        res.redirect(302, '/')
        return;
    }

    next()


};

export const getUserDetailsFromEmail = async (userEmail: string) => {
    let userRepository = getCustomRepository(CustomUserRepository);
    let userDetails = await userRepository.getUserFromEmail(userEmail);
    return {
        role: userDetails.role
    }
};

export const newToken = async (existingTokens: any) => {

    let refreshToken: any = existingTokens.split("~")[1]

    let loginTokenRepository = getCustomRepository(CustomLoginTokenRepository);
    let tokenExists = await loginTokenRepository.checkTokenExists(refreshToken)

    if(!tokenExists) {
        return {
            error: "error",
        }
    } else {
        //  await loginTokenRepository.deleteToken(refreshToken)
    }

    oauth2Client.setCredentials({"refresh_token": refreshToken})
    let tokens: any = await oauth2Client.refreshAccessToken()

    let token: any = {type: "REFRESH", value: tokens.credentials.refresh_token}
    // oauth2Client.setCredentials(tokens.credentials)

    await loginTokenRepository.saveNewToken(token)

    return {
        error: null,
        REFRESH_TOKEN: tokens.credentials.refresh_token,
        ACCESS_TOKEN: tokens.credentials.id_token
    }

}

export const signup = async (body: any) => {

    let userDetails = body;

    let repository = getRepository(User)
    let result: any = await repository.save(userDetails)

    return {
        error: null,
        success: true
    }

}

export const Login = async (body: any) => {

    let userRepository = getCustomRepository(CustomUserRepository);
    let userDetails = await userRepository.getUserFromEmail(body?.email);

    if (!userDetails) {
        return {
            error: true
        }
    }

    if(userDetails.password != body.password) {
        return {
            error: true
        }
    }

    let refreshToken = generateJWTTokens(userDetails)
    let accessToken = generateJWTTokens(userDetails)

    let loginTokenRepository = getCustomRepository(CustomLoginTokenRepository);
    let token: any = {type: "REFRESH", value: refreshToken}
    await loginTokenRepository.saveNewToken(token)

    return {
        error: null,
        REFRESH_TOKEN: refreshToken,
        ACCESS_TOKEN: accessToken
    }

}

export const logout = async (token: any) => {

    let refreshToken = token.split("~")[1]
    let tokenRepository = getCustomRepository(CustomLoginTokenRepository)
    await tokenRepository.deleteToken(refreshToken)
    return true

    // oauth2Client.setCredentials({"id_token": accessToken, "refresh_token": refreshToken})
    // await oauth2Client.revokeCredentials()

}

export const verifyJWTToken = async (token: string) => {

    const response: any = await axios.get("https://www.googleapis.com/oauth2/v1/certs")
    const certificates = response.data
    let ticket = null
    let error = false
    let tokenExpired = false

    try {
        // Get header information from token
        const header = jwt.decode(token, {complete: true})?.header

        // @ts-ignore
        const cert = certificates[header.kid];

        ticket = await oauth2Client.verifyIdToken({
            idToken: token,
            audience: googleApiId,  // Specify the CLIENT_ID of the app that accesses the backend
            // Or, if multiple clients access the backend:
            //[CLIENT_ID_1, CLIENT_ID_2, CLIENT_ID_3]
        });

        const payload = ticket.getPayload();
        let currentTime = Date.now();

        if (!payload) {
            error = true
        }

        jwt.verify(token, cert, {algorithms: ['RS256']}, (err, payload) => {
            if (err) {
                error = true
            }
        });

        if (payload?.aud != googleApiId) {
            error = true
        }

        // @ts-ignore
        if (payload.iss.indexOf("https://accounts.google.com") < 0) {
            error = true
        }

        if (!payload || new Date(payload.exp * 1000) < new Date(currentTime)) {
            error = true
            tokenExpired = true
        }

    } catch (e: any) {
        if(e.message.indexOf('Token used too late') >= 0) {
            tokenExpired = true
        }
        error = true
    }

    return {"error": error, "tokenExpired": tokenExpired}

}

const generateJWTTokens = (user: any) => {

    let token = jwt.sign({
        email: user,
        exp: Math.floor(Date.now() / 1000) + (60 * 60),
    }, jwt_secret);

    return token

}
