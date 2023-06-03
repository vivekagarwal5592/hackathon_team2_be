import * as imageService from "../Service/ImageService";

export default (() => {
    const router = require('express').Router();

    router.get('/:fileName',function(req: any, res: any) {
        let fileName = req.params.fileName;

        let compress = !(req.query.compress === "false");

        imageService.getRecipeImage(fileName, compress)
            .then(
                result => {
                    res.writeHead(200, {'Content-Type': 'image/jpeg'});
                    res.end(result, 'binary');
                })
            // res.status(200).send(result)})
            .catch(err =>{
                console.error(err);
                res
                    .status(500)
                    .send(JSON.stringify({"error": err}))});
    });

    router.get('/temp-image/:fileName',function(req: any, res: any) {
        let fileName = req.params.fileName;

        imageService.getTempImage(fileName)
            .then(
                result => {
                    res.writeHead(200, {'Content-Type': 'image/jpeg'});
                    res.end(result, 'binary');
                })
            // res.status(200).send(result)})
            .catch(err =>{
                console.error(err);
                res
                    .status(500)
                    .send(JSON.stringify({"error": err}))});
    });



    return router;
})()
