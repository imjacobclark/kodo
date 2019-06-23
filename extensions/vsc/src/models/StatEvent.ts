export default class StatEvent {
    epoch:  number;
    elapsed: number;
    project: string;
    file: string;
    language: string;

    constructor(epoch: number, elapsed: number, project: string, file: string, language: string) {
        this.epoch = epoch;
        this.elapsed = elapsed;
        this.project = project;
        this.file = file;
        this.language = language;
    }
}
