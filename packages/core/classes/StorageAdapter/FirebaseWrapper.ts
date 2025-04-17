import type { FirebaseApp } from 'firebase/app';
import firebaseService, { type FirebaseModules } from '../../services/firebase';
import errorMessage from '../../services/errorMessage';
import { StorageAdapter } from '.';

const apps = new Map();

// interface ConnectOptions {
//   apiKey: string;
//   url: string;
// }

export default class FirebaseWrapper extends StorageAdapter {
  modules?: FirebaseModules;

  /**
   * @deprecated
   */
  services = undefined;
  app?: FirebaseApp;

  get name() {
    return this.app?.name;
  }

  async connect(
    name: string,
    { apiKey, url }: { apiKey: string; url: string }
  ) {
    this.modules = await firebaseService.get();
    // if (apps.has(name)) {
    //   throw errorMessage.get('FirebaseWrapper_hasApp', name);
    // }

    if (!this.app) {
      const app = this.modules.app.initializeApp(
        {
          apiKey,
          databaseURL: url
        },
        name
      );
      apps.set(app.name, app);
      this.app = app;
    } else if (apps.has(name)) {
      this.app = apps.get(name);
    }
    return this.app;
  }

  async disconnect() {
    if (!this.app) {
      throw errorMessage.get('FirebaseWrapper_noApp');
    }
    checkConnection(this);

    await this.logout();

    await this.modules?.app.deleteApp(this.app);

    this.app = undefined;
  }

  get locked() {
    return !!this.app && !this.isLogged();
  }

  get currentUser() {
    if (this.modules?.auth) {
      const { getAuth } = this.modules.auth;
      const auth = getAuth(this.app);
      return auth.currentUser;
    }
  }

  override isLogged() {
    return !!this.app && !!this.currentUser;
  }

  login(email: string, password: string) {
    if (this.modules?.auth) {
      const { getAuth, signInWithEmailAndPassword } = this.modules.auth;
      const auth = getAuth(this.app);
      checkConnection(this);
      return signInWithEmailAndPassword(auth, email, password);
    }
  }

  logout() {
    if (this.app && this.modules?.auth) {
      const { getAuth, signOut } = this.modules.auth;
      const auth = getAuth(this.app);
      return signOut(auth);
    } else {
      throw errorMessage.get('FirebaseWrapper_notConnected');
    }
  }

  remove(name: string) {
    checkConnection(this);
    if (this.modules?.database) {
      const { remove, ref, getDatabase } = this.modules.database;
      const db = getDatabase(this.app);
      const currentRef = ref(db, name);
      return remove(currentRef);
    }
  }

  get(name: string) {
    checkConnection(this);
    if (this.modules?.database) {
      const { ref, onValue, getDatabase } = this.modules.database;
      const db = getDatabase(this.app);
      const currentRef = ref(db, name);
      return new Promise(resolve => {
        onValue(currentRef, snapshot => resolve(snapshot.val()));
      });
    }
  }

  async set(name: string, data: unknown) {
    checkConnection(this);
    if (this.modules?.database) {
      const { ref, set, getDatabase } = this.modules.database;
      const db = getDatabase(this.app);
      const currentRef = ref(db, name);
      await set(currentRef, data);
      return data;
    }
  }
}

function checkConnection(scope: FirebaseWrapper) {
  if (!scope.app) {
    throw errorMessage.get('FirebaseWrapper_notConnected');
  }
}

errorMessage.add([
  ['FirebaseWrapper_notConnected', ['Not connected', 'Not connected']],
  ['FirebaseWrapper_noApp', ['No app available', 'No app available']],
  [
    'FirebaseWrapper_hasApp',
    ['App already available', 'App "%1" already available']
  ]
]);
