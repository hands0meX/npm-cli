#!/usr/bin/env node
"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const utils_1 = require("@car_han/utils");
const commander_1 = require("commander");
const package_json_1 = __importDefault(require("../package.json"));
const build_1 = require("./build");
class CLI {
    get program() {
        return this.program;
    }
    static init() {
        this.program = commander_1.program;
        this.cmdRegiste();
        this.subCmdRegiste();
        this.cmdParse();
        this.handleInputOption();
    }
    static cmdRegiste() {
        this.program
            .name("thx-cli")
            .description(package_json_1.default.description)
            .version(package_json_1.default.version);
        this.program
            .option("-d, --debug", "show input info")
            .option("-i, --input <value>", "input val", "default");
        this.program.addHelpText("beforeAll", `😊😊😊😊😊😊😊😊😊😊😊😊😊 test 😊😊😊😊😊😊😊😊😊😊😊😊😊`);
        this.program.addHelpText("afterAll", `😊😊😊😊😊😊😊😊😊😊😊😊😊 test 😊😊😊😊😊😊😊😊😊😊😊😊😊`);
    }
    static subCmdRegiste() {
        this.program
            .command("build")
            .description("build fs and so on.")
            .option("-t, --test", "test cmd desc")
            .action(params => {
            (0, build_1.build)();
        });
    }
    static cmdParse() {
        this.program.parse();
        this.options = this.program.opts();
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
