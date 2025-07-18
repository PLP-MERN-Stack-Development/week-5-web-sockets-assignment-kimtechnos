class Message {
  constructor({ user, text, room, timestamp }) {
    this.user = user;
    this.text = text;
    this.room = room;
    this.timestamp = timestamp || new Date().toISOString();
  }
}

module.exports = Message; 