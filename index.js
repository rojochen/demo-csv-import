/*
INSERT INTO TABLE1 (COL1 , COL2,COL3) values
('A STRING' , 5 , (select idTable2 from Table2) )
where ...
*/
var winston = require('winston');
const infoPath = __dirname + 'prod.csv';// process.env.INFO_PATH;
const detailPath = process.env.DETAIL_PATH;
const prodPath =  'prod.csv';
const csv = require('csvtojson');
const fs = require('fs');
var infoArray = [];
var detailArray = [];
var prodArray = [];
const logFormatter = function(options) {
    return options.message;
};
const timestamp = function() {
    const d = new Date();
    return d.getHours() + `:` + d.getMinutes() + `:` +
        d.getSeconds() + `m` + d.getMilliseconds();
};

const logger = new (winston.Logger)({
    transports: [
        new (winston.transports.File)({
            timestamp: timestamp,
            formatter: logFormatter,
            level: `info`,
            name: `fileAll`,
            filename: `fileAll.log`,
            json: false,
            flags:'w'
        })
    ]
});
fs.exists('./export.sql', function(exists) {
  if(exists) {
    //Show in green
    fs.unlink('./export.sql');
  } else {
    //Show in red
    console.log('File not found, can not deleting.');
  }
}); 


winston.log('debug', 'Start process');
winston.add(winston.transports.File, {
    filename: 'somefile.log'
});
const creatrInfoSQLCmd = (item) => {
    let template = `insert info '' from db_host_info`;
};

//handle prod event
process.on('onProdLoadDone', (prodData) => {
    //trigger on infoPathLoadDone
    logger.log('debug', 'infoPathLogDone');
    
    processInfo();
});

//handle info event
process.on('onInfoPathDone', (infoData) => {
    //trigger on infoPathLoadDone
    logger.log('debug', 'infoPathLogDone');
    processInfo();
});
//handle detail event
process.on('onDetailPathDone', (infoData) => {
    //trigger on infoPathLoadDone
    logger.log('debug', 'detailPathDone');

});




function processInfo() {
    csv().fromFile(prodPath).on('json', (jsonObj) => {
    //let jsonArray = jsonObj;
    winston.log('debug', jsonObj);
 
    }).on('done', (error) => {
        winston.log('info', 'end process info file!');
        process.emit('onProccDetail')
    });
}

function processDetail() {
     csv().fromFile(prodPath).on('json', (jsonObj) => {
        let jsonArray = jsonObj;
        winston.log('debug', jsonObj);
 
    }).on('done', (error) => {
        winston.log('info', 'end process info file!');
        process.emit('onProccDetail')
    });
}

function processProd() {
     csv().fromFile(prodPath).on('json', (jsonObj) => {
        let jsonArray =  jsonObj;
        winston.log('info', jsonObj);
         

    }).on('done', (error) => {
        winston.log('info', 'end process info file!');
        process.emit('onProccDetail')
    });
}

processProd();