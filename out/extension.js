"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const vscode = require("vscode");
const node_fetch_1 = require("node-fetch");
function activate(context) {
    const editor = vscode.window.activeTextEditor;
    const eventAction = () => {
        if (editor) {
            const stat = new Buffer(JSON.stringify({
                time: (new Date).getTime(),
                projectName: getProjectName(editor.document.fileName),
                fileName: editor.document.fileName.split("/").slice(-1)[0],
                client: 'imjacobclark'
            })).toString('base64');
            node_fetch_1.default(`https://roqsgb2ddh.execute-api.eu-west-1.amazonaws.com/v1/send?MessageBody=${stat}`)
                .then(res => res.json()) // expecting a json response
                .then(json => console.log(json))
                .catch(err => console.log(err));
        }
    };
    [vscode.window.onDidChangeTextEditorSelection, vscode.window.onDidChangeActiveTextEditor, vscode.workspace.onDidSaveTextDocument]
        .map(subscription => subscription(eventAction));
}
exports.activate = activate;
function getProjectName(file) {
    let uri = vscode.Uri.file(file);
    let workspaceFolder = vscode.workspace.getWorkspaceFolder(uri);
    if (vscode.workspace && workspaceFolder) {
        try {
            return workspaceFolder.name;
        }
        catch (e) { }
    }
    return 'unknown';
}
function deactivate() { }
exports.deactivate = deactivate;
//# sourceMappingURL=extension.js.map