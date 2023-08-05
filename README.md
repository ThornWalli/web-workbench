# web-workbench

[![GitHub package version](https://img.shields.io/github/package-json/v/ThornWalli/web-workbench.svg)](https://github.com/ThornWalli/web-workbench)
[![license](https://img.shields.io/github/license/ThornWalli/web-workbench.svg)](https://github.com/ThornWalli/web-workbench)
[![Renovate](https://img.shields.io/badge/renovate-enabled-brightgreen.svg)](https://renovatebot.com)
[![GitHub contributors](https://img.shields.io/github/contributors/ThornWalli/web-workbench.svg)](https://github.com/ThornWalli/web-workbench/graphs/contributors)

![Main](https://github.com/ThornWalli/web-workbench/workflows/Main/badge.svg)
![Beta](https://github.com/ThornWalli/web-workbench/workflows/Beta/badge.svg)

| Instance | Url                        |
| -------- | -------------------------- |
| `live`   | <https://lammpee.de/>      |
| `beta`   | <https://beta.lammpee.de/> |

## Debug

| GET-Parameter    | Description                 | Example                                                           |
| ---------------- | --------------------------- | ----------------------------------------------------------------- |
| `?no-boot`       | Disabled boot sequence.     | [Link](https://lammpee.de/?no-boot)                               |
| `?no-webdos`     | Disabled webdos sequence.   | [Link](https://lammpee.de/?no-webdos)                             |
| `?start-command` | Initial command after boot. | [Link](https://lammpee.de/?start-command=execute+"DF1:clock.app") |
| `?no-disk`       | Show floppy disk hint       | [Link](https://lammpee.de/?no-disk)                               |

> Example: <https://lammpee.de/?no-boot&no-webdos&start-command=execute+"DF1:clock.app">

| Programm         | Url                                                                 |
| ---------------- | ------------------------------------------------------------------- |
| `Clock`          | <https://lammpee.de/?start-command=execute+"DF0:Clock.app>          |
| `Calculator`     | <https://lammpee.de/?start-command=execute+"DF0:Calculator.app>     |
| `Cloud`          | <https://lammpee.de/?start-command=execute+"DF0:Cloud.app>          |
| `DocumentEditor` | <https://lammpee.de/?start-command=execute+"DF0:DocumentEditor.app> |
| `DocumentReader` | <https://lammpee.de/?start-command=execute+"DF0:DocumentReader.app> |
| `Synthesizer`    | <https://lammpee.de/?start-command=execute+"DF1:Synthesizer.app>    |
| `WebPainting`    | <https://lammpee.de/?start-command=execute+"DF1:WebPainting.app>    |
| `WebBasic`       | <https://lammpee.de/?start-command=execute+"DF1:WebBasic.app>       |
