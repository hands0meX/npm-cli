import { terminal as term } from "terminal-kit";
import { FSManager } from "./buildfs";
export function build() {
	term.cyan("Choose.\n");
	const options = ["file system", "..."];
	term.singleColumnMenu(options, (error, response) => {
		term("\n").green("selected: %s\n", response.selectedText);
		switch (response.selectedText) {
			case "file system":
				FSManager.buildFS();
				break;
			default:
				term("\n").green("🌟Stay tuned.\n");
				process.exit();
		}
	});
}
