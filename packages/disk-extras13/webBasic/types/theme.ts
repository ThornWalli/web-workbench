// eslint-disable-next-line @typescript-eslint/no-empty-object-type
export interface WebBasicThemeColors {}

declare module '@web-workbench/core/classes/Theme' {
  export interface DiskThemeDescription {
    webBasic?: WebBasicThemeColors;
  }
}
