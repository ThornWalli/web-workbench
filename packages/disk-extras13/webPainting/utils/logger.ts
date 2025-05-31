import { consola } from 'consola';

const logger = consola.withTag('webPainting');
const workerManager = logger.withTag('workerManager');
const display = logger.withTag('display');
const worker = logger.withTag('worker');
const mainWorker = worker.withTag('main');
const displayWorker = worker.withTag('display');

export default logger;
export { display, workerManager, worker, mainWorker, displayWorker };
