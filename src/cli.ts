#!/usr/bin/env node
import { Console, T } from "@car_han/utils";
import { program } from "commander";
import pkgInfo from "../package.json";
import { terminal as term } from "terminal-kit";
import { build } from "./build";

type t_cli_args = {
	debug?: boolean;
};
class CLI {
	static options: t_cli_args;
	static program: any;

	get program() {
		return this.program;
	}
	static init() {
		this.program = program;

		this.cmdRegiste();
		this.subCmdRegiste();
		this.cmdParse();
		this.handleInputOption();
	}
	static cmdRegiste() {
		this.program
			.name("thx-cli")
			.description(pkgInfo.description)
			.version(pkgInfo.version);

		// this.program
		// .option("-d, --debug", "show input info")
		// .option("-i, --input <value>", "input val", "default");

		this.program.addHelpText(
			"beforeAll",
			`😊😊😊😊😊😊😊😊😊😊😊😊😊 test 😊😊😊😊😊😊😊😊😊😊😊😊😊`
		);
		this.program.addHelpText(
			"afterAll",
			`😊😊😊😊😊😊😊😊😊😊😊😊😊 test 😊😊😊😊😊😊😊😊😊😊😊😊😊`
		);
	}
	static subCmdRegiste() {
		this.program
			.command("build")
			.description("build fs and so on.")
			.option("-t, --test", "test cmd desc")
			.action(params => {
				build();
			});
	}
	static cmdParse() {
		this.program.parse();
		this.options = this.program.opts();
	}
	static handleInputOption() {
		if (T.isValidObj(this.options)) {
			if (this.options.debug) {
				console.log(this.options);
			}
		}
	}
}

CLI.init();
