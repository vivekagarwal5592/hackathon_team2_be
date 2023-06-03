import * as plotService from "../Service/parkingLotService"

export default (() => {
    const router = require('express').Router();

    router.get('/all/', function (req: any, res: any) {
        let start = req.params.start;
        plotService.getAllParkingLots()
            .then((result: any) => res.status(200).send(result))
            .catch((err: any) => res.status(500).send(err));
    });

    router.get('/id/:id', function (req: any, res: any) {
        let id = req.params.id;
        plotService.getSingleParkingLot(id)
            .then((result: any) => res.status(200).send(result))
            .catch((err: any) => res.status(500).send(err));
    });

    router.post('/add', function (req: any, res: any) {
        let parkingLot = req.body;
        plotService.insertParkingLot(parkingLot)
            .then((result: any) => res.status(200).send(result))
            .catch((err: any) => res.status(500).send(err));
    });

    router.post('/update', function (req: any, res: any) {
        let parkingLot = req.body.parkinglot;
        plotService.updateParkingLot(parkingLot)
            .then((result: any) => res.status(200).send(result))
            .catch((err: any) => res.status(500).send(err));
    });

    return router;
})();
