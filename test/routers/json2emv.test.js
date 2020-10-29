const request = require('supertest');
const app = require('../../src/app');

test("Should be able to receive response with input converted to EMVString", async()=>{
    const response = await request(app).post('/json2emv').send({
        pfi: '01',
        pim: '11',
        mait:{
            guid: 'pa.hil.pi02',
            acqid: 'PBTMNPHIXXX',
            merid: '892307653',
            pnflags: '123' 
        },
        mcc: '6016',
        txCurrency: '608',
        cc: 'PH',
        merCity: 'MANDALUYONG',
        merName: 'MYFOODHALL',
        additional:{
            refLabel: '3CF64D20941AAEFCE8C263A7A',
            termLabel: '00000000'
        }
        });
    expect(response.body).toEqual({
        invalidKeys: [],
        EMVCode: '00020101021128500011pa.hil.pi020111PBTMNPHIXXX030989230765305031235204601653036085802PH5910MYFOODHALL6011MANDALUYONG624105253CF64D20941AAEFCE8C263A7A0708000000006304D458'
    });
});

test("Should be able to specify invalid keys provided in the post request", async()=>{
    const response = await request(app).post('/json2emv').send({
        what : 'nope',
        are : 'nope',
        those : 'nope'
    });
    expect(response.body).toEqual({
        invalidKeys : ['what', 'are', 'those'],
        EMVCode : ""
    });
});

test("Should be able to process valid keys while pointing out invalid ones", async()=>{
    const response = await request(app).post('/json2emv').send({
        pfi: 'valid',
        pim: 'samedt',
        whatAreThose: 'eeeeee'
    });
    expect(response.body).toEqual({
        EMVCode: '0005valid0106samedt6304FF86',
        invalidKeys: ['whatAreThose']
    });
})