#!/usr/bin/env node
"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const utils_1 = require("@car_han/utils");
const commander_1 = require("commander");
const package_json_1 = __importDefault(require("../package.json"));
const build_1 = require("./build");
const buildfs_1 = require("./build/buildfs");
class CLI {
    get program() {
        return this.program;
    }
    static init() {
        return __awaiter(this, void 0, void 0, function* () {
            this.program = commander_1.program;
            this.program
                .name("thx-cli")
                .description(package_json_1.default.description)
                .version(package_json_1.default.version);
            this.cmdRegiste();
            this.subCmdRegiste();
            this.cmdParse();
            this.handleInputOption();
        });
    }
    static cmdRegiste() {
        this.program.enablePositionalOptions().option("-d, --debug");
    }
    static subCmdRegiste() {
        this.program
            .command("build")
            .description("build fs and so on.")
            .option("-f, --fs <emmetInput>", "test cmd desc")
            .action(params => {
            if (utils_1.T.isValidStr(params.fs)) {
                const astData = buildfs_1.FSManager.compile2AST(params.fs);
                buildfs_1.FSManager.ask2GenFile(astData);
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
            console.log("parse error!");
        }
    }
    static handleInputOption() {
        // if (T.isValidObj(this.options)) {
        // 	if (this.options.debug) {
        // 		console.log(this.options);
        // 	}
        // }
    }
}
CLI.init();
