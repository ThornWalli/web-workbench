import { sleep } from './helper';
import { useRuntimeConfig } from '#imports';
import type Core from '../../classes/Core';
import type { FirebaseConfig } from '../../classes/Core/types';

export async function createBootScript(
  core: Core,
  {
    disks,
    cloudStorages,
    withWebDos
  }: {
    disks: string[];
    cloudStorages: string[];
    withWebDos?: boolean;
  }
) {
  const ignoreSleep = !withWebDos;
  const optionalSleep = (duration: number) =>
    ignoreSleep ? undefined : sleep(duration);

  const mountDisks = (disks: string[]) => {
    if (!disks.length) return [];
    return [
      optionalSleep(1000),
      'Headline("Mount Disks…")',
      optionalSleep(1000),
      ...disks.reduce<(string | undefined)[]>(
        (result, disk) =>
          result.concat([`mountDisk "${disk}"`, optionalSleep(1000)]),
        []
      ),
      'rearrangeIcons -root'
    ];
  };

  const mountCloudStorages = (storages: string[], firebase: FirebaseConfig) => {
    if (!storages.length || !firebase.apiKey || !firebase.url) return [];
    return [
      optionalSleep(1000),
      'Headline("Mount Cloud Storages…")',
      optionalSleep(1000),
      ...storages.reduce<(string | undefined)[]>((result, storage) => {
        result.push(
          `cloudMount "${storage}" --api-key="${firebase.apiKey}" --url="${firebase.url}"`,
          optionalSleep(1000)
        );
        return result;
      }, [])
    ];
  };

  const lines: (string | undefined)[] = [
    '// Functions',

    'SUB Separator(stars) STATIC',
    'PRINT STRING$(stars, "*")',
    'END SUB',

    'SUB Headline(title$) STATIC',
    'LET title$ = "*** " + title + " ***"',
    'PRINT ""',
    'Separator(LEN(title$))',
    'PRINT title$',
    'Separator(LEN(title$))',
    'PRINT ""',
    'END SUB',

    '// Output'
  ];

  lines.push(...mountDisks(disks));

  const { firebase } = useRuntimeConfig().public;
  lines.push(...mountCloudStorages(cloudStorages, firebase));

  lines.push(
    optionalSleep(1000),
    'PRINT ""',
    'PRINT "<strong>Waiting is user experience …</strong>"'
  );

  await core.modules.files?.fs.createTmpFile('BOOT.basic', 'BOOT.basic', {
    type: 'basic',
    content: lines.filter(line => line !== undefined)
  });

  return;
}
