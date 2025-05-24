import { sleep } from './helper';
import type Core from '../../classes/Core';
import {
  CLOUD_STORAGE_TYPE,
  type CloudStorageConfig
} from '@web-workbench/core/config';
import type { DiskList } from '@web-workbench/core/modules/Files/types';

export async function createBootScript(
  core: Core,
  {
    disks,
    cloudStorages,
    withWebDos
  }: {
    disks: DiskList;
    cloudStorages: CloudStorageConfig[];
    withWebDos?: boolean;
  }
) {
  const ignoreSleep = !withWebDos;
  const optionalSleep = (duration: number) =>
    ignoreSleep ? undefined : sleep(duration);

  const mountDisks = (disks: DiskList) => {
    if (!disks.length) return [];
    return [
      optionalSleep(1000),
      'Headline("Mount Disks…")',
      optionalSleep(1000),
      ...disks.reduce<(string | undefined)[]>((result, disk) => {
        if (disk.hidden) {
          return result.concat([`mountDisk "${disk.name}"`]);
        } else {
          return result.concat([
            `mountDisk "${disk.name}"`,
            optionalSleep(1000)
          ]);
        }
      }, []),
      'rearrangeIcons -root'
    ];
  };

  function getStorageConfig(config: CloudStorageConfig) {
    const types = Object.values(CLOUD_STORAGE_TYPE).filter(key => {
      return config[key];
    });
    if (types.length > 1) {
      throw new Error('Multiple cloud storage types are not supported');
    }
    const type = types[0];
    return { type: type, config: config[type] };
  }

  const mountCloudStorages = (storages: CloudStorageConfig[]) => {
    if (storages.length < 1) {
      return [];
    }

    return [
      optionalSleep(1000),
      'Headline("Mount Cloud Storages…")',
      optionalSleep(1000),
      ...storages.reduce<(string | undefined)[]>((result, storage) => {
        const { type, config } = getStorageConfig(storage);

        if (!config) {
          throw new Error('Invalid storage configuration');
        }

        switch (type) {
          case CLOUD_STORAGE_TYPE.FIREBASE:
            if (!config.apiKey || !config.url) {
              throw new Error('Missing Firebase configuration');
            }
            result.push(
              `cloudMountFirebase "${storage.name}" --api-key="${config.apiKey}" --url="${config.url}"`
            );
            break;

          default:
            throw new Error(`Unsupported cloud storage type: ${type}`);
        }

        result.push(optionalSleep(1000));

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

  lines.push(...mountCloudStorages(cloudStorages));

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
