import Core from './classes/Core';

// Modules
import Parser from './classes/modules/Parser';
import Files from './classes/modules/Files';
import Windows from './classes/modules/Windows';
import Symbols from './classes/modules/Symbols';

const core = new Core();
core.addModule(Parser);
core.addModule(Files);
core.addModule(Windows);
core.addModule(Symbols);

export default core;
