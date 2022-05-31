import { describe, it, expect } from 'vitest';
import dotenv from 'dotenv';
import FirebaseWrapper from '../src/web-workbench/classes/FirebaseWrapper.js';
dotenv.config();

describe('Firebase Wrapper', () => {
  const firebaseWrapper = new FirebaseWrapper();
  it('Connect', async () => {
    await firebaseWrapper.connect('web-workbench', {
      apiKey: process.env.FIREBASE_API_KEY,
      url: process.env.FIREBASE_URL
    });
    expect(() => firebaseWrapper.isLogged() === false).toBeTruthy();
  });
  it('Read Database `web_workbench_FS_CDLAMMPEE`', async () => {
    const app = await firebaseWrapper.connect('web-workbench', {
      apiKey: process.env.FIREBASE_API_KEY,
      url: process.env.FIREBASE_URL
    });
    const snapshot = await app.database().ref('web_workbench_FS_CDLAMMPEE').once('value');
    expect(() => snapshot.val().id === 'CDLAMMPEE').toBeTruthy();
  });
});

