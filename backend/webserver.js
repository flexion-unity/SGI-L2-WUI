const config = require('./config');
const version = "20231121-1730";
const { telnetsvc } = require('./functions/telnet-api');

const server = require('http').createServer();
const express = require('express');
const router = express.Router();
const app = express();
app.use((req, res, next) => {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    next();
});

function setupRoutes() {
    router.route('/')
        .get((req, res) => {
            res.writeHead(302, { 'Location': 'wui/index.html' });
            res.end();
        });
    router.route('/api/version')
        .get((req, res) => {
            res.json({ success: true, version: version });
        });
    router.route('/api/l2/config')
        .get(async (req, res) => {
            let rc = await telnetsvc.cmd_config();
            res.json({ success: true, config: rc });
        });
    router.route('/api/l2/brick')
        .get(async (req, res) => {
            let rc = await telnetsvc.cmd_brick();
            res.json({ success: true, brick: rc });
        });
    router.route('/api/l2/router')
        .get(async (req, res) => {
            let rc = await telnetsvc.cmd_router();
            res.json({ success: true, router: rc });
        });
    router.route('/api/l2/powerup')
        .get(async (req, res) => {
            let rc = await telnetsvc.cmd_power("", true);
            res.json({ success: true, rc });
        });
    router.route('/api/l2/powerdown')
        .get(async (req, res) => {
            let rc = await telnetsvc.cmd_power("", false);
            res.json({ success: true, rc });
        });
    router.route('/api/l2/env/summary')
        .get(async (req, res) => {
            let rc = await telnetsvc.cmd_plain("env summary", false);
            res.json({ success: true, response: rc });
        });
    router.route('/api/l2/fan')
        .get(async (req, res) => {
            let rc = await telnetsvc.cmd_plain("fan", false);
            res.json({ success: true, response: rc });
        });
    router.route('/api/l2/display')
        .get(async (req, res) => {
            let rc = await telnetsvc.cmd_display();
            res.json({ success: true, display: rc });
        });
    router.route('/api/l2/racksummary')
        .get(async (req, res) => {
            let rc = await telnetsvc.cmd_racksummary(config);
            res.json({ success: true, racksummary: rc });
        });
    router.route('/api/l2/bricksummary/:sysid')
        .get(async (req, res) => {
            let rc = await telnetsvc.cmd_bricksummary(req.params.sysid);
            res.json({ success: true, bricksummary: rc });
        });
    router.route('/api/l2/rawcmd/:cmd')
        .get(async (req, res) => {
            let cmd = req.params.cmd || '';
            if (cmd === '') return res.json({ success: false, response: 'Illegal call' });
            let rc = await telnetsvc.cmd_plain(cmd, false);
            res.json({ success: true, response: rc });
        });

    app.use('/', router);
    app.use("/wui/", express.static(__dirname + '/wui/'));
    app.listen(config.webport);
    server.on('request', app);
    console.log('Web-Server listening on port ' + config.webport);
}
function init() {
    console.log('flx-SGI-L2-API version ' + version);
    telnetsvc.init(config);
    setupRoutes();
}

init();
