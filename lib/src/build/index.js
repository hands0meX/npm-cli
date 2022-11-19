"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.build = void 0;
const terminal_kit_1 = require("terminal-kit");
const buildfs_1 = require("./buildfs");
function build() {
    terminal_kit_1.terminal.cyan("Choose.\n");
    const options = ["file system", "..."];
    terminal_kit_1.terminal.singleColumnMenu(options, (error, response) => {
        (0, terminal_kit_1.terminal)("\n").green("selected: %s\n", response.selectedText);
        switch (response.selectedText) {
            case "file system":
                buildfs_1.FSManager.buildFS();
                break;
            default:
                (0, terminal_kit_1.terminal)("\n").green("🌟Stay tuned.\n");
                process.exit();
        }
    });
}
exports.build = build;
