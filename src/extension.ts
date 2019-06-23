import * as vscode from 'vscode';
import fetch from 'node-fetch';

import StatEvent from './models/StatEvent';
import Heartbeat from './models/Heartbeat';
import Odo from './models/Odo';

import EventBuffer from './events/EventBuffer';

const ONE_MIN = 10000;

export function activate(context: vscode.ExtensionContext) {
	let trackedLocations: { 
		[index: string]: { 
			odo: Odo, 
			fileName: string, 
			project: string, 
			languageId: string 
		} 
	} = {};
	let eventBuffer = new EventBuffer();

	let timeSinceLastHeartbeat = 0;
	let shouldAttemptToSendFurtherHeartbeats = true;

	const eventAction = () => {
		const editor = vscode.window.activeTextEditor;

		if (editor) {
			const epoch = (new Date).getTime();
			const timeElaspsedSinceLastEventInMs = epoch - timeSinceLastHeartbeat;
			
			// TODO: Need to handle the point where an event is being sent and the timeSinceLastHeartbeat hasn't been reset so we don't loose events.
			if (timeElaspsedSinceLastEventInMs <= ONE_MIN){
				const currentEventNamespace: string = getProjectName(editor.document.fileName) + ":" + editor.document.fileName.split("/").slice(-1)[0];
				let location = trackedLocations[currentEventNamespace];

				if (location){
					location.odo.fire(epoch);
				} else {
					trackedLocations[currentEventNamespace] = {
						odo: new Odo(),
						fileName: editor.document.fileName.split("/").slice(-1)[0],
						project: getProjectName(editor.document.fileName),
						languageId: editor.document.languageId
					}
					location = trackedLocations[currentEventNamespace];
					location.odo.fire(epoch);
				}
			}else{
				console.log("Timed out...");
			}

			if (!shouldAttemptToSendFurtherHeartbeats) return;
			if (timeElaspsedSinceLastEventInMs <= ONE_MIN && timeElaspsedSinceLastEventInMs) return;

			shouldAttemptToSendFurtherHeartbeats = false;
			
			Object.keys(trackedLocations).forEach(key => eventBuffer.add(new StatEvent(
				epoch,
				trackedLocations[key].odo.getElapsedTime(),
				trackedLocations[key].project,
				trackedLocations[key].fileName,
				trackedLocations[key].languageId
			)));

		
			console.log(eventBuffer);

			const heartbeat = new Heartbeat("imjacobclark", eventBuffer.get()).toBase64();
		
			fetch(`https://cjudn1rrx9.execute-api.eu-west-1.amazonaws.com/v1/v1/send?MessageBody=${heartbeat}`).then(event => {
				console.log("Sent heartbeat");
				timeSinceLastHeartbeat = epoch;
				trackedLocations = {};
				eventBuffer = new EventBuffer();
				shouldAttemptToSendFurtherHeartbeats = true;
			}).catch(err => {
				console.error(err);
				shouldAttemptToSendFurtherHeartbeats = true;
			});
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
