const r1 = [ // display
    '001c01:',
    'revision: 2.0',
    'line 1: "001c01     \"',
    'line 2: "Powered Down"',
    'leds:  PWR=off   SERVICE=off     FAULT=off',
    '001r20:',
    'revision: 2.0',
    'line 1: "001r20     \"',
    'line 2: "Powered Down"',
    'leds:  PWR=off   SERVICE=off     FAULT=off',
    ''
];
// brick
const r2 = ["001c01:", "rack: 001, slot: 01, partition: none, type: C (IP45) [2MB flash], serial:NCC120, source: EEPROM", "", "001r20:", "rack: 001, slot: 20, partition: N/A, type: R [1MB flash], serial:NEA799, source: EEPROM", "", ""];

function init() {
    //    let rc = parse_display("");
    let rc = parse_brick("");
    console.log(rc)
}
function parse_brick(strin) {
    try {
        let rc = {};
        //const lst = strin.split('\n');
        const lst = r2;
        let objID = '';
        lst.forEach(row => {
            if (row !== '') {
                if (row.length == 7 && row.endsWith(':')) { // new device section indicator
                    objID = row.substring(0, 6);
                    rc[objID] = { id: objID };
                } else if (row.startsWith('rack:')) {
                    let tmp = row.split(',');
                    tmp.forEach(entry => {
                        let tmp2 = entry.trim().split(':');
                        rc[objID][tmp2[0].trim()] = tmp2[1].trim();
                    });
                    if (rc[objID].type) rc[objID].typeShort = rc[objID].type.substring(0, 1);
                    if (rc[objID].type.startsWith('C')) rc[objID].typeIP = rc[objID].type.substr(rc[objID].type.indexOf('(IP') + 1, 4);
                } else {
                    console.log("parse_display() unknown row:", row);
                }
            }
        });
        return rc;
    } catch (e) {
        console.error(e);
        return [];
    }
}
function parse_display(strdsp) {
    try {
        let rc = {};
        //const lst = strdsp.split('\n');
        const lst = r1;
        let objID = '';
        lst.forEach(row => {
            if (row !== '') {
                if (row.length == 7 && row.endsWith(':')) { // new device section indicator
                    objID = row.substring(0, 6);
                    rc[objID] = { id: objID };
                } else if (row.startsWith('revision:')) {
                    rc[objID].revision = row.substring(10, row.length);
                } else if (row.startsWith('line 1:')) {
                    rc[objID].line1 = row.split('"')[1];
                } else if (row.startsWith('line 2:')) {
                    rc[objID].line2 = row.split('"')[1];
                } else if (row.startsWith('leds:')) {
                    rc[objID].leds = { pwr: false, service: false, fault: false };
                    if (row.indexOf("PWR=on") > 0) rc[objID].leds.pwr = true;
                    if (row.indexOf("SERVICE=on") > 0) rc[objID].leds.service = true;
                    if (row.indexOf("FAULT=on") > 0) rc[objID].leds.fault = true;
                } else {
                    console.log("parse_display() unknown row:", row);
                }
            }
        });

        return rc;
    } catch (e) {
        console.error(e);
        return [];
    }
}
(init());