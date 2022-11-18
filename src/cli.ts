#!/usr/bin/env node
import { Console, T } from "@car_han/utils";
import { program } from "commander";
import pkgInfo from "../package.json";
import { terminal as term } from "terminal-kit";
import { build } from "./build";
import { FSManager } from "./build/buildfs";

type t_cli_args = {
	debug?: boolean;
};
class CLI {
	static options: t_cli_args;
	static program: any;

	get program() {
		return this.program;
	}
	static async init() {
		this.program = program;
		this.program
			.name("thx-cli")
			.description(pkgInfo.description)
			.version(pkgInfo.version);

		this.cmdRegiste();
		this.subCmdRegiste();
		this.cmdParse();
		this.handleInputOption();
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
				if (T.isValidStr(params.fs)) {
					const astData = FSManager.compile2AST(params.fs);
					FSManager.ask2GenFile(astData);
				} else {
					build();
				}
			});
	}
	static cmdParse() {
		try {
			this.program.parse();
			this.options = this.program.opts();
		} catch (error) {
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
