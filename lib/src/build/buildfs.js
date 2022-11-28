"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.FSManager = void 0;
const utils_1 = require("@car_han/utils");
const fs_1 = __importDefault(require("fs"));
const path_1 = __importDefault(require("path"));
const terminal_kit_1 = require("terminal-kit");
let pkgInfo = null;
try {
    pkgInfo = fs_1.default.readFileSync(path_1.default.resolve("./", "thx.json"), "utf-8");
}
catch (error) {
    terminal_kit_1.terminal.yellow("you can set 'thx.json' in the root path.\n");
}
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
    static root = "./";
    static buildFS() {
        terminal_kit_1.terminal.magenta("Enter file system by emmet:");
        terminal_kit_1.terminal.inputField((error, input) => {
            if (input === "") {
                terminal_kit_1.terminal.red("\nempty string");
                this.ask2Exit();
            }
            else {
                this.gen(input);
            }
        });
    }
    static gen(input) {
        input = this.setRootPath(input);
        const astData = this.compile2ASTByString(input);
        this.ask2GenFile(astData);
    }
    static setRootPath(input) {
        const reg = /\sin\s/g;
        if (reg.test(input)) {
            [input, this.root] = input.split(" in ").map(i => i.trim());
        }
        return input;
    }
    // static autoCompleterFn() {
    //     var autoCompleter = function autoCompleter(inputString, callback) {
    //         fs.readdir(__dirname, function (error, files) {
    //             callback(
    //                 undefined,
    //                 term.autoComplete(files, inputString, true)
    //             );
    //         });
    //     };
    //     term("Choose a dir as the root: ");
    //     term.inputField(
    //         { autoComplete: autoCompleter, autoCompleteMenu: true },
    //         function (error, input) {
    //             if (error) {
    //                 term.red.bold("\nAn error occurs: " + error + "\n");
    //                 process.exit(1);
    //             } else {
    //                 term.green("\nYour file is '%s'\n", input);
    //                 process.exit(0);
    //             }
    //         }
    //     );
    // }
    // F#hh.testa>(F#hhh>(F#aaa>c#dd+json#ee)+F#bbb+ts#hh+vue#p)+(F#test>json#hh)+json#w
    static compile2ASTByString(input) {
        const toASTNode = (type, name) => {
            return {
                type,
                name,
            };
        };
        let count = 0;
        let subInputArr = [];
        let n = input.length;
        for (let i = 0; i < n; ++i) {
            const char = input[i];
            if (char === "(") {
                if (count++ === 0)
                    subInputArr.push([i]);
            }
            else if (char === ")") {
                if (--count === 0)
                    subInputArr[subInputArr.length - 1].push(i);
            }
        }
        subInputArr = subInputArr.map(([s, e]) => input.substring(s, e + 1));
        subInputArr.forEach(i => {
            input = input.replace(i, "[thxFlag]");
        });
        const flattenArray = input.split(MOD.CHAIN).map(stage => {
            return stage.split(MOD.BRO);
        });
        if (!utils_1.T.isValidArray(flattenArray)) {
            throw new Error("empty input!!!");
        }
        const [parentInput, childrenInput] = flattenArray;
        if (!utils_1.T.isValidArray(parentInput) || parentInput.length > 1) {
            throw new Error("Please check if there is only one parent node");
        }
        const isSubInput = test => {
            return test === "[thxFlag]";
        };
        const isValidGenFile = test => {
            return test.includes("#");
        };
        const [type, name] = parentInput[0].split(MOD.NAME);
        if (type !== "F" && utils_1.T.isValidArray(childrenInput)) {
            throw new Error("parent node should be a 'F' type if you have child node.");
        }
        let astNode = toASTNode(type, name);
        if (utils_1.T.isValidArray(childrenInput)) {
            const children = childrenInput
                .filter(childStr => !isSubInput(childStr))
                .map(childStr => {
                if (!isValidGenFile(childStr)) {
                    throw new Error("Please check whether the child node format is written correctly");
                }
                const [type, name] = childStr.split(MOD.NAME);
                return toASTNode(type, name);
            });
            if (utils_1.T.isValidArray(subInputArr)) {
                subInputArr.forEach(subInput => {
                    subInput = subInput.slice(1, subInput.length - 1);
                    children.push(this.compile2ASTByString(subInput));
                });
            }
            astNode.children = children;
        }
        return astNode;
    }
    static parseTargerDir2Emmet(targetPath) {
        let res = this.handleParseTargerDir2Emmet(targetPath);
        return res.slice(1, res.length - 1);
    }
    /**
     * 将目录转成字符串写法
     */
    static handleParseTargerDir2Emmet(targetPath) {
        utils_1.Console.log(targetPath, utils_1.T.typeOf(pkgInfo));
        // if (T.is) {
        // 	if (T.isValidArray(pkgInfo?.exclude) && pkgInfo.exclude.includes(targetPath)) {
        // 		console.log(123);
        // 		return;
        // 	}
        // }
        const parse2Emmet = (path, isDir = true) => {
            const slices = path.split("/");
            let fileName = slices[slices.length - 1];
            if (isDir) {
                fileName = `F${MOD.NAME}${fileName}`;
            }
            else {
                const lastIdx = fileName.lastIndexOf(".");
                const name = fileName.slice(0, lastIdx);
                const tail = fileName.slice(lastIdx + 1);
                fileName = `${tail ? tail : ""}${MOD.NAME}${name}`;
            }
            return fileName;
        };
        if (fs_1.default.existsSync(targetPath)) {
            let fsStat = fs_1.default.statSync(targetPath);
            if (fsStat.isFile()) {
                return parse2Emmet(targetPath, false);
            }
            else if (fsStat.isDirectory()) {
                let blockStr = "";
                const res = fs_1.default.readdirSync(targetPath);
                if (utils_1.T.isValidArray(res)) {
                    res.forEach(item => {
                        const dir = targetPath + "/";
                        blockStr += "+" + this.handleParseTargerDir2Emmet(dir + item);
                    });
                    blockStr = blockStr.slice(1);
                    return `(${parse2Emmet(targetPath)}>${blockStr})`;
                }
                else {
                    return parse2Emmet(targetPath);
                }
            }
        }
        else {
            return "There is no such file in this directory";
        }
    }
    static genStringTree(astNode, level = 0, str = "") {
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
        const filePre = String(new Array(level).fill("  ")).replace(/,/g, "") + "|--";
        const fileName = filePre + astNode.name + fileTail + "\n";
        str += fileName;
        if (!utils_1.T.isValidArray(astNode.children))
            return str;
        if (utils_1.T.isValidArray(astNode.children)) {
            level++;
            astNode.children.map(i => {
                str += this.genStringTree(i, level);
            });
        }
        return str;
    }
    static ask2GenFile(astNode) {
        const treeStr = this.genStringTree(astNode);
        (0, terminal_kit_1.terminal)("\nDo you want 2 gen files like this structure? ");
        terminal_kit_1.terminal.bold.underline(` at ${this.root}\n`);
        terminal_kit_1.terminal.cyan(treeStr);
        terminal_kit_1.terminal.cyan("[Y|n]?");
        terminal_kit_1.terminal.yesOrNo({ yes: ["y", "ENTER"], no: ["n"] }, (error, result) => {
            if (result) {
                this.genFile(astNode);
                terminal_kit_1.terminal.clear();
                terminal_kit_1.terminal.green("Generate success!!✨\n");
            }
            else {
                terminal_kit_1.terminal.clear();
            }
            process.exit(0);
        });
    }
    static genFile(astNode, root = utils_1.T.isValidStr(this.root) ? this.root : "./") {
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
            terminal_kit_1.terminal.red.bold("\nA file or folder with the same name already exists in the target directory\n");
            process.exit(1);
        }
    }
    static ask2Exit() {
        (0, terminal_kit_1.terminal)("\nDo you want 2 leave? [Y|n]\n");
        // Exit on y and ENTER key
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
// FSManager.compile2AST("F#test>B#ccc");
// FSManager.compile2AST("F#foo>ts#test+(F#bar>ts#test)+(F#aaa>ts#test)");
