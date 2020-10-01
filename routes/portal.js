const express = require('express');
const router = express.Router();
const homeController = require("../controllers/home") ;

router.get("/home",homeController.getHome) ;

router.post("/upload",homeController.postUpload) ;

router.get("/success/:data",homeController.getSuccess) ;

module.exports = router ;