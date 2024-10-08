import { SYMBOL } from './symbols';

export const SVG_SYMBOL = {
  [SYMBOL.DEFAULT]: () =>
    import('../assets/svg/symbols/default.svg?component').then(
      module => module.default
    ),
  [SYMBOL.DIRECTORY]: () =>
    import('../assets/svg/symbols/directory.svg?component').then(
      module => module.default
    ),
  [SYMBOL.DIRECTORY_PREFS]: () =>
    import('../assets/svg/symbols/directory_prefs.svg?component').then(
      module => module.default
    ),
  [SYMBOL.CLOUD_DISK]: () =>
    import('../assets/svg/symbols/cloud_disk.svg?component').then(
      module => module.default
    ),
  [SYMBOL.HARD_DISK]: () =>
    import('../assets/svg/symbols/hard_disk.svg?component').then(
      module => module.default
    ),
  [SYMBOL.RAM_DISK]: () =>
    import('../assets/svg/symbols/ram_disk.svg?component').then(
      module => module.default
    ),
  [SYMBOL.TMP_DISK]: () =>
    import('../assets/svg/symbols/tmp_disk.svg?component').then(
      module => module.default
    ),
  [SYMBOL.DISK_1]: () =>
    import('../assets/svg/symbols/disk_1.svg?component').then(
      module => module.default
    ),
  [SYMBOL.DISK_2]: () =>
    import('../assets/svg/symbols/disk_2.svg?component').then(
      module => module.default
    ),
  [SYMBOL.DISK_WORKBENCH13]: () =>
    import('../assets/svg/symbols/disk_workbench13.svg?component').then(
      module => module.default
    ),
  [SYMBOL.DISK_MARKDOWN]: () =>
    import('../assets/svg/symbols/disk_markdown.svg?component').then(
      module => module.default
    ),
  [SYMBOL.DISK_BASIC]: () =>
    import('../assets/svg/symbols/disk_basic.svg?component').then(
      module => module.default
    ),
  [SYMBOL.WORK]: () =>
    import('../assets/svg/symbols/work.svg?component').then(
      module => module.default
    ),
  [SYMBOL.CONSOLE]: () =>
    import('../assets/svg/symbols/console.svg?component').then(
      module => module.default
    ),
  [SYMBOL.SETTINGS]: () =>
    import('../assets/svg/symbols/settings.svg?component').then(
      module => module.default
    ),
  [SYMBOL.TRASHCAN]: () =>
    import('../assets/svg/symbols/trashcan.svg?component').then(
      module => module.default
    ),
  [SYMBOL.COMPUTER_1]: () =>
    import('../assets/svg/symbols/computer_1.svg?component').then(
      module => module.default
    ),
  [SYMBOL.TELEPHONE]: () =>
    import('../assets/svg/symbols/telephone.svg?component').then(
      module => module.default
    ),
  [SYMBOL.CURSOR]: () =>
    import('../assets/svg/symbols/cursor.svg?component').then(
      module => module.default
    ),
  [SYMBOL.PREFERENCE]: () =>
    import('../assets/svg/symbols/preference.svg?component').then(
      module => module.default
    ),
  [SYMBOL.WEB_BASIC]: () =>
    import('../assets/svg/symbols/web_basic.svg?component').then(
      module => module.default
    ),
  [SYMBOL.WEB_PAINTING]: () =>
    import('../assets/svg/symbols/web_painting.svg?component').then(
      module => module.default
    ),
  [SYMBOL.COLORS]: () =>
    import('../assets/svg/symbols/colors.svg?component').then(
      module => module.default
    ),
  [SYMBOL.PRINT_1]: () =>
    import('../assets/svg/symbols/print_1.svg?component').then(
      module => module.default
    ),
  [SYMBOL.PRINT_2]: () =>
    import('../assets/svg/symbols/print_2.svg?component').then(
      module => module.default
    ),
  [SYMBOL.NOTEPAD]: () =>
    import('../assets/svg/symbols/notepad.svg?component').then(
      module => module.default
    ),
  [SYMBOL.BASIC]: () =>
    import('../assets/svg/symbols/basic.svg?component').then(
      module => module.default
    ),
  [SYMBOL.IMAGE]: () =>
    import('../assets/svg/symbols/image.svg?component').then(
      module => module.default
    ),
  [SYMBOL.NOTE]: () =>
    import('../assets/svg/symbols/note.svg?component').then(
      module => module.default
    ),
  [SYMBOL.NOTE_BLANK]: () =>
    import('../assets/svg/symbols/note_blank.svg?component').then(
      module => module.default
    ),
  [SYMBOL.LARGE_NOTE]: () =>
    import('../assets/svg/symbols/large_note.svg?component').then(
      module => module.default
    ),
  [SYMBOL.LARGE_NOTE_RICH]: () =>
    import('../assets/svg/symbols/large_note_rich.svg?component').then(
      module => module.default
    ),
  [SYMBOL.FULLSCREEN]: () =>
    import('../assets/svg/symbols/fullscreen.svg?component').then(
      module => module.default
    ),
  [SYMBOL.CALCULATOR]: () =>
    import('../assets/svg/symbols/calculator.svg?component').then(
      module => module.default
    ),
  [SYMBOL.CLOCK]: () =>
    import('../assets/svg/symbols/clock.svg?component').then(
      module => module.default
    ),
  [SYMBOL.KEYBOARD_QUESTION]: () =>
    import('../assets/svg/symbols/keyboard_question.svg?component').then(
      module => module.default
    ),
  [SYMBOL.LARGE_NOTEPAD]: () =>
    import('../assets/svg/symbols/large_notepad.svg?component').then(
      module => module.default
    ),
  [SYMBOL.LARGE_NOTEPAD_HELP]: () =>
    import('../assets/svg/symbols/large_notepad_help.svg?component').then(
      module => module.default
    ),
  [SYMBOL.RABBIT]: () =>
    import('../assets/svg/symbols/rabbit.svg?component').then(
      module => module.default
    ),
  [SYMBOL.MORE]: () =>
    import('../assets/svg/symbols/more.svg?component').then(
      module => module.default
    ),
  [SYMBOL.SAY]: () =>
    import('../assets/svg/symbols/say.svg?component').then(
      module => module.default
    ),
  [SYMBOL.GITHUB]: () =>
    import('../assets/svg/symbols/github.svg?component').then(
      module => module.default
    ),
  [SYMBOL.LAMMPEE]: () =>
    import('../assets/svg/symbols/lammpee.svg?component').then(
      module => module.default
    ),
  [SYMBOL.CUBY]: () =>
    import('../assets/svg/symbols/cuby.svg?component').then(
      module => module.default
    ),
  [SYMBOL.NUXT]: () =>
    import('../assets/svg/symbols/nuxt.svg?component').then(
      module => module.default
    ),
  [SYMBOL.CLOWN]: () =>
    import('../assets/svg/symbols/clown.svg?component').then(
      module => module.default
    ),
  [SYMBOL.DISALLOW_1]: () =>
    import('../assets/svg/symbols/disallow_1.svg?component').then(
      module => module.default
    ),
  [SYMBOL.COPY_1]: () =>
    import('../assets/svg/symbols/copy_1.svg?component').then(
      module => module.default
    ),
  [SYMBOL.COPY_2]: () =>
    import('../assets/svg/symbols/copy_2.svg?component').then(
      module => module.default
    ),
  [SYMBOL.DISPLAY_KEYBOARD]: () =>
    import('../assets/svg/symbols/display_keyboard.svg?component').then(
      module => module.default
    ),
  [SYMBOL.PALETTE]: () =>
    import('../assets/svg/symbols/palette.svg?component').then(
      module => module.default
    ),
  [SYMBOL.SIGN_1]: () =>
    import('../assets/svg/symbols/sign_1.svg?component').then(
      module => module.default
    ),
  [SYMBOL.DOCUMENT_EDITOR]: () =>
    import('../assets/svg/symbols/document_editor.svg?component').then(
      module => module.default
    ),
  [SYMBOL.DOCUMENT_READER]: () =>
    import('../assets/svg/symbols/document_reader.svg?component').then(
      module => module.default
    ),
  [SYMBOL.SYNTHESIZER]: () =>
    import('../assets/svg/symbols/synthesizer.svg?component').then(
      module => module.default
    ),
  [SYMBOL.VUE_SEMANTIC_STRUCTURE]: () =>
    import('../assets/svg/symbols/vue_semantic_structure.svg?component').then(
      module => module.default
    ),
  [SYMBOL.NUXT_BOOSTER]: () =>
    import('../assets/svg/symbols/nuxt_booster.svg?component').then(
      module => module.default
    )
};
