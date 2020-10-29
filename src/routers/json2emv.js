const express = require('express');
const router = new express.Router();
const {convertObjectToEMVCode} = require('../lib/json-emv-conv');

router.post('/json2emv',(req,res)=>{
    const EMVCode = convertObjectToEMVCode(req.body);
    res.send({
        input: req.body,
        emvcode: EMVCode
    });
});

module.exports = router;