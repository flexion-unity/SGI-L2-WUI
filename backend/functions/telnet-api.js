const { Telnet } = require('telnet-client');
const connection = new Telnet();
const params = {
    host: '',
    port: 23,
    shellPrompt: '',
    negotiationMandatory: false,
    timeout: 1000 * 60 * 2
}
let connected = false;
const telnetsvc = {};

telnetsvc.init = (cfg) => {
    if (cfg.L2.host) params.host = cfg.L2.host;
    if (cfg.L2.shellPrompt) params.shellPrompt = cfg.L2.shellPrompt;
};
connection.on('ready', prompt => {
    connected = true;
    console.log('[telnet] L2 connected');
});
connection.on('timeout', () => {
    console.log('[telnet] L2 disconnecting due to no activity');
    connection.end();
    connected = false;
});
connection.on('close', () => {
    console.log('[telnet] L2 connection closed');
    connected = false;
});
const delay = ms => new Promise(res => setTimeout(res, ms));

async function l2connect() {
    try {
        if (connected) return true;
        console.log("[telnet] Connecting to " + params.host);
        await connection.connect(params);
        await delay(2000);
        connected = true;
        return true;
    } catch (e) {
        console.error(e);
        console.warn("[telnet] L2 not connected");
        return false;
    }
}
function parse_config(strcfg) {
    try {
        let lstRC = [];
        const lst = strcfg.split('\n');
        lst.forEach(row => {
            if (row !== '') {
                if (row.startsWith("L1")) {
                    let tmp1 = row.split(" ");
                    lstRC.push({ ltype: "L1", addr: tmp1[1], id: row.split("-")[1].trim() });
                } else if (row.startsWith("L2")) {
                    let tmp = row.split(" "); // [ "L2", "172.16.9.1:", "-", "001", "(LOCAL)" ]
                    lstRC.push({ ltype: "L2", addr: tmp[1], id: tmp[3] });
                } else {
                    console.log("[parse_config] Unknown config line: ", row);
                }
            }
        });
        return lstRC;
    } catch (e) {
        console.error(e);
        return [];
    }
}
function parse_display(strdsp) {
    try {
        let rc = {};
        const lst = strdsp.split('\n');
        let objID = '';
        lst.forEach(row => {
            if (row !== '') {
                if (row.length == 7 && row.endsWith(':')) { // new device section indicator
                    objID = row.substring(0, 6);
                    // Note: some firmware versions of routers do not report LEDs, add LEDs anyway
                    rc[objID] = { id: objID, leds: { pwr: false, service: false, fault: false } };
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
function parse_brick(strin, config) {
    try {
        let rc = {};
        const lst = strin.split('\n');
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
                    rc[objID].brickType = rc[objID].id.substr(3, 1).toUpperCase();
                    /* Known type values:
                    o300: "C (IP45) [2MB flash]"
                    Tezro: "Rackmount WS [2MB flash]"
                    "Chimera Blade [2MB flash]" = Onyx350
                    "Chimera Server [2MB flash]" = Origin350
                    "Opus [2MB flash]" = Altix 350
                    "C (IP41) [2MB flash]" = Altix 3000
                    "IX [2MB flash]" = Altix 3000 iX
                     */
                    if (rc[objID].brickType === 'R') {
                        if (config.routerStyle && config.routerStyle === "altix") {
                            rc[objID].skin = "router-altix";
                        } else {
                            rc[objID].skin = "router";
                        }
                    } else {
                        let bType = (rc[objID].type || '').trim();
                        if (bType.startsWith('C (IP45)')) {
                            rc[objID].skin = "o300";
                            rc[objID].productLabel = 'sgi origin 300';
                        } else if (bType.toLowerCase().indexOf('rackmount)') >= 0) {
                            rc[objID].skin = "tezro";
                            rc[objID].productLabel = "silicon graphics tezro";
                        } else if (bType.toLowerCase().indexOf('chimera blade') >= 0) {
                            rc[objID].skin = "o350";
                            rc[objID].productLabel = "sgi onyx 350";
                        } else if (bType.startsWith('Opus')) { //Altix 350
                            if (config.altix350Style == "grey") {
                                rc[objID].skin = "grey";
                            } else {
                                rc[objID].skin = "yellow";
                            }
                            rc[objID].productLabel = "sgi altix 350";
                        }  else if (bType.startsWith('C (IP41)')) { //Altix 3000
                            rc[objID].skin = "a3000";
                            rc[objID].productLabel = "sgi altix 3000";
                        }  else if (bType.startsWith('IX')) { //Altix iX
                            rc[objID].skin = "a3000ix";
                            rc[objID].productLabel = "sgi altix iX brick";
                        } else { // Chimera server
                            rc[objID].skin = "o350";
                            rc[objID].productLabel = "sgi origin 350";
                        }
                    }
                } else if (row.startsWith('firmware revision')) {
                    // ignore
                } else {
                    console.log("parse_brick() unknown row:", row);
                }
            }
        });
        return rc;
    } catch (e) {
        console.error(e);
        return [];
    }
}
telnetsvc.cmd_plain = async (cmd) => {
    try {
        if (!await l2connect()) return [];
        let rc = await connection.exec(cmd);
        return rc.split("\n");
    } catch (e) {
        console.log(e);
        return [];
    }
};
telnetsvc.cmd_brick = async (config) => {
    try {
        if (!await l2connect()) return [];
        let rc = await connection.exec("brick");
        return parse_brick(rc, config);
    } catch (e) {
        console.log(e);
        return [];
    }
};
telnetsvc.cmd_config = async () => {
    try {
        if (!await l2connect()) return [];
        let rc = await connection.exec("config");
        return parse_config(rc);
    } catch (e) {
        console.log(e);
        return [];
    }
};
telnetsvc.cmd_display = async () => {
    try {
        if (!await l2connect()) return [];
        let rc = await connection.exec("display");
        return parse_display(rc);
    } catch (e) {
        console.log(e);
        return [];
    }
};
telnetsvc.cmd_router = async () => {
    try {
        if (!await l2connect()) return [];
        let rc = await connection.exec("router");

        return rc.split('\n');
    } catch (e) {
        console.log(e);
        return [];
    }
};
telnetsvc.cmd_power = async (target, up) => {
    try {
        if (!await l2connect()) return false;
        let cmd = "power " + (up ? "up" : "down");
        if (target && target !== "") cmd = target + " " + cmd;
        let rc = await connection.exec(cmd);
        return rc;
    } catch (e) {
        console.log(e);
        return [];
    }
};
telnetsvc.cmd_racksummary = async (config) => {
    // combined data of brick and display
    try {
        if (!await l2connect()) return [];
        let displayRC = await connection.exec("display");
        let display = parse_display(displayRC);
        let brickRC = await connection.exec("brick");
        let brick = parse_brick(brickRC, config);
        // combine both payloads into list array
        let rc = [];
        for (let b in brick) {
            let thisbrick = brick[b];
            thisbrick.display = display[b] || {};
            rc.push(thisbrick);
        }
        if (!config.rackSorting) return rc;
        if (config.rackSorting.useCustomSortOrder) {
            // add a new sort attribute 'sortNr'
            let sortNotInList = 512;
            rc.forEach(brick => {
                let sortNr = config.rackSorting.sortOrder.indexOf(brick.id || '');
                brick.sortNr = sortNr >= 0 ? sortNr : sortNotInList++;
            });
            rc.sort((a, b) => parseFloat(a.sortNr) - parseFloat(b.sortNr));
        } else {
            if (config.rackSorting?.sortAscending) {
                rc.sort((current, next) => {
                    let numA = parseInt(current.id.replace(/\D/g, ''));
                    let numB = parseInt(next.id.replace(/\D/g, ''));
                    return numA - numB;
                });
            } else {
                rc.sort((current, next) => {
                    let numA = parseInt(current.id.replace(/\D/g, ''));
                    let numB = parseInt(next.id.replace(/\D/g, ''));
                    return numB - numA;
                });
            }
        }
        return rc;
    } catch (e) {
        console.log(e);
        return [];
    }
};
telnetsvc.cmd_bricksummary = async (sysid, config) => {
    // combined data of brick and display
    try {
        if (!await l2connect()) return [];
        let displayRC = await connection.exec(sysid + " display");
        let display = parse_display(displayRC);
        let brickRC = await connection.exec(sysid + " brick");
        let brick = parse_brick(brickRC, config);
        // combine both payloads into list array
        let rc = [];
        for (let b in brick) {
            let thisbrick = brick[b];
            thisbrick.display = display[b] || {};
            rc.push(thisbrick);
        }
        return rc;
    } catch (e) {
        console.log(e);
        return [];
    }
};

module.exports.telnetsvc = telnetsvc;
