export const PREFIX = '[RenderWorker]';

export function throwError(message: string | Error) {
  if (message instanceof Error) {
    message = message.message || message.toString();
  }
  throw new Error(`${PREFIX}: ${message}`);
}
