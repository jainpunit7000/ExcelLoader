const express = require('express');
const router = express.Router();
const errorController = require("../controllers/error") ;

router.get("/fileError",errorController.getError) ;

router.use(errorController.get404) ;

module.exports = router ;