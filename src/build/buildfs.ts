// import { terminal as term } from "terminal-kit";
// import fs from "fs";
var fs = require("fs");
var termkit = require("terminal-kit");
var term = termkit.terminal;

export class FSManager {
	static FileAST = {};
	static buildFS() {
		term.magenta("Enter file system by emmet:");
		term.inputField((error, input) => {
			if (input === "") {
				term.red("\nempty string");
				this.ask2Exit();
			}
			this.compile2AST(input);
			this.showFileTree();

			// compiler => { type: "folder", children: [{...}] }
			// 生成树结构 & 询问是否生成
			// Y 生成  N: 直接退出
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
	static compile2AST(input: string): object {
		input = "F#foojs.test";
		const flattenArray = input.split(">");
		console.log(flattenArray);

		return {
			type: "folder",
			children: [
				{
					type: "file",
					name: "xxx.js",
				},
				{
					type: "folder",
					name: "yyy.ts",
				},
			],
		};
	}
	static showFileTree() {
		return new Promise((Y, N) => {
			term("\nDo you want 2 have fun 2 test re? [Y|n]\n");
			term.yesOrNo();
		});
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

FSManager.compile2AST("");
