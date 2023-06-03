import * as pSlotService from "../Service/parkingSlotService";

export default (() => {
  const router = require("express").Router();

  router.get("/all", function (req: any, res: any) {
    pSlotService
      .getAllParkingSlots()
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
    pSlotService
      .parkVehicle(req.body)
      .then((result: any) => res.status(200).send(result))
      .catch((err: any) => res.status(500).send(err));
  });
  
  router.put("/unParkVehicle", function (req: any, res: any) {
    pSlotService
      .unParkVehicle(req.body)
      .then((result: any) => res.status(200).send(result))
      .catch((err: any) => res.status(500).send(err));
  });

  return router;
})();
