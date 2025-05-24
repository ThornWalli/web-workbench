import admin from 'firebase-admin';
import type { CallableRequest } from 'firebase-functions/v2/https';
import { onCall } from 'firebase-functions/v2/https';
import type { Entry, EntryContent } from './types.js';
import guestbook from './routes/guestbook.js';

admin.initializeApp();

interface ResponseData {
  success: boolean;
  entry?: Entry;
  error?: string;
}

export const guestBookAdd = onCall(
  {
    maxInstances: 1,
    timeoutSeconds: 30,
    region: 'europe-west1',
    enforceAppCheck: true,
    consumeAppCheckToken: false
  },
  async (
    request: CallableRequest<{ entry: EntryContent }>
  ): Promise<ResponseData> => {
    try {
      const entry = await guestbook(admin.database, request.data);
      return { success: true, entry };
    } catch (error) {
      return { error: (error as Error).message, success: false };
    }
  }
);
