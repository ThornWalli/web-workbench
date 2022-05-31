import { describe, it, expect } from 'vitest';
import dotenv from 'dotenv';
import FirebaseWrapper from '../src/web-workbench/classes/FirebaseWrapper.js';
dotenv.config();

describe('Firebase Wrapper', () => {
  it('Connect', async () => {
    const firebaseWrapper = new FirebaseWrapper();
    await firebaseWrapper.connect('web-workbench', {
      apiKey: process.env.FIREBASE_API_KEY,
      url: process.env.FIREBASE_URL
    });
    expect(!!firebaseWrapper.app).toBeTruthy();
  });

  it('Read Database `web_workbench_FS_CDLAMMPEE`', async () => {
    const firebaseWrapper = new FirebaseWrapper();
    await firebaseWrapper.connect('web-workbench', {
      apiKey: process.env.FIREBASE_API_KEY,
      url: process.env.FIREBASE_URL
    });
    const snapshot = await firebaseWrapper.get('web_workbench_FS_CDLAMMPEE');
    expect(snapshot.id === 'CDLAMMPEE').toBeTruthy();
  });

  it('User Login', async () => {
    const firebaseWrapper = new FirebaseWrapper();
    await firebaseWrapper.connect('web-workbench', {
      apiKey: process.env.FIREBASE_API_KEY,
      url: process.env.FIREBASE_URL
    });
    await firebaseWrapper.login(process.env.TEST_DATABASE_USER_EMAIL, process.env.TEST_DATABASE_USER_PASSWORD);
    expect(firebaseWrapper.currentUser.email === process.env.TEST_DATABASE_USER_EMAIL).toBeTruthy();
  });
});

