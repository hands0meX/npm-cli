"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.FSManager = void 0;
// import { terminal as term } from "terminal-kit";
const utils_1 = require("@car_han/utils");
const fs_1 = __importDefault(require("fs"));
const path_1 = __importDefault(require("path"));
const terminal_kit_1 = require("terminal-kit");
const MOD = {
    NAME: "#",
    MUTI: "*",
    INCREMENT: "$",
    CHAIN: ">",
    BRO: "+",
};
const FILE_TYPE = {
    FOLDER: "F",
};
class FSManager {
    static buildFS() {
        terminal_kit_1.terminal.magenta("Enter file system by emmet:");
        terminal_kit_1.terminal.inputField((error, input) => {
            if (input === "") {
                terminal_kit_1.terminal.red("\nempty string");
                this.ask2Exit();
            }
            const astData = this.compile2AST(input);
            console.log(astData);
            this.ask2GenFile(astData);
        });
        // callback 形式补全写法
        // var autoCompleter = function autoCompleter(inputString, callback) {
        // 	fs.readdir(__dirname, function (error, files) {
        // 		callback(undefined, termkit.autoComplete(files, inputString, true));
        // 	});
        // };
        // term("Choose a file: ");
        // term.inputField(
        // 	{ autoComplete: autoCompleter, autoCompleteMenu: true },
        // 	function (error, input) {
        // 		if (error) {
        // 			term.red.bold("\nAn error occurs: " + error + "\n");
        // 			process.exit(1);
        // 		} else {
        // 			term.green("\nYour file is '%s'\n", input);
        // 			process.exit(0);
        // 		}
        // 	}
        // );
    }
    // "F#foo>js#test+(F#bar>ts#test)"
    static compile2AST(input) {
        const toASTNode = (type, name) => {
            return {
                type,
                name,
            };
        };
        let flattenArray = input
            .split(MOD.CHAIN)
            .map(i => i.split(MOD.NAME))
            // .map(i => i.split(MOD.BRO))
            .map(([type, name]) => toASTNode(type, name));
        const ASTData = flattenArray.reduceRight((sub, sup) => {
            if (!utils_1.T.isValidStr(sub.name) || !utils_1.T.isValidStr(sup.name)) {
                throw new Error("Please use '#' to enter the name of the file");
            }
            if (sup.type !== FILE_TYPE.FOLDER && utils_1.T.isValidStr(sub.name)) {
                throw new Error("Cannot have a file type as a parent node");
            }
            sup.children = [sub];
            return sup;
        });
        return ASTData;
    }
    static ask2GenFile(astNode) {
        const genStringTree = (astNode, level = 0, str = "") => {
            // { type: 'F', name: 'foo', children: [ { type: 'js', name: 'test' } ] }
            let fileTail = "";
            if (utils_1.T.isValidStr(astNode.type)) {
                if (astNode.type === FILE_TYPE.FOLDER) {
                    fileTail = "/";
                }
                else {
                    fileTail = `.${astNode.type}`;
                }
            }
            const filePre = String(new Array(level).fill("  ")).replace(",", "") + "|--";
            const fileName = filePre + astNode.name + fileTail + "\n";
            str += fileName;
            if (!utils_1.T.isValidArray(astNode.children))
                return str;
            if (utils_1.T.isValidArray(astNode.children)) {
                level++;
                astNode.children.map(i => {
                    str += genStringTree(i, level);
                });
            }
            return str;
        };
        const treeStr = genStringTree(astNode);
        (0, terminal_kit_1.terminal)("\nDo you want 2 gen files like this structure? ");
        terminal_kit_1.terminal.bold.underline(` at ${__dirname}\n`);
        terminal_kit_1.terminal.cyan(treeStr);
        terminal_kit_1.terminal.cyan("[Y|n]?");
        terminal_kit_1.terminal.yesOrNo({ yes: ["y", "ENTER"], no: ["n"] }, (error, result) => {
            if (result) {
                this.genFile(astNode);
                terminal_kit_1.terminal.green("\n gen success!!\n");
            }
            process.exit(0);
        });
    }
    static genFile(astNode, root = "./") {
        terminal_kit_1.terminal.spinner();
        const tail = astNode.type == FILE_TYPE.FOLDER
            ? "/"
            : astNode.type === ""
                ? ""
                : `.${astNode.type}`;
        const filePath = path_1.default.resolve(root, astNode.name + tail);
        if (!fs_1.default.existsSync(filePath)) {
            if (astNode.type === FILE_TYPE.FOLDER) {
                fs_1.default.mkdirSync(filePath);
            }
            else {
                fs_1.default.writeFileSync(filePath, "");
            }
            if (utils_1.T.isValidArray(astNode.children)) {
                astNode.children.forEach(subAstNode => {
                    const subFilePath = path_1.default.resolve(filePath + "/");
                    this.genFile(subAstNode, subFilePath);
                });
            }
        }
        else {
            terminal_kit_1.terminal.red("\nA file or folder with the same name already exists in the target directory\n");
        }
    }
    static ask2Exit() {
        (0, terminal_kit_1.terminal)("\nDo you want 2 leave? [Y|n]\n");
        // Exit on y and ENTER key
        // Ask again on n
        terminal_kit_1.terminal.yesOrNo({ yes: ["y", "ENTER"], no: ["n"] }, (error, result) => {
            if (result) {
                terminal_kit_1.terminal.green("Good bye!\n");
                process.exit();
            }
            else {
                this.buildFS();
            }
        });
    }
}
exports.FSManager = FSManager;
// FSManager.genFile({
// 	type: "F",
// 	name: "foo",
// 	children: [
// 		{
// 			type: "F",
// 			name: "test",
// 			children: [
// 				{ type: "js", name: "test" },
// 				{ type: "ts", name: "test1" },
// 				{ type: "ts", name: "test1" },
// 			],
// 		},
// 		{ type: "ts", name: "test" },
// 	],
// });
