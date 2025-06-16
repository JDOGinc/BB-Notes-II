export class Document {

  constructor(id, title, content, creationDate, modificationDate, editorState, isCurrent, isSaved = true) {
    this.id = id;
    this.title = title;
    this.content = content;
    this.creationDate = creationDate;
    this.modificationDate = modificationDate;
    this.editorState = editorState;
    this.isCurrent = isCurrent;
    this.isSaved = isSaved;
  }
}