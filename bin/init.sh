#!/bin/bash
cd ./..;
npm init -y;
echo node_modules > .gitignore;
echo .DS_Store >> .gitignore;
# $0是脚本名称 $$0是pid号, $1开始是脚本参数
echo $1 > README.md