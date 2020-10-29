const express = require('express');
const EMVParser = require('../lib/EMVParser');
const router = new express.Router();
const {crc16ccitt} = require('crc');
const _ = require('lodash');

const checkCRC = (emvinput)=>{
    const payload = emvinput.slice(0,emvinput.length-8);
    const crcpart = emvinput.slice(emvinput.length-8);
    if(crcpart.slice(0,4) !== '6304') return {correct: true}; //if emv string doesn't have crc tag   
    const calculatedCRC = _.padStart(crc16ccitt(`${payload}6304`).toString(16).toUpperCase(),4,'0');
    const inputCRC = crcpart.slice(4);
    if(calculatedCRC === inputCRC) {
        return {correct: true};
    }else{
        return {
            correct: false,
            calculatedCRC,
            inputCRC
        }
    }
}

router.post('/emv2json',(req,res)=>{
    if(typeof(req.body.emvinput) !== 'string') return res.status(400).send({error:'malformed emv input'})
    const emvParser = new EMVParser(req.body.emvinput);
    const result = emvParser.getObjectEquivalent();
    if(result.error) return res.status(400).send({error: `double check emv string characters enclosed within brackets[]: '${result.error}'`});
    const crcCheckResult = checkCRC(req.body.emvinput);
    if(crcCheckResult.correct === false) return res.status(400).send({
        error: `CRC in input EMV is incorrect`,
        inputCRC: crcCheckResult.inputCRC,
        calculatedCRC: crcCheckResult.calculatedCRC,
        translated: result
    });
    res.send({
        result
    });
});

module.exports = router;