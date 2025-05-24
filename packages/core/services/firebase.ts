import type { FirebaseApp } from 'firebase/app';
import type { FirebaseConfig } from '../config';

// ...

declare global {
  interface Window {
    FIREBASE_APPCHECK_DEBUG_TOKEN?: boolean | string;
  }
}

export interface FirebaseModules {
  app: typeof import('firebase/app');
  auth: typeof import('firebase/auth');
  database: typeof import('firebase/database');
  functions: typeof import('firebase/functions');
}

export default new (class Firebase {
  app: FirebaseApp | undefined;
  private config: FirebaseConfig | undefined;

  async initAppCheck(config: FirebaseConfig, firebaseApp: FirebaseApp) {
    const recaptchaPublicKey = config.appCheck?.recaptchaPublicKey;
    if (recaptchaPublicKey) {
      if (config.appCheck?.debugToken) {
        self.FIREBASE_APPCHECK_DEBUG_TOKEN =
          '287e2bc4-91bd-4a53-a8c7-6832c63064b5';
        console.log('xxx', self.FIREBASE_APPCHECK_DEBUG_TOKEN);
      }
      const { initializeAppCheck, ReCaptchaV3Provider } = await import(
        'firebase/app-check'
      );

      const appCheck = initializeAppCheck(firebaseApp, {
        provider: new ReCaptchaV3Provider(recaptchaPublicKey),
        isTokenAutoRefreshEnabled: true
      });

      return appCheck;
    } else {
      console.warn(
        'Firebase AppCheck is not configured. Please set the recaptchaPublicKey in the config.'
      );
      return;
    }
  }

  async initApp(config: FirebaseConfig) {
    const { app: firebaseApp } = await this.get();

    this.config = config;

    const app = firebaseApp.initializeApp(config);
    await this.initAppCheck(config, app);

    this.app = app;
  }
  async getFunction<
    RequestData = unknown,
    ResponseData = unknown,
    ResponseStream = unknown
  >(name: string) {
    if (!this.app) {
      throw new Error('Firebase app not initialized');
    }
    const {
      functions: { httpsCallable, getFunctions }
    } = await this.get();
    const functions = getFunctions(this.app, this.config?.region);
    return httpsCallable<RequestData, ResponseData, ResponseStream>(
      functions,
      name,
      {
        limitedUseAppCheckTokens: false
      }
    );
  }

  firebase: Promise<FirebaseModules> | null = null;

  get(): Promise<FirebaseModules> {
    return this.firebase || (this.firebase = this.getImports());
  }

  getImports(): Promise<FirebaseModules> {
    return Promise.all([
      import('firebase/app').then(module => module.default || module),
      import('firebase/auth').then(module => module.default || module),
      import('firebase/database').then(module => module.default || module),
      import('firebase/functions').then(module => module.default || module)
    ]).then(([app, auth, database, functions]) => {
      return {
        app,
        auth,
        database,
        functions
      };
    });
  }
})();
