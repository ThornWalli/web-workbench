import User from './User';

export default class MoonCity {
  currentUser;
  users = [];

  currentRound = 0;
  currentDate = '01-01-2038';

  started = false;

  start (names) {
    this.started = true;
    this.users = names.map(name => new User(name));
    this.currentUser = this.users[0];
    this.currentRound = 1;
  }
}
