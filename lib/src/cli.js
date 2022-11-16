"use strict";
// term("Hello World!\n");
// term.red("red\n");
// term.bold("bold\n");
// term.bold.underline.red("mixed\n");
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
// term.green("My name is %s, I'm %d.\n", "hsx", 27);
// term("The terminal size is %d * %d\n", term.width, term.height);
// term.magenta("Enter your name: ");
// term.inputField(function (error, input) {
// 	term.green("\nYour name is '%s'\n", input);
// 	process.exit(0);
// });
// term.moveTo(1, 1);
// term.moveTo(1, 1, "Upper-left corner.\n");
// term.moveTo.cyan(1, 1, "My name is %s, I'm %d.\n", "Jack", 32);
// term.spinner("impulse");
// term.spinner("lineSpinner");
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
            .command("build <params>")
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
