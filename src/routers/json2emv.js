const express = require('express');
const router = new express.Router();
const {convertObjectToEMVCode} = require('../lib/json-emv-conv');
const {keyToIDMap} = require('../lib/key-and-id-mapping');
const _ = require('lodash');

router.post('/json2emv',(req,res)=>{
    const requestKeys = Object.keys(req.body);
    const invalidKeys = _.difference(requestKeys, Object.keys(keyToIDMap));
    const EMVCode = convertObjectToEMVCode(req.body);
    res.send({
        EMVCode,
        invalidKeys
    });
});

module.exports = router;