// term("Hello World!\n");
// term.red("red\n");
// term.bold("bold\n");
// term.bold.underline.red("mixed\n");

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

		this.program
			.option("-d, --debug", "show input info")
			.option("-i, --input <value>", "input val", "default");

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
			.command("build <params>")
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
