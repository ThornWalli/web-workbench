import type { SymbolDescription } from '../modules/Symbols/types';

export enum TYPE {
  DEFAULT = 'default',
  LINK = 'link',
  CLOUD_DISK = 'cloud_disk',
  FLOPPY_DISK = 'floppy_disk',
  HARD_DISK = 'hard_disk',
  RAM_DISK = 'ram_disk',
  TMP_DISK = 'tmp_disk',
  DIRECTORY = 'directory',
  FILE = 'file',
  TRASHCAN = 'trashcan',
  DISK = 'disk',
  VIEW = 'view'
}

export enum SYMBOL {
  DEFAULT = 'default',
  DIRECTORY = 'directory',
  DIRECTORY_PREFS = 'directory_prefs',
  CLOUD_DISK = 'cloud_disk',
  HARD_DISK = 'hard_disk',
  RAM_DISK = 'ram_disk',
  TMP_DISK = 'tmp_disk',
  DISK_1 = 'disk_1',
  DISK_2 = 'disk_2',
  DISK_MARKDOWN = 'disk_markdown',
  DISK_BASIC = 'disk_basic',
  WORK = 'work',
  TRASHCAN = 'trashcan',
  COMPUTER_1 = 'computer_1',
  TELEPHONE = 'telephone',
  CURSOR = 'cursor',
  PREFERENCE = 'preference',
  COLORS = 'colors',
  PRINT_1 = 'print_1',
  PRINT_2 = 'print_2',
  NOTEPAD = 'notepad',
  BASIC = 'basic',
  IMAGE = 'image',
  NOTE = 'note',
  NOTE_BLANK = 'note_blank',
  LARGE_NOTE = 'large_note',
  LARGE_NOTE_RICH = 'large_note_rich',
  FULLSCREEN = 'fullscreen',
  KEYBOARD_QUESTION = 'keyboard_question',
  LARGE_NOTEPAD = 'large_notepad',
  LARGE_NOTEPAD_HELP = 'large_notepad_help',
  RABBIT = 'rabbit',
  MORE = 'more',
  SAY = 'say',
  CLOWN = 'clown',
  DISALLOW_1 = 'disallow_1',
  COPY_1 = 'copy_1',
  COPY_2 = 'copy_2',
  DISPLAY_KEYBOARD = 'display_keyboard',
  PALETTE = 'palette',
  SIGN_1 = 'sign_1',
  LAMMPEE = 'lammpee'
}

const symbolGroup = 'core';

