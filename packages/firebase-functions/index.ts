import type { Request, Response } from 'express';
import express from 'express';
import { config } from 'dotenv-mono';
import guestbook from './src/routes/guestbook';
config();

const { database, apps, initializeApp, credential } = await import(
  'firebase-admin'
).then(m => m.default);

function setup() {
  if (!apps.length) {
    console.log(process.env.GOOGLE_APPLICATION_CREDENTIALS);
    return {
      app: initializeApp({
        credential: credential.applicationDefault(),
        databaseURL: process.env.FIREBASE_URL
      })
    };
  }
}

setup();

const app = express();
const port = 3000;

app.use('/guestbook', (req: Request, res: Response) => {
  guestbook(database, req.body)
    .then(() => {
      res.status(200).send({ success: true });
    })
    .catch(err => {
      console.error(err);
      res.status(500).send('Internal Server Error');
    });
});

app.listen(port, () => {
  console.log(`Server läuft auf http://localhost:${port}`);
});
