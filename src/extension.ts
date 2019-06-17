import * as vscode from 'vscode';
import fetch from 'node-fetch';

class StatEvent {
	userId: string;
	time: number;
	project: string;
	file: string;

	constructor(userId: string, editor: vscode.TextEditor){
		this.userId = userId;
		this.time = (new Date).getTime();
		this.project = getProjectName(editor.document.fileName);
		this.file = editor.document.fileName.split("/").slice(-1)[0];
	}
}

export function activate(context: vscode.ExtensionContext) {
	const editor = vscode.window.activeTextEditor;

	const eventAction = () => {
		if (editor) {
			const statEvent = new StatEvent('imjacobclark', editor);
			const statPayload = new Buffer(JSON.stringify({statEvent})).toString('base64');

			fetch(`https://uch3soje7l.execute-api.eu-west-1.amazonaws.com/v1/v1/send?MessageBody=${statPayload}`)
				.catch(err => console.log(err));
		}
	}

	[
		vscode.window.onDidChangeTextEditorSelection, 
		vscode.window.onDidChangeActiveTextEditor, 
		vscode.workspace.onDidSaveTextDocument
	].map(subscription => subscription(eventAction));
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
