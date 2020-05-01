const requireESM = require('esm')(module);
const webWorkbench = requireESM('./src/web-workbench').default;
const consoleInterface = requireESM('./src/web-workbench/services/consoleInterface').default;
const btoa = requireESM('./src/web-workbench/utils/helper').btoa;

webWorkbench.ready.subscribe(async (core) => {
  const commandLines = [
    'CLS',
    //
    // 'selfCheck'
    // 'basicExamples "Bubble Sort"',
    'basicExamples "Pyramid"',
    'exit',
    // 'basicExamples "Goto"'
    // 'makeDir "/inline" "Dirname inline" true'

    // 'confirm "test 2000"'

    // 'commands'
    // 'cd "RAM:"',
    // // 'makefile --path="dir1/file2.info" --name="Test 1" --data="' + await btoa('{"test":2000}') + '"',
    // // 'makefile --path="dir1/file3.info" --name="Test 2" --data="' + await btoa('{"test":30001}') + '"',
    // // 'print exist "file1.info"',
    // // 'print readfile "file1.info"',
    // // 'remove "test1.info"',
    // // 'remove "dir1" -recursive',

    // // 'makedir --path="dir1"',
    // 'makefile --path="file1.info" --name="Test" --data="' + await btoa('{"test":2000}') + '"',
    // 'makelink "file1.info" "Test" "."',

    'CLS',

    'print "" "Start testing…" "" -n',

    'selfCheck',

    'info',

    'print "" "Create Files:" "" -n',

    'print "Create dir, file and link" "" -n',
    'makedir --path="dir1"',
    'makefile --path="file1.info" --name="Test" --data="' + await btoa('{"test":2000}') + '"',

    'makelink "file1.info" "Test" "."',
    'ls',

    'print "" "Create file \\"dir1/file1.info\\"" "" -n',
    'makefile --path="dir1/file1.info" --name="Test" --data="' + await btoa('{"test":2000}') + '"',
    'print "" "Show dir \\"dir1\\"" "" -n',
    'ls "dir1"',
    'print ""',

    // 'exit',
    'print "" "Mount Cloud Disks:" "" -n',

    `'cloudMount "CDLAMMPEE" --apiKey="${process.env.FIREBASE_API_KEY}" --url="${process.env.FIREBASE_URL}"`,
    `'cloudMount "CD0" --apiKey="${process.env.FIREBASE_API_KEY}" --url="${process.env.FIREBASE_URL}"`,

    'ls "CDLAMMPEE"',

    'print "" "File info (CDLAMMPEE:GitHub.ref):" "" -n',

    'ls "CDLAMMPEE"',

    'fileinfo "CDLAMMPEE:GitHub.ref" -list',
    'print fileinfo "CDLAMMPEE:GitHub.ref" "itemPosition"',

    'print "" "Login \\"CDLAMMPEE\\"" "" -n',

    'cloudAuth -login --email="lammpee@gmail.com" --password="xxxx" --storage="CDLAMMPEE"',
    'print ""',
    'cloudList',
    'print "" "Login \\"CD0\\"" "" -n',
    'cloudAuth -login --email="lammpee@gmail.com" --password="xxxxx" --storage="CD0"',

    'print ""',
    'cloudList',
    'print "" "Logout from Cloud Disks" "" -n',

    'cloudAuth -logout --storage="CDLAMMPEE"',
    'cloudAuth -logout --storage="CD0"',
    'print ""',
    'cloudList',

    'ls "CDLAMMPEE"',

    'print "" "Readfile \\"CDLAMMPEE:GitHub.ref\\":" "" -n',
    'print readfile "CDLAMMPEE:GitHub.ref"',

    'print "" "Execute basic file \\"CDLAMMPEE:GitHub.ref\\":" "" -n',
    'basic "CDLAMMPEE:GitHub.ref"',

    'print "" "Unmount Cloud Disks" "" -n',

    'ls',
    'print ""',

    'cloudUnmount "CDLAMMPEE"',
    'cloudUnmount "CD0"',

    'cloudList'
    // 'cloudList',

    // 'editfile "file1.info" --data="' + await btoa('{"test":1000}') + '"',
    // 'readfile "file1.info"',
    // '# Rename',
    // 'rename --path="file1.info" --value="file10.info"',
    // 'rename --path="file10.info" --value="Test 2" -name',

    // 'makedir --path="dir1"',
    // 'rename --path="dir1" --value="dir2"',
    // 'rename --path="dir1" --value="dir2" -name',

    // 'rename --path="dir1" --value="Test 2" -name',
    // 'ls'
    // 'ls "dir1"'
    // 'info RAM:'

    // 'makeDir "RAM:TestDir" "Test"',
    // 'makeFile "RAM:TestFile" "Test" -ignore-exist'
  ];

  const lineCount = commandLines.length;
  let value;
  while (true) {
    if (commandLines.length < 1) {
      value = await consoleInterface.prompt('');
    } else {
      value = commandLines.shift();
    }

    if (/[ ]*exit[ ]*/.test(value.toLowerCase())) {
      break;
    }
    const result = await core.executeCommand(value, { show: true, showCommand: true });
    // console.log(result);

    if (lineCount < 1 || (lineCount > 0 && commandLines.length < 1)) {
      break;
    }
  }

  return core;
});
