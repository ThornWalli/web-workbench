import firebaseService from '../services/firebase';
import errorMessage from '../services/errorMessage';

const apps = new Map();

export default class FirebaseWrapper {
  services;
  app;
  firebase;

  get name () {
    return this.app.name;
  }

  async connect (name, { apiKey, url }) {
    this.services = (await firebaseService.get());
    this.firebase = this.services.app;
    // if (apps.has(name)) {
    //   throw errorMessage.get('FirebaseWrapper_hasApp', name);
    // }

    if (!this.app) {
      const app = this.services.app.initializeApp({
        apiKey,
        databaseURL: url
      }, name);
      apps.set(app.name, app);
      this.app = app;
    } else if (apps.has(name)) {
      this.app = apps.get(name);
    }
    return this.app;
  }

  async disconnect () {
    if (!this.app) {
      throw errorMessage.get('FirebaseWrapper_noApp');
    }
    checkConnection(this);

    await this.logout();

    await this.services.app.deleteApp(this.app);

    this.app = null;
  }

  get locked () {
    return !!this.app && !this.isLogged();
  }

  get currentUser () {
    const { getAuth } = this.services.auth;
    const auth = getAuth(this.app);
    return auth.currentUser;
  }

  isLogged () {
    return !!this.app && !!this.currentUser;
  }

  login (email, password) {
    const { getAuth, signInWithEmailAndPassword } = this.services.auth;
    const auth = getAuth(this.app);
    checkConnection(this);
    return signInWithEmailAndPassword(auth, email, password);
  }

  logout () {
    if (this.app) {
      const { getAuth, signOut } = this.services.auth;
      const auth = getAuth(this.app);
      return signOut(auth);
    } else {
      throw errorMessage.get('FirebaseWrapper_notConnected');
    }
  }

  remove (name) {
    checkConnection(this);
    const { remove, ref, getDatabase } = this.services.database;
    const db = getDatabase(this.app);
    const currentRef = ref(db, name);
    return remove(currentRef);
  }

  get (name) {
    checkConnection(this);
    const { ref, onValue, getDatabase } = this.services.database;
    const db = getDatabase(this.app);
    const currentRef = ref(db, name);
    return new Promise((resolve) => {
      onValue(currentRef, snapshot => resolve(snapshot.val()));
    });
  }

  async set (name, data) {
    checkConnection(this);
    const { ref, set, getDatabase } = this.services.database;
    const db = getDatabase(this.app);
    const currentRef = ref(db, name);
    await set(currentRef, data);
    return data;
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
