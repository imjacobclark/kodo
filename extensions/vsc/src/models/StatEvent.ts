export default class StatEvent {
    epoch:  number;
    elapsed: number;
    workspace: string;
    identifier: string;
    language: string;
    type: string = "ide";
    application: string = "vsc";

    constructor(epoch: number, elapsed: number, workspace: string, identifier: string, language: string) {
        this.epoch = epoch;
        this.elapsed = elapsed;
        this.workspace = workspace;
        this.identifier = identifier;
        this.language = language;
    }
}
