// import { terminal as term } from "terminal-kit";
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
	static buildFS() {
		term.magenta("Enter file system by emmet:");
		term.inputField((error, input) => {
			if (input === "") {
				term.red("\nempty string");
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
	static compile2AST(input: string) {
		const toASTNode = (type: string, name: string): ASTNode => {
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
			if (!T.isValidStr(sub.name) || !T.isValidStr(sup.name)) {
				throw new Error("Please use '#' to enter the name of the file");
			}
			if (sup.type !== FILE_TYPE.FOLDER && T.isValidStr(sub.name)) {
				throw new Error("Cannot have a file type as a parent node");
			}

			sup.children = [sub];
			return sup;
		});
		return ASTData;
	}

	static ask2GenFile(astNode: ASTNode) {
		const genStringTree = (astNode: ASTNode, level = 0, str = ""): string => {
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
					str += genStringTree(i, level);
				});
			}
			return str;
		};
		const treeStr = genStringTree(astNode);
		term("\nDo you want 2 gen files like this structure? ");
		term.bold.underline(` at ${__dirname}\n`);
		term.cyan(treeStr);
		term.cyan("[Y|n]?");
		term.yesOrNo({ yes: ["y", "ENTER"], no: ["n"] }, (error, result) => {
			if (result) {
				this.genFile(astNode);
				term.clear();
				term.green("\n gen success!!\n");
			}
			process.exit(0);
		});
	}

	static genFile(astNode: ASTNode, root = "./") {
		term.spinner();
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
			term.red(
				"\nA file or folder with the same name already exists in the target directory\n"
			);
		}
	}

	static ask2Exit() {
		term("\nDo you want 2 leave? [Y|n]\n");

		// Exit on y and ENTER key
		// Ask again on n
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
