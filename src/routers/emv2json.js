const express = require('express');
const EMVParser = require('../lib/EMVParser');
const router = new express.Router();

router.post('/emv2json',(req,res)=>{
    if(typeof(req.body.emvinput) !== 'string') return res.status(400).send({error:'malformed emv input'})
    const emvParser = new EMVParser(req.body.emvinput);
    const result = emvParser.getObjectEquivalent();
    if(result.error) return res.status(400).send({error: `double check emv string characters enclosed within brackets[]: '${result.error}'`});
    res.send({
        result
    });
});

module.exports = router;