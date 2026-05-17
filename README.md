# SGI L2 Controller Web User Interface

by flexion and chulofiasco 2023


# L2-WUI
This folder contains the Angular project to build the frontend. You only need this to compile the frontend which will be placed in the /wui/ folder of the webserver.

# backend
This folder contains the node express webserver. The /wui/ directory contains the compiled angular frontend which you generate by running buildWUI.sh (see below).

# Setup
In the L2-WUI directory run `npm install` to download required angular packages to build the frontend.
Then go back to the root directory of the repository and run `./buildWUI.sh`.
This will build the angular app and move the output of `dist` to the `wui` directory in the backend.

Now go to the `backend` directory: 
- run `npm install` to install node packages for the webserver.
- copy config.sample.js to config.js
- Edit config.js and set the hostname or IP of your L2 controller. Set `shellPrompt` to EXACTLY match the prompt in your L2 console. This will be used to detect when a command has completed!

Now start the webserver, launch `npm start` in the backend directory.

Navigate to http://{IP}:4201
