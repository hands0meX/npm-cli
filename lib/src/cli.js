#!/usr/bin/env node
"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const utils_1 = require("@car_han/utils");
const commander_1 = require("commander");
const package_json_1 = __importDefault(require("../package.json"));
const terminal_kit_1 = require("terminal-kit");
const build_1 = require("./build");
const buildfs_1 = require("./build/buildfs");
class CLI {
    static options;
    static program;
    get program() {
        return this.program;
    }
    static async init() {
        this.program = commander_1.program;
        this.program
            .name("thx-cli")
            .description(package_json_1.default.description)
            .version(package_json_1.default.version);
        this.cmdRegiste();
        this.subCmdRegiste();
        this.cmdParse();
        this.handleInputOption();
    }
    static cmdRegiste() {
        this.program.option("-d, --debug");
    }
    static subCmdRegiste() {
        this.program
            .command("build")
            .description("build fs and so on.")
            .option("--fs <emmetInput>", "build your target directory by command.")
            .option("--fsp <targetPath>", "input your target path to parse as a string")
            .action(params => {
            if (utils_1.T.isValidStr(params.fs)) {
                buildfs_1.FSManager.gen(params.fs);
            }
            else if (utils_1.T.isValidStr(params.fsp)) {
                const parsedDirString = buildfs_1.FSManager.compile2ASTByDir(params.fsp);
                terminal_kit_1.terminal.green(parsedDirString + "\n");
            }
            else {
                (0, build_1.build)();
            }
        });
    }
    static cmdParse() {
        try {
            this.program.parse();
            this.options = this.program.opts();
        }
        catch (error) {
            console.log("parse error!", error);
        }
    }
    static handleInputOption() {
        if (utils_1.T.isValidObj(this.options)) {
            if (this.options.debug) {
                console.log(this.options);
            }
        }
    }
}
CLI.init();
