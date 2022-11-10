import { terminal as term } from "terminal-kit";
term("Hello World!\n");
term.red("red\n");
term.bold("bold\n");
term.bold.underline.red("mixed\n");

term.green("My name is %s, I'm %d.\n", "hsx", 27);
term("The terminal size is %d * %d\n", term.width, term.height);

// term.magenta("Enter your name: ");
// term.inputField(function (error, input) {
// 	term.green("\nYour name is '%s'\n", input);
// 	process.exit(0);
// });

// term.moveTo(1, 1);
// term.moveTo(1, 1, "Upper-left corner.\n");
// term.moveTo.cyan(1, 1, "My name is %s, I'm %d.\n", "Jack", 32);
term.spinner("impulse");
// term.spinner("lineSpinner");

///////
// const { program } = require("commander");

// program.option("--first").option("-s, --separator <char>").option("--123");

// program.parse();

// const options = program.opts();
// console.log(options, "options", program.args[0]);
// console.log(program, "program");
// const limit = options.first ? 1 : undefined;
// console.log(program.args[0].split(options.separator, limit));

// const { Command } = require("commander");
// const program = new Command();

// program
// 	.name("string-util")
// 	.description("CLI to some JavaScript string utilities")
// 	.version("0.8.0");

// program
// 	.command("split")
// 	.description("Split a string into substrings and display as an array")
// 	.argument("<string>", "string to split")
// 	.option("--first", "display just the first substring")
// 	.option("-s, --separator <char>", "separator character", ",")
// 	.action((str, options) => {
// 		const limit = options.first ? 1 : undefined;
// 		console.log(str.split(options.separator, limit));
// 	});

// program.parse();
