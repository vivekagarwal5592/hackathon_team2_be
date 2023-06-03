import * as pSlotService from "../Service/parkingSlotService";

export default (() => {
  const router = require("express").Router();

  router.get("/all", function (req: any, res: any) {
    pSlotService
      .getAllParkingSlots()
      .then((result: any) => res.status(200).send(result))
      .catch((err: any) => res.status(500).send(err));
  });

  router.get("/parkingLot/:parkingLotId", function (req: any, res: any) {
    let parkingLotId = req.params.parkingLotId;
    pSlotService
      .getAllParkingSlotsForParkingLot(parkingLotId)
      .then((result: any) => res.status(200).send(result))
      .catch((err: any) => res.status(500).send(err));
  });

  router.get("/id/:id", function (req: any, res: any) {
    let id = req.params.id;
    pSlotService
      .getSingleParkingSlot(id)
      .then((result: any) => res.status(200).send(result))
      .catch((err: any) => res.status(500).send(err));
  });

  router.put("/parkVehicle", function (req: any, res: any) {
    const userId = req.body.userId;
    const parkingSlotId = req.body.parkingSlotId;
    const engagedFor = req.body.engagedFor;
    const updatedParkingSlot = {
      userId: userId,
      engagedFor: engagedFor,
      isAvailable: false,
    };
    
    pSlotService
      .updateParkingSlot(updatedParkingSlot, parkingSlotId)
      .then((result: any) => res.status(200).send(result))
      .catch((err: any) => res.status(500).send(err));
  });
  
  router.put("/unParkVehicle", function (req: any, res: any) {
    const userId = req.body.userId;
    const parkingSlotId = req.body.parkingSlotId;
    
    const updatedParkingSlot = {
      userId: userId,
      isAvailable: true,
    };

    pSlotService
      .updateParkingSlot(updatedParkingSlot, parkingSlotId)
      .then((result: any) => res.status(200).send(result))
      .catch((err: any) => res.status(500).send(err));
  });

  return router;
})();