export async function getSymbols(): Promise<SymbolDescription[]> {
  return [
    {
      key: SYMBOL.DEFAULT,
      component:
        await import('../assets/svg/symbols/default.svg?component').then(
          module => module.default
        ),
      group: symbolGroup
    },
    {
      key: SYMBOL.DIRECTORY,
      component:
        await import('../assets/svg/symbols/directory.svg?component').then(
          module => module.default
        ),
      group: symbolGroup
    },
    {
      key: SYMBOL.DIRECTORY_PREFS,
      component:
        await import('../assets/svg/symbols/directory_prefs.svg?component').then(
          module => module.default
        ),
      group: symbolGroup
    },
    {
      key: SYMBOL.CLOUD_DISK,
      component:
        await import('../assets/svg/symbols/cloud_disk.svg?component').then(
          module => module.default
        ),
      group: symbolGroup
    },
    {
      key: SYMBOL.HARD_DISK,
      component:
        await import('../assets/svg/symbols/hard_disk.svg?component').then(
          module => module.default
        ),
      group: symbolGroup
    },
    {
      key: SYMBOL.RAM_DISK,
      component:
        await import('../assets/svg/symbols/ram_disk.svg?component').then(
          module => module.default
        ),
      group: symbolGroup
    },
    {
      key: SYMBOL.TMP_DISK,
      component:
        await import('../assets/svg/symbols/tmp_disk.svg?component').then(
          module => module.default
        ),
      group: symbolGroup
    },
    {
      key: SYMBOL.DISK_1,
      component:
        await import('../assets/svg/symbols/disk_1.svg?component').then(
          module => module.default
        ),
      group: symbolGroup
    },
    {
      key: SYMBOL.DISK_2,
      component:
        await import('../assets/svg/symbols/disk_2.svg?component').then(
          module => module.default
        ),
      group: symbolGroup
    },
    {
      key: SYMBOL.DISK_MARKDOWN,
      component:
        await import('../assets/svg/symbols/disk_markdown.svg?component').then(
          module => module.default
        ),
      group: symbolGroup
    },
    {
      key: SYMBOL.DISK_BASIC,
      component:
        await import('../assets/svg/symbols/disk_basic.svg?component').then(
          module => module.default
        ),
      group: symbolGroup
    },
    {
      key: SYMBOL.WORK,
      component: await import('../assets/svg/symbols/work.svg?component').then(
        module => module.default
      ),
      group: symbolGroup
    },
    {
      key: SYMBOL.TRASHCAN,
      component:
        await import('../assets/svg/symbols/trashcan.svg?component').then(
          module => module.default
        ),
      group: symbolGroup
    },
    {
      key: SYMBOL.COMPUTER_1,
      component:
        await import('../assets/svg/symbols/computer_1.svg?component').then(
          module => module.default
        ),
      group: symbolGroup
    },
    {
      key: SYMBOL.TELEPHONE,
      component:
        await import('../assets/svg/symbols/telephone.svg?component').then(
          module => module.default
        ),
      group: symbolGroup
    },
    {
      key: SYMBOL.CURSOR,
      component:
        await import('../assets/svg/symbols/cursor.svg?component').then(
          module => module.default
        ),
      group: symbolGroup
    },
    {
      key: SYMBOL.PREFERENCE,
      component:
        await import('../assets/svg/symbols/preference.svg?component').then(
          module => module.default
        ),
      group: symbolGroup
    },
    {
      key: SYMBOL.PRINT_1,
      component:
        await import('../assets/svg/symbols/print_1.svg?component').then(
          module => module.default
        ),
      group: symbolGroup
    },
    {
      key: SYMBOL.PRINT_2,
      component:
        await import('../assets/svg/symbols/print_2.svg?component').then(
          module => module.default
        ),
      group: symbolGroup
    },
    {
      key: SYMBOL.NOTEPAD,
      component:
        await import('../assets/svg/symbols/notepad.svg?component').then(
          module => module.default
        ),
      group: symbolGroup
    },
    {
      key: SYMBOL.BASIC,
      component: await import('../assets/svg/symbols/basic.svg?component').then(
        module => module.default
      ),
      group: symbolGroup
    },
    {
      key: SYMBOL.IMAGE,
      component: await import('../assets/svg/symbols/image.svg?component').then(
        module => module.default
      ),
      group: symbolGroup
    },
    {
      key: SYMBOL.NOTE,
      component: await import('../assets/svg/symbols/note.svg?component').then(
        module => module.default
      ),
      group: symbolGroup
    },
    {
      key: SYMBOL.NOTE_BLANK,
      component:
        await import('../assets/svg/symbols/note_blank.svg?component').then(
          module => module.default
        ),
      group: symbolGroup
    },
    {
      key: SYMBOL.LARGE_NOTE,
      component:
        await import('../assets/svg/symbols/large_note.svg?component').then(
          module => module.default
        ),
      group: symbolGroup
    },
    {
      key: SYMBOL.LARGE_NOTE_RICH,
      component:
        await import('../assets/svg/symbols/large_note_rich.svg?component').then(
          module => module.default
        ),
      group: symbolGroup
    },
    {
      key: SYMBOL.KEYBOARD_QUESTION,
      component:
        await import('../assets/svg/symbols/keyboard_question.svg?component').then(
          module => module.default
        ),
      group: symbolGroup
    },
    {
      key: SYMBOL.LARGE_NOTEPAD,
      component:
        await import('../assets/svg/symbols/large_notepad.svg?component').then(
          module => module.default
        ),
      group: symbolGroup
    },
    {
      key: SYMBOL.LARGE_NOTEPAD_HELP,
      component:
        await import('../assets/svg/symbols/large_notepad_help.svg?component').then(
          module => module.default
        ),
      group: symbolGroup
    },
    {
      key: SYMBOL.RABBIT,
      component:
        await import('../assets/svg/symbols/rabbit.svg?component').then(
          module => module.default
        ),
      group: symbolGroup
    },
    {
      key: SYMBOL.MORE,
      component: await import('../assets/svg/symbols/more.svg?component').then(
        module => module.default
      ),
      group: symbolGroup
    },
    {
      key: SYMBOL.LAMMPEE,
      component:
        await import('../assets/svg/symbols/lammpee.svg?component').then(
          module => module.default
        ),
      group: symbolGroup
    },
    {
      key: SYMBOL.CLOWN,
      component: await import('../assets/svg/symbols/clown.svg?component').then(
        module => module.default
      ),
      group: symbolGroup
    },
    {
      key: SYMBOL.DISALLOW_1,
      component:
        await import('../assets/svg/symbols/disallow_1.svg?component').then(
          module => module.default
        ),
      group: symbolGroup
    },
    {
      key: SYMBOL.COPY_1,
      component:
        await import('../assets/svg/symbols/copy_1.svg?component').then(
          module => module.default
        ),
      group: symbolGroup
    },
    {
      key: SYMBOL.COPY_2,
      component:
        await import('../assets/svg/symbols/copy_2.svg?component').then(
          module => module.default
        ),
      group: symbolGroup
    },
    {
      key: SYMBOL.DISPLAY_KEYBOARD,
      component:
        await import('../assets/svg/symbols/display_keyboard.svg?component').then(
          module => module.default
        ),
      group: symbolGroup
    },
    {
      key: SYMBOL.SIGN_1,
      component:
        await import('../assets/svg/symbols/sign_1.svg?component').then(
          module => module.default
        ),
      group: symbolGroup
    }
  ];
}

