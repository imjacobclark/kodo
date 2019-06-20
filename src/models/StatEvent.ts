export default class StatEvent {
    elapsed: number;
    project: string;
    file: string;
    language: string;

    constructor(elapsed: number, project: string, file: string, language: string) {
        this.elapsed = elapsed;
        this.project = project;
        this.file = file;
        this.language = language;
    }
}
