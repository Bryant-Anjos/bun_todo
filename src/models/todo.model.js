export default class Todo {
  constructor(id, text, done) {
    this.id = id
    this.text = text
    this.done = done === 1 ? true : false
  }
}
