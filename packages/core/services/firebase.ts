// import firebase from 'firebase/app';
// import 'firebase/auth';
// import 'firebase/database';

interface FirebaseModules {
  app: typeof import('firebase/app');
  auth: typeof import('firebase/auth');
  database: typeof import('firebase/database');
}

export default new (class Firebase {
  firebase: Promise<FirebaseModules> | null = null;

  get(): Promise<FirebaseModules> {
    return this.firebase || (this.firebase = this.getImports());
  }

  getImports(): Promise<FirebaseModules> {
    return Promise.all([
      import('firebase/app').then(module => module.default || module),
      import('firebase/auth').then(module => module.default || module),
      import('firebase/database').then(module => module.default || module)
    ]).then(([firebase, auth, database]) => {
      return {
        app: firebase,
        auth: auth,
        database: database
      };
    });
  }
})();
