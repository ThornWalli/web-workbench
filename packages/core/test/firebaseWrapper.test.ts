import { describe, it, expect } from 'vitest';
import { config } from 'dotenv-mono';
import FirebaseWrapper from '../classes/StorageAdapter/FirebaseWrapper';

config();
describe('Firebase Wrapper', () => {
  if (
    process.env.FIREBASE_API_KEY &&
    process.env.FIREBASE_URL &&
    process.env.FIREBASE_APP_ID &&
    process.env.TEST_DATABASE_USER_EMAIL &&
    process.env.TEST_DATABASE_USER_PASSWORD
  ) {
    const apiKey = process.env.FIREBASE_API_KEY as string;
    const url = process.env.FIREBASE_URL as string;
    const appId = process.env.FIREBASE_APP_ID as string;

    const testDatabaseUserEmail = process.env
      .TEST_DATABASE_USER_EMAIL as string;
    const testDatabaseUserPassword = process.env
      .TEST_DATABASE_USER_PASSWORD as string;

    it('Connect', async () => {
      const firebaseWrapper = new FirebaseWrapper();
      await firebaseWrapper.connect(appId, {
        apiKey,
        url
      });
      expect(!!firebaseWrapper.app).toBeTruthy();
    });

    it('Read Database `web_workbench_FS_CDLAMMPEE`', async () => {
      const firebaseWrapper = new FirebaseWrapper();
      await firebaseWrapper.connect(appId, {
        apiKey,
        url
      });
      const snapshot = (await firebaseWrapper.get(
        'web_workbench_FS_CDLAMMPEE'
      )) as { id: string };
      expect(snapshot.id === 'CDLAMMPEE').toBeTruthy();
    });

    it('User Login', async () => {
      const firebaseWrapper = new FirebaseWrapper();
      await firebaseWrapper.connect(appId, {
        apiKey,
        url
      });
      await firebaseWrapper.login(
        testDatabaseUserEmail,
        testDatabaseUserPassword
      );
      expect(
        firebaseWrapper.currentUser?.email ===
          process.env.TEST_DATABASE_USER_EMAIL
      ).toBeTruthy();
    });
  } else {
    it('Skip', async () => {
      console.warn('Firebase credentials not found. Skipping tests.');
    });
  }
});