// export async function getSymbolsd() {
//   return {
//     [SYMBOL.DEFAULT]: await import(
//       '../assets/svg/symbols/default.svg?component'
//     ).then(module => module.default),
//     [SYMBOL.DIRECTORY]: await import(
//       '../assets/svg/symbols/directory.svg?component'
//     ).then(module => module.default),
//     [SYMBOL.DIRECTORY_PREFS]: await import(
//       '../assets/svg/symbols/directory_prefs.svg?component'
//     ).then(module => module.default),
//     [SYMBOL.CLOUD_DISK]: await import(
//       '../assets/svg/symbols/cloud_disk.svg?component'
//     ).then(module => module.default),
//     [SYMBOL.HARD_DISK]: await import(
//       '../assets/svg/symbols/hard_disk.svg?component'
//     ).then(module => module.default),
//     [SYMBOL.RAM_DISK]: await import(
//       '../assets/svg/symbols/ram_disk.svg?component'
//     ).then(module => module.default),
//     [SYMBOL.TMP_DISK]: await import(
//       '../assets/svg/symbols/tmp_disk.svg?component'
//     ).then(module => module.default),
//     [SYMBOL.DISK_1]: await import(
//       '../assets/svg/symbols/disk_1.svg?component'
//     ).then(module => module.default),
//     [SYMBOL.DISK_2]: await import(
//       '../assets/svg/symbols/disk_2.svg?component'
//     ).then(module => module.default),
//     [SYMBOL.DISK_MARKDOWN]: await import(
//       '../assets/svg/symbols/disk_markdown.svg?component'
//     ).then(module => module.default),
//     [SYMBOL.DISK_BASIC]: await import(
//       '../assets/svg/symbols/disk_basic.svg?component'
//     ).then(module => module.default),
//     [SYMBOL.WORK]: await import(
//       '../assets/svg/symbols/work.svg?component'
//     ).then(module => module.default),
//     [SYMBOL.TRASHCAN]: await import(
//       '../assets/svg/symbols/trashcan.svg?component'
//     ).then(module => module.default),
//     [SYMBOL.COMPUTER_1]: await import(
//       '../assets/svg/symbols/computer_1.svg?component'
//     ).then(module => module.default),
//     [SYMBOL.TELEPHONE]: await import(
//       '../assets/svg/symbols/telephone.svg?component'
//     ).then(module => module.default),
//     [SYMBOL.CURSOR]: await import(
//       '../assets/svg/symbols/cursor.svg?component'
//     ).then(module => module.default),
//     [SYMBOL.PREFERENCE]: await import(
//       '../assets/svg/symbols/preference.svg?component'
//     ).then(module => module.default),
//     [SYMBOL.PRINT_1]: await import(
//       '../assets/svg/symbols/print_1.svg?component'
//     ).then(module => module.default),
//     [SYMBOL.PRINT_2]: await import(
//       '../assets/svg/symbols/print_2.svg?component'
//     ).then(module => module.default),
//     [SYMBOL.NOTEPAD]: await import(
//       '../assets/svg/symbols/notepad.svg?component'
//     ).then(module => module.default),
//     [SYMBOL.BASIC]: await import(
//       '../assets/svg/symbols/basic.svg?component'
//     ).then(module => module.default),
//     [SYMBOL.IMAGE]: await import(
//       '../assets/svg/symbols/image.svg?component'
//     ).then(module => module.default),
//     [SYMBOL.NOTE]: await import(
//       '../assets/svg/symbols/note.svg?component'
//     ).then(module => module.default),
//     [SYMBOL.NOTE_BLANK]: await import(
//       '../assets/svg/symbols/note_blank.svg?component'
//     ).then(module => module.default),
//     [SYMBOL.LARGE_NOTE]: await import(
//       '../assets/svg/symbols/large_note.svg?component'
//     ).then(module => module.default),
//     [SYMBOL.LARGE_NOTE_RICH]: await import(
//       '../assets/svg/symbols/large_note_rich.svg?component'
//     ).then(module => module.default),
//     [SYMBOL.KEYBOARD_QUESTION]: await import(
//       '../assets/svg/symbols/keyboard_question.svg?component'
//     ).then(module => module.default),
//     [SYMBOL.LARGE_NOTEPAD]: await import(
//       '../assets/svg/symbols/large_notepad.svg?component'
//     ).then(module => module.default),
//     [SYMBOL.LARGE_NOTEPAD_HELP]: await import(
//       '../assets/svg/symbols/large_notepad_help.svg?component'
//     ).then(module => module.default),
//     [SYMBOL.RABBIT]: await import(
//       '../assets/svg/symbols/rabbit.svg?component'
//     ).then(module => module.default),
//     [SYMBOL.MORE]: await import(
//       '../assets/svg/symbols/more.svg?component'
//     ).then(module => module.default),
//     [SYMBOL.SAY]: await import('../assets/svg/symbols/say.svg?component').then(
//       module => module.default
//     ),
//     [SYMBOL.LAMMPEE]: await import(
//       '../assets/svg/symbols/lammpee.svg?component'
//     ).then(module => module.default),
//     [SYMBOL.CLOWN]: await import(
//       '../assets/svg/symbols/clown.svg?component'
//     ).then(module => module.default),
//     [SYMBOL.DISALLOW_1]: await import(
//       '../assets/svg/symbols/disallow_1.svg?component'
//     ).then(module => module.default),
//     [SYMBOL.COPY_1]: await import(
//       '../assets/svg/symbols/copy_1.svg?component'
//     ).then(module => module.default),
//     [SYMBOL.COPY_2]: await import(
//       '../assets/svg/symbols/copy_2.svg?component'
//     ).then(module => module.default),
//     [SYMBOL.DISPLAY_KEYBOARD]: await import(
//       '../assets/svg/symbols/display_keyboard.svg?component'
//     ).then(module => module.default),
//     [SYMBOL.SIGN_1]: await import(
//       '../assets/svg/symbols/sign_1.svg?component'
//     ).then(module => module.default),
//     [SYMBOL.GUEST_BOOK]: await import(
//       '../assets/svg/symbols/guest_book.svg?component'
//     ).then(module => module.default)
//   };
// }
