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
      firebase
    ]) => {
      return firebase.default;
    });
  }
})();
