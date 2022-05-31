// import firebase from 'firebase/app';
// import 'firebase/auth';
// import 'firebase/database';

export default new (class Firebase {
  #firebase;

  get () {
    return this.#firebase || (this.#firebase = (() => this.getImports())()); ;
  }

  getImports () {
    return Promise.all([
      import('firebase/app'),
      import('firebase/auth'),
      import('firebase/database')
    ]).then(([
      firebase, auth, database
    ]) => {
      return {
        app: firebase.default || firebase,
        auth: auth.default || auth,
        database: database.default || database
      };
    });
  }
})();
