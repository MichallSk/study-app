export default class Note {
    constructor(data = {}) {
        this.id = data.id || crypto.randomUUID();
        this.name = data.name || '';
        this.content = data.content || '';
    }
}