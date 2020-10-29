# JSON to EMV API endpoint `/json2emv`
>#### Converts JSON input to EMV String

### Request: `/json2emv`
| url           | `https://<host>/json2emv`|
| ------------- |:------------------------:|
| method        | 'POST'                     |
##### Headers
`'Content-Type' : 'application/json'`
##### Body
```
{
    pfi: <string[2]>,                 //[ID=00] Payload Format Indicator [Mandatory]
    pim: <string[2]> O,               //[ID=01] Point of initiation method {11=static,12=dynamic} [Optional]
    mait: <object[0...99]>            //[ID=28] P2M Merchant Account information template [Optional]
    {    
        guid: <string[1...20]>,       //[ID=00] Globally Unique Identifier [Mandatory]
        acqid: <string[11]>,          //[ID=01] Acquirer ID [Mandatory]
        merid: <string[1...25]>,      //[ID=03] Merchant ID [Conditional]
        pnflags: <string[3]>          //[ID=05] Proxy notify flags [Mandatory]
    },
    mcc: <string[4]>,                 //[ID=52] Merchant Category Code [Mandatory]
    txCurrency: <string[3]>,          //[ID=53] Transaction currency [Mandatory]
    txAmt: <string[0...13]>,          //[ID=54] Transaction amount [Conditional]
    cc: <string[2]>,                  //[ID=58] Country code [Mandatory]
    merName: <string[1...25]>,        //[ID=59] Merchant name [Mandatory]
    merCity: <string[1...15]>,        //[ID=60] Merchant city [Mandatory]
    additional: <object[0...99]>      //[ID=62] Additional data field template [Optional]
    {
        refLabel: <string[1...25]>,   //[ID=05] Reference label [Mandatory]
        termLabel: <string[1...8]>    //[ID=07] Terminal label [Conditional]
    }
}
```
### Response: `/json2emv`
----
### If request is not malformed in any way
##### Status Code - `200`
##### Body
```javascript
//EMVCode - string output of POST - /json2emv
//invalidKeys - array of keys from request body which were invalid
{
    EMVCode: '00020101021128500011pa.hil.pi020111PBTMNPHIXXX030989230765305031235204601653036085802PH5910MYFOODHALL6011MANDALUYONG624105253CF64D20941AAEFCE8C263A7A0708000000006304D458',
    invalidKeys = ['what', 'are', 'thooooseee']
}
```
----
### If request body is malformed
##### Status Code - `400`
##### Body
```javascript
{
  error: 'malformed json input'
}
```
----
<br><br/>
# EMV to JSON API endpoint `/emv2json`
>#### Converts EMV string input to JSON

### Request: `/emv2json`
| url           | `https://<host>/emv2json`|
| ------------- |:------------------------:|
| method        | 'POST'                     |
##### Headers
`'Content-Type' : 'application/json'`
##### Body
```javascript
{
  emvinput: '00020101021128500011pa.hil.pi020111PBTMNPHIXXX030989230765305031235204601653036085802PH5910MYFOODHALL6011MANDALUYONG624105253CF64D20941AAEFCE8C263A7A0708000000006304D458'
}
```
### Response: `/emv2json`
----
### If *emvinput* provided in request body is valid
##### Status Code
`200`
##### Body
```javascript
{
    result: {
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
```
----
### If *emvinput* provided in request body contains some format errors
##### Status Code - `400`
##### Body
```javascript
//'hi' was enclosed in brackets because it is not a valid EMV tag/key
{
  error: "double check emv string characters enclosed within brackets[]: '0001a0105yineo[hi]03abc'"
}
```
----
### If *emvinput* provided in request body contains invalid CRC
##### Status Code - `400`
##### Body
```javascript
{
    error: "CRC in input EMV is incorrect",
    inputCRC: "85A6",
    calculatedCRC: "D458",
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
}
```
