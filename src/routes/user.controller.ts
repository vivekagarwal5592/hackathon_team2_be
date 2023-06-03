import * as userService from "../Service/UserService"

export default (() => {
    const router = require('express').Router();

    router.get('/all/', function (req: any, res: any) {
        let start = req.params.start;
        userService.getAllUsers()
            .then((result: any) => res.status(200).send(result))
            .catch((err: any) => res.status(500).send(JSON.stringify({"error": err})));
    });

    router.get('/id/:id', function (req: any, res: any) {
        let id = req.params.id;
        userService.getUserById(id)
            .then((result: any) => res.status(200).send(result))
            .catch((err: any) => res.status(500).send(JSON.stringify({"error": err})));
    });
    
    router.put('/update', function (req: any, res: any) {
        const body = req.body;
        userService.updateUser(body)
            .then((result: any) => res.status(200).send(result))
            .catch((err: any) => res.status(500).send(JSON.stringify({"error": err})));
    });

    return router;
})();
