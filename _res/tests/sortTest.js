let rc = [
    { "id": "001c01", "rack": "001", "slot": "01", "partition": "none", "productLabel": "", "type": "C (IP45) [2MB flash]", "serial": "NCC120", "source": "EEPROM", "brickType": "C", "skin": "o300", "display": { "id": "001c01", "revision": "2.0", "line1": "001c01     /", "line2": "Powered Up", "leds": { "pwr": true, "service": true, "fault": true } } },
    { "id": "001c03", "rack": "001", "slot": "01", "partition": "none", "productLabel": "silicon graphics tezro", "type": "C (IP45) [2MB flash]", "serial": "NCC120", "source": "EEPROM", "brickType": "C", "skin": "tezro", "display": { "id": "001c01", "revision": "2.0", "line1": "001c03     |", "line2": "Powered Down", "leds": { "pwr": false, "service": false, "fault": false } } },
    { "id": "001c02", "rack": "001", "slot": "01", "partition": "none", "productLabel": "sgi onyx 350", "type": "C (IP45) [2MB flash]", "serial": "NCC120", "source": "EEPROM", "brickType": "C", "skin": "o350", "display": { "id": "001c01", "revision": "2.0", "line1": "001c02     \\", "line2": "Powered Down", "leds": { "pwr": true, "service": true, "fault": true } } },
    { "id": "001r20", "rack": "001", "slot": "20", "partition": "N/A", "type": "R [1MB flash]", "serial": "NEA799", "source": "EEPROM", "brickType": "R", "skin": "router", "display": { "id": "001r20", "revision": "2.0", "line1": "001r20     |", "line2": "Powered Down", "leds": { "pwr": false, "service": false, "fault": true } } }
];

let config = {
    rackSorting: {
        sortAscending: false,
        useCustomSortOrder: true,
        sortOrder: [
            "001c01",
            "001r20",
            "001c05",
            "001c04",
            "001c06"
        ]
    }
};
function init() {
    let lst = getRackSummary();
    console.log("------result-----")
    lst.forEach(itm => { console.log(itm.id) })
    console.log("------expected-----")
    console.log(config.rackSorting.sortOrder)
}
function getRackSummary() {
    // sort order
    if (!config.rackSorting) return rc;
    if (config.rackSorting.useCustomSortOrder) {
        console.log("custom order");
        // add a new sort attribute
        let sortNotInList = 512;
        rc.forEach(brick => {
            let sortNr = config.rackSorting.sortOrder.indexOf(brick.id || '');
            brick.sortNr = sortNr >= 0 ? sortNr : sortNotInList++;
        });
        rc.sort((a, b) => parseFloat(a.sortNr) - parseFloat(b.sortNr));
    } else {
        if (config.rackSorting.sortAscending) {
            rc.sort((current, next) => { return current.id.localeCompare(next.id) });
        } else {
            rc.sort((current, next) => { return next.id.localeCompare(current.id) });
        }
    }
    return rc;
}

init();