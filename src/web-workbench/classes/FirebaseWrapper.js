import firebaseService from '../services/firebase';
import errorMessage from '../services/errorMessage';

const apps = new Map();

export default class FirebaseWrapper {
  #app;
  #firebase;

  get name () {
    return this.#app.name;
  }

  async connect (name, { apiKey, url }) {
    this.#firebase = (await firebaseService.get());

    // if (apps.has(name)) {
    //   throw errorMessage.get('FirebaseWrapper_hasApp', name);
    // }

    if (!this.#app) {
      const firebase = await firebaseService.get();
      const app = firebase.initializeApp({
        apiKey,
        databaseURL: url
      }, name);
      apps.set(app.name, app);
      this.#app = app;
    } else if (apps.has(name)) {
      this.#app = apps.get(name);
    }
    return this.#app;
  }

  async disconnect () {
    if (!this.#app) {
      throw errorMessage.get('FirebaseWrapper_noApp');
    }
    checkConnection(this);

    await this.logout();

    await this.#app.delete();
    this.#app = null;
  }

  get app () {
    return this.#app;
  }

  get firebase () {
    return this.#firebase;
  }

  get locked () {
    return !!this.#app && !this.isLogged();
  }

  isLogged () {
    return !!this.#app && !!this.#app.auth().currentUser;
  }

  login (email, password) {
    checkConnection(this);
    return Promise.resolve(this.#firebase.auth(this.#app).signInWithEmailAndPassword(email, password));
  }

  logout () {
    if (this.#app) {
      const test = this.#firebase.auth(this.#app);
      return Promise.resolve(test.signOut());
    } else {
      throw errorMessage.get('FirebaseWrapper_notConnected');
    }
  }

  remove (name) {
    checkConnection(this);
    return this.#app
      .database()
      .ref(name)
      .remove();
  }

  get (name) {
    checkConnection(this);
    return this.#app
      .database()
      .ref(name)
      .once('value')
      .then((snapshot) => {
        return snapshot.val();
      });
  }

  set (name, data) {
    checkConnection(this);
    return this.#app
      .database()
      .ref(name)
      .set(data)
      .then(() => {
        return data;
      });
  }
}

function checkConnection (scope) {
  if (!scope.app) {
    throw errorMessage.get('FirebaseWrapper_notConnected');
  }
}

errorMessage.add([
  [
    'FirebaseWrapper_notConnected', [
      'Not connected', 'Not connected'
    ]
  ],
  [
    'FirebaseWrapper_noApp', [
      'No app available', 'No app available'
    ]
  ],
  [
    'FirebaseWrapper_hasApp', [
      'App already available', 'App "%1" already available'
    ]
  ]
]);
