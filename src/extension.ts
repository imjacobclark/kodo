import * as vscode from 'vscode';
import fetch from 'node-fetch';

const TEN_SECONDS = 10000;

class StatEvent {
	time: number;
	project: string;
	file: string;
	language: string;

	constructor(project: string, file: string, language: string){
		this.time = (new Date).getTime();
		this.project = project;
		this.file = file;
		this.language = language;
	}
}

class Event {
	userId: string;
	events: Array<StatEvent>;

	constructor(userId: string, events: Array<StatEvent>){
		this.userId = userId;
		this.events = events;
	}
}

export function activate(context: vscode.ExtensionContext) {
	let lastStatEvent = 0;
	let statEvents: Array<StatEvent> = [];
	
	const eventAction = () => {
		const editor = vscode.window.activeTextEditor;

		let timeElaspsedSinceLastEventInMs = (new Date).getTime() - lastStatEvent;		

		if (editor) {
			statEvents.push(new StatEvent(
				getProjectName(editor.document.fileName),
				editor.document.fileName.split("/").slice(-1)[0],
				editor.document.languageId
			));
		}
		
		if (timeElaspsedSinceLastEventInMs <= TEN_SECONDS && timeElaspsedSinceLastEventInMs !== 0) return;

		const event = new Event("imjacobclark", statEvents);
		const statPayload = new Buffer(JSON.stringify({event})).toString('base64');

		fetch(`https://uch3soje7l.execute-api.eu-west-1.amazonaws.com/v1/v1/send?MessageBody=${statPayload}`)
			.then(data => {
				lastStatEvent = (new Date).getTime();
				statEvents = [];
			})
			.catch(err => console.log(err));
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
