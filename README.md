# web-workbench

[![GitHub package version](https://img.shields.io/github/package-json/v/ThornWalli/web-workbench.svg)](https://github.com/ThornWalli/web-workbench)
[![license](https://img.shields.io/github/license/ThornWalli/web-workbench.svg)](https://github.com/ThornWalli/web-workbench)
[![TypeScript](https://img.shields.io/badge/%3C%2F%3E-TypeScript-%230074c1.svg)](http://www.typescriptlang.org/)
[![Renovate](https://img.shields.io/badge/renovate-enabled-brightgreen.svg)](https://renovatebot.com)
[![GitHub contributors](https://img.shields.io/github/contributors/ThornWalli/web-workbench.svg)](https://github.com/ThornWalli/web-workbench/graphs/contributors)

![Main](https://github.com/ThornWalli/web-workbench/workflows/Main/badge.svg)
![Beta](https://github.com/ThornWalli/web-workbench/workflows/Beta/badge.svg)

| Instance | Url                        |
| -------- | -------------------------- |
| `live`   | <https://lammpee.de/>      |
| `beta`   | <https://beta.lammpee.de/> |

## Debug

| GET-Parameter       | Description                 | Example                                                                     |
| ------------------- | --------------------------- | --------------------------------------------------------------------------- |
| `?no-boot`          | Disabled boot sequence.     | [Link](https://lammpee.de/?no-boot)                                         |
| `?no-webdos`        | Disabled webdos sequence.   | [Link](https://lammpee.de/?no-webdos)                                       |
| `?no-cloud-storage` | Disabled cloud storage.     | [Link](https://lammpee.de/?no-cloud-storage)                                |
| `?start-command`    | Initial command after boot. | [Link](https://lammpee.de/?start-command=execute+%22DF2:Synthesizer.app%22) |
| `?no-disk`          | Show floppy disk hint       | [Link](https://lammpee.de/?no-disk)                                         |

> Example: <https://lammpee.de/?no-boot&no-webdos&start-command=execute+%22DF2:Synthesizer.app%22>

| Programm         | Url                                                                      |
| ---------------- | ------------------------------------------------------------------------ |
| `Clock`          | <https://lammpee.de/?start-command=execute+%22DF0:Clock.app%22>          |
| `Calculator`     | <https://lammpee.de/?start-command=execute+%22DF0:Calculator.app%22>     |
| `Cloud`          | <https://lammpee.de/?start-command=execute+%22DF0:Cloud.app%22>          |
| `DocumentEditor` | <https://lammpee.de/?start-command=execute+%22DF0:DocumentEditor.app%22> |
| `DocumentReader` | <https://lammpee.de/?start-command=execute+%22DF0:DocumentReader.app%22> |
| `WebPainting`    | <https://lammpee.de/?start-command=execute+%22DF1:WebPainting.app%22>    |
| `WebBasic`       | <https://lammpee.de/?start-command=execute+%22DF1:WebBasic.app%22>       |
| `Synthesizer`    | <https://lammpee.de/?start-command=execute+%22DF2:Synthesizer.app%22>    |
| `Moon City`      | <https://lammpee.de/?start-command=execute+%22DF3:Mooncity.app%22>       |
