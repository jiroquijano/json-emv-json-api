const express = require('express');
const router = new express.Router();
const {convertObjectToEMVCode} = require('../lib/json-emv-conv');
const {keyToIDMap} = require('../lib/key-and-id-mapping');
const _ = require('lodash');

router.post('/json2emv',(req,res)=>{
    if(typeof(req.body.jsoninput) !== 'object') return res.status(400).send({error: 'malformed json input'});
    const requestKeys = Object.keys(req.body.jsoninput);
    const invalidKeys = _.difference(requestKeys, Object.keys(keyToIDMap));
    const EMVCode = convertObjectToEMVCode(req.body.jsoninput);
    res.send({
        EMVCode,
        invalidKeys
    });
});

module.exports = router;