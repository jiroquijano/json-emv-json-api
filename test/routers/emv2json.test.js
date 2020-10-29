const request = require('supertest');
const app = require('../../src/app');

test("Should be able to properly decode EMV string via post to emv2json endpoint",async()=>{
    const testInputEMV = '00020101021128500011pa.hil.pi020111PBTMNPHIXXX030989230765305031235204601653036085802PH5910MYFOODHALL6011MANDALUYONG624105253CF64D20941AAEFCE8C263A7A0708000000006304D458'
    const response = await request(app).post('/emv2json').send({
        emvinput : testInputEMV
    });
    expect(response.body).toEqual({
        result:{
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
            },
            crc: "D458"
        }
    });
});

test("Should be able to point out which part of the input EMV string is erratic", async()=>{
    const malformedEMV = '000201hi0211';
    const response = await request(app).post('/emv2json')
        .expect(400)
        .send({
        emvinput: malformedEMV
        });
    expect(response.body).toEqual({
        error: `double check emv string characters enclosed within brackets[]: '000201[hi]0211'`
    })
});

test("Should be able to reject input EMV string if crc is not correct", async()=>{
    const testInputEMV = '00020101021128500011pa.hil.pi020111PBTMNPHIXXX030989230765305031235204601653036085802PH5910MYFOODHALL6011MANDALUYONG624105253CF64D20941AAEFCE8C263A7A070800000000630485A6'
    const response = await request(app).post('/emv2json')
        .expect(400).send({
            emvinput: testInputEMV
        });
    expect(response.body).toEqual({
        error: 'CRC in input EMV is incorrect',
        inputCRC: '85A6',
        calculatedCRC: 'D458',
        translated: {
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
            },
            crc: "85A6"
        }
    });
});