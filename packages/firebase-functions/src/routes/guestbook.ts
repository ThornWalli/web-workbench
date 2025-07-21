import type {
  Database,
  DataSnapshot,
  Reference
} from 'firebase-admin/database';
import type { ItemOptions, Entry, EntryContent } from '../types.js';

function getRefByIdMap(items: DataSnapshot) {
  const refMap = new Map<string, Reference>();
  items.forEach(child => {
    if (child.val().id === ID) {
      refMap.set(child.val().id, child.ref);
    }
  });
  return refMap;
}

const ID = 'data.json';

function validateEntry(entry: EntryContent): boolean {
  return (
    !!entry.author &&
    typeof entry.author === 'string' &&
    !!entry.subject &&
    typeof entry.subject === 'string' &&
    !!entry.message &&
    typeof entry.message === 'string'
  );
}

function prepareEntry(entry: EntryContent): Entry {
  return {
    id: crypto.randomUUID(),
    date: Date.now(),
    author: entry.author,
    subject: entry.subject,
    message: entry.message,
    published: false
  };
}

export default (
  database: CallableFunction,
  body: {
    entry: EntryContent;
  }
) => {
  return new Promise<Entry>((resolve, reject) => {
    const db: Database = database();

    const { entry }: { entry?: EntryContent } = body || {};

    if (!entry || !validateEntry(entry)) {
      reject('Invalid entry');
      return;
    }

    const preparedEntry: Entry = prepareEntry(entry);

    return db
      .ref('web_workbench_FS_CDGUESTBOOK/items')
      .get()
      .then(async items => {
        const itemsMap = getRefByIdMap(items);
        const item = itemsMap.get(ID);
        if (item) {
          const data = (await item.get()).val() as ItemOptions;
          const parsedData = JSON.parse(
            decodeURIComponent(atob(data.data as string))
          ) as {
            type: string;
            content: Entry[];
          };

          parsedData.content.push(preparedEntry);
          const result = {
            type: 'json',
            content: parsedData.content
          };
          data.data = btoa(encodeURIComponent(JSON.stringify(result)));
          data.editedDate = Date.now();
          await item.set(data);
        }
        resolve(preparedEntry);
      });
  });
};
