import { Console, T } from "@car_han/utils";

import fs from "fs";
import path from "path";
import { terminal as term } from "terminal-kit";

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
type ASTNode = {
	name: string;
	type?: string;
	children?: ASTNode[];
};

export class FSManager {
	static root: string = "./";
	static buildFS() {
		term.magenta("Enter file system by emmet:");
		term.inputField((error, input: string) => {
			if (input === "") {
				term.red("\nempty string");
				this.ask2Exit();
			} else {
				this.gen(input);
			}
		});
	}

	static gen(input: string) {
		input = this.setRootPath(input);
		const astData = this.compile2ASTByString(input);
		this.ask2GenFile(astData);
	}

	static setRootPath(input: string) {
		const reg = /\sin\s/g;
		if (reg.test(input)) {
			[input, this.root] = input.split(" in ").map(i => i.trim());
		}
		return input;
	}

	// static setRootAt() {
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

	// "F#foo>ts#test+(F#bar>ts#test) in ./"
	static compile2ASTByString(input: string) {
		const toASTNode = (type: string, name: string): ASTNode => {
			return {
				type,
				name,
			};
		};
		const reg_sub_folder = /\(.+?\)/g;
		const subInputArr = input.match(reg_sub_folder);
		if (T.isValidArray(subInputArr)) {
			subInputArr.forEach(subInput => {
				input = input.replace(subInput, "[thxFlag]");
			});
		}
		const flattenArray = input.split(MOD.CHAIN).map(stage => {
			return stage.split(MOD.BRO);
		});
		if (!T.isValidArray(flattenArray)) {
			throw new Error("empty input!!!");
		}
		const [parentInput, childrenInput] = flattenArray;
		if (!T.isValidArray(parentInput) || parentInput.length > 1) {
			throw new Error("Please check if there is only one parent node");
		}
		const isSubInput = test => {
			return test === "[thxFlag]";
		};
		const isValidGenFile = test => {
			return test.includes("#");
		};
		const [type, name] = parentInput[0].split(MOD.NAME);

		if (type !== "F" && T.isValidArray(childrenInput)) {
			throw new Error(
				"parent node should be a 'F' type if you have child node."
			);
		}
		let astNode = toASTNode(type, name);

		if (T.isValidArray(childrenInput)) {
			const children = childrenInput
				.filter(childStr => !isSubInput(childStr))
				.map(childStr => {
					if (!isValidGenFile(childStr)) {
						throw new Error(
							"Please check whether the child node format is written correctly"
						);
					}
					const [type, name] = childStr.split(MOD.NAME);
					return toASTNode(type, name);
				});
			if (T.isValidArray(subInputArr)) {
				subInputArr.forEach(subInput => {
					subInput = subInput.slice(1, subInput.length - 1);
					children.push(this.compile2ASTByString(subInput));
				});
			}
			astNode.children = children;
		}
		return astNode;
	}

	static compile2ASTByDir(targetPath: string): string {
		let res = this.compile2ASTByDirectory(targetPath);
		return res.slice(1, res.length - 1);
	}

	/**
	 * 将目录转成字符串写法
	 */
	static compile2ASTByDirectory(targetPath: string): string {
		const parse2Emmet = (path, isDir = true) => {
			const slices = path.split("/");
			let fileName = slices[slices.length - 1];
			if (isDir) {
				fileName = `F${MOD.NAME}${fileName}`;
			} else {
				const lastIdx = fileName.lastIndexOf(".");
				const name = fileName.slice(0, lastIdx);
				const tail = fileName.slice(lastIdx + 1);
				fileName = `${tail ? tail : ""}${MOD.NAME}${name}`;
			}
			return fileName;
		};
		if (fs.existsSync(targetPath)) {
			let fsStat = fs.statSync(targetPath);
			if (fsStat.isFile()) {
				return parse2Emmet(targetPath, false);
			} else if (fsStat.isDirectory()) {
				let blockStr = "";
				const res = fs.readdirSync(targetPath);
				if (T.isValidArray(res)) {
					res.forEach(item => {
						const dir = targetPath + "/";
						blockStr += "+" + this.compile2ASTByDirectory(dir + item);
					});
					blockStr = blockStr.slice(1);
					return `(${parse2Emmet(targetPath)}>${blockStr})`;
				} else {
					return parse2Emmet(targetPath);
				}
			}
		} else {
			return "There is no such file in this directory";
		}
	}

	static genStringTree(astNode: ASTNode, level = 0, str = ""): string {
		// { type: 'F', name: 'foo', children: [ { type: 'js', name: 'test' } ] }
		let fileTail = "";
		if (T.isValidStr(astNode.type)) {
			if (astNode.type === FILE_TYPE.FOLDER) {
				fileTail = "/";
			} else {
				fileTail = `.${astNode.type}`;
			}
		}
		const filePre =
			String(new Array(level).fill("  ")).replace(",", "") + "|--";
		const fileName = filePre + astNode.name + fileTail + "\n";
		str += fileName;
		if (!T.isValidArray(astNode.children)) return str;
		if (T.isValidArray(astNode.children)) {
			level++;
			astNode.children.map(i => {
				str += this.genStringTree(i, level);
			});
		}

		return str;
	}

	static ask2GenFile(astNode: ASTNode) {
		const treeStr = this.genStringTree(astNode);
		term("\nDo you want 2 gen files like this structure? ");
		term.bold.underline(` at ${this.root}\n`);
		term.cyan(treeStr);
		term.cyan("[Y|n]?");
		term.yesOrNo({ yes: ["y", "ENTER"], no: ["n"] }, (error, result) => {
			if (result) {
				this.genFile(astNode);
				term.clear();
				term.green("Generate success!!✨\n");
			} else {
				term.clear();
			}
			process.exit(0);
		});
	}

	static genFile(
		astNode: ASTNode,
		root = T.isValidStr(this.root) ? this.root : "./"
	) {
		const tail =
			astNode.type == FILE_TYPE.FOLDER
				? "/"
				: astNode.type === ""
				? ""
				: `.${astNode.type}`;
		const filePath = path.resolve(root, astNode.name + tail);

		if (!fs.existsSync(filePath)) {
			if (astNode.type === FILE_TYPE.FOLDER) {
				fs.mkdirSync(filePath);
			} else {
				fs.writeFileSync(filePath, "");
			}
			if (T.isValidArray(astNode.children)) {
				astNode.children.forEach(subAstNode => {
					const subFilePath = path.resolve(filePath + "/");
					this.genFile(subAstNode, subFilePath);
				});
			}
		} else {
			term.red.bold(
				"\nA file or folder with the same name already exists in the target directory\n"
			);
			process.exit(1);
		}
	}

	static ask2Exit() {
		term("\nDo you want 2 leave? [Y|n]\n");

		// Exit on y and ENTER key
		term.yesOrNo({ yes: ["y", "ENTER"], no: ["n"] }, (error, result) => {
			if (result) {
				term.green("Good bye!\n");
				process.exit();
			} else {
				this.buildFS();
			}
		});
	}
}

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
