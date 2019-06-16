import * as vscode from 'vscode';
import fetch from 'node-fetch';

export function activate(context: vscode.ExtensionContext) {
	const editor = vscode.window.activeTextEditor;
	const eventAction = () => {
		if (editor) {
			const stat = new Buffer(JSON.stringify({
				time: (new Date).getTime(),
				projectName: getProjectName(editor.document.fileName),
				fileName: editor.document.fileName.split("/").slice(-1)[0],
				client: 'imjacobclark'
			})).toString('base64');

			fetch(`https://roqsgb2ddh.execute-api.eu-west-1.amazonaws.com/v1/send?MessageBody=${stat}`)
				.then(res => res.json()) // expecting a json response
				.then(json => console.log(json))
				.catch(err => console.log(err));
		}
	}

	[vscode.window.onDidChangeTextEditorSelection, vscode.window.onDidChangeActiveTextEditor, vscode.workspace.onDidSaveTextDocument]
		.map(subscription => subscription(eventAction));
}

function getProjectName(file: string): string {
	let uri = vscode.Uri.file(file);
	let workspaceFolder = vscode.workspace.getWorkspaceFolder(uri);

	if (vscode.workspace && workspaceFolder) {
		try {
			return workspaceFolder.name;
		} catch (e) { }
	}

	return 'unknown';
}

export function deactivate() { }
