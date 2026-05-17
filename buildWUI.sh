#!/bin/bash
rm -rf backend/wui/
mkdir backend/wui
cd L2-WUI
npm run build
cd ..
mv L2-WUI/dist/l2-wui/* backend/wui/
