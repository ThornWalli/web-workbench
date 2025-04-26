import Core from './classes/Core';

// Modules
import Parser from './classes/modules/Parser';
import Files from './classes/modules/Files';
import Windows from './classes/modules/Windows';
import Symbols from './classes/modules/Symbols';

function getCore() {
  const core = new Core();
  core.addModule(Parser);
  core.addModule(Files);
  core.addModule(Windows);
  core.addModule(Symbols);
  return core;
}

export default getCore();
