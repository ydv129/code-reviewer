const express = require('express');
const  router = express.Router();
const aiController = require("../controller/ai.controller");
router.get("/get-responce",aiController.getResponce)


router.get("/get-responce",)
module.exports = router;