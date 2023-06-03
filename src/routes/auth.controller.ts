import * as authService from "../Service/AuthService"
import {authentication, authorization} from "../Service/AuthService"

export default (() => {
    const router = require('express').Router();

    router.post('/login', function (req: any, res: any) {
        authService.Login(req.body)
            .then((result:any) => {
                    if (result?.error != null) {
                        res.status(401).send({error:"Please enter valid email and password"})
                    } else {
                        res.cookie('token', result.ACCESS_TOKEN + "~" + result.REFRESH_TOKEN)
                        res.status(200).send(result)}
                }
            )
            .catch(err => {
                console.error(err);
                res.status(500).send(JSON.stringify({"error": err}))
            });
    });

    // router.get('/new-token', function (req: any, res: any) {
    //
    //     const tokens = req.headers['authorization'];
    //
    //     authService.newToken(tokens)
    //         .then((result:any) => {
    //                 if (result?.error != null) {
    //                     // res.set('Access-Control-Allow-Origin', '*');
    //                     res.redirect(302,'/admin')
    //                 } else {
    //                     res.status(200).send(result)}
    //             }
    //         )
    //         .catch(err => {
    //             console.error(err);
    //             res.status(500).send(JSON.stringify({"error": err}))
    //         });
    //
    // })

    router.post('/signup', function (req: any, res: any) {

        authService.signup(req.body)
            .then(result => {
                res.status(200).send(result)
            })
            .catch(err => {
                console.error(err);
                res.status(500)
                    .send(JSON.stringify({"error": err}))
            });
    });

    router.post('/logout', authentication, function (req: any, res: any) {

        const authorization = req.headers['authorization'];

        authService.logout(authorization)
            .then(result => {
                res.status(200).send(result)
            })
            .catch(err => {
                console.error(err);
                res.status(500)
                    .send(JSON.stringify({"error": err}))
            });

    });
    //////////////////////////////////INGREDIENTS/////////////////////////////////

    return router;
})
();
