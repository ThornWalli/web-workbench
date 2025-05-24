import Core from './classes/Core';

// Modules
import Parser from './modules/Parser';
import Files from './modules/Files';
import Windows from './modules/Windows';
import Screen from './modules/Screen';
import Symbols from './modules/Symbols';

function getCore() {
  const core = new Core();
  core.addModule(Parser);
  core.addModule(Files);
  core.addModule(Windows);
  core.addModule(Screen);
  core.addModule(Symbols);
  return core;
}

export default getCore();
