# SGI L2 Controller Webinterface

## Installation

$ npm install

## Configuration

Copy config.sample.js to config.js
Edit config.js
- host: set to IP or hostname of the L2 controller
- shellPrompt: this string must match the L2 console prompt, it's used to detect telnet command completion
- rackSorting: optional, you can define sort direction or set a custom order of IDs

## Start webserver
$ npm start

Connect to http://localhost:4201

## Autostart
To automatically start the webserver on each reboot, you can use the pm2 process manager (pm2-process.json)


(c) flexion and chulofiasco 2023

