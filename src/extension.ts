import * as vscode from 'vscode';
import fetch from 'node-fetch';
import { runInContext } from 'vm';

const ONE_MIN = 60000;

class StatEvent {
	elapsed: number;
	project: string;
	file: string;
	language: string;

	constructor(elapsed: number, project: string, file: string, language: string){
		this.elapsed = elapsed;
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
	let timeSinceLastHeartbeat = 0;
	let eventBuffer: Array<StatEvent> = [];
	let shouldAttemptToSendFurtherHeartbeats = true;

	let firstStatEvent = 0;
	let lastStatEvent = 0;

	let dirty = false;

	const eventAction = () => {
		const editor = vscode.window.activeTextEditor;
		const eventTime = (new Date).getTime();

		let timeElaspsedSinceLastEventInMs = eventTime - timeSinceLastHeartbeat;
		
		// TODO: Account for inactivity 

		if (firstStatEvent === 0) {
			firstStatEvent = eventTime;
			lastStatEvent = eventTime;
		} else {
			lastStatEvent = eventTime;
		}

		const currentElapsedTime = lastStatEvent - firstStatEvent

		if (currentElapsedTime === 0 || shouldAttemptToSendFurtherHeartbeats === false) {
			console.log("vs-odo: Not firing stats event, nothing to send or already sending an event. Queued events: " + eventBuffer.length)
			return;
		}

		if (timeElaspsedSinceLastEventInMs <= ONE_MIN && timeElaspsedSinceLastEventInMs !== 0) {
			console.log("vs-odo: Not firing stats event, elapsed time since last event: " + timeElaspsedSinceLastEventInMs + ". Queued events: " + eventBuffer.length)
			return;
		}

		if(!dirty) {
			dirty = true;
			console.log("vs-odo: First run, not sending an event.");
			return;
		}

		if (editor) {
			eventBuffer.push(new StatEvent(
				currentElapsedTime,
				getProjectName(editor.document.fileName),
				editor.document.fileName.split("/").slice(-1)[0],
				editor.document.languageId
			));
		}

		shouldAttemptToSendFurtherHeartbeats = false;

		const event = new Event("imjacobclark", eventBuffer);
		const statPayload = new Buffer(JSON.stringify({event})).toString('base64');

		fetch(`https://cjudn1rrx9.execute-api.eu-west-1.amazonaws.com/v1/v1/send?MessageBody=${statPayload}`)
			.then(event => {
				console.log("vs-odo: Event sent, unlocking future stat event fires. Queued events: " + eventBuffer.length)
				timeSinceLastHeartbeat = eventTime;
				eventBuffer = [];
				firstStatEvent = 0;
				lastStatEvent = 0;
				shouldAttemptToSendFurtherHeartbeats = true;
			})
			.catch(err => {
				console.error("vs-odo: Event failed to send, merging buffer and pending payload to try later.  Queued events: " + eventBuffer.length, err);
				shouldAttemptToSendFurtherHeartbeats = true;
			});
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
