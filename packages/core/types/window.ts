import type { IPoint } from '@js-basics/vector';
import type { Layout } from '.';
import type { Component, ComputedRef, Raw } from 'vue';
import type WindowWrapper from '../classes/WindowWrapper';
import type Window from '../classes/Window';

export interface WindowOptions {
  title?: string;
  scale?: boolean;
  scaleX?: boolean;
  scaleY?: boolean;
  scroll?: boolean;
  scrollX?: boolean;
  scrollY?: boolean;
  clamp?: boolean;
  clampX?: boolean;
  clampY?: boolean;
  freeze?: boolean;
  focused?: boolean;
  center?: boolean;
  close?: boolean;
  overlay?: boolean;
  embed?: boolean;
  borderless?: boolean;
  fillHeader?: boolean;
  filled?: ComputedRef<boolean> | boolean;
  hideRootHeader?: boolean;
  sidebar?: boolean;
  prompt?: boolean;
  ready?: boolean;
}

export interface WindowGroup {
  name: string;
  primary: Window;
  windows: Window[];
}

export interface WindowWrapperLayout extends Layout {
  position: IPoint & number;
}

export interface WindowLayout extends Layout {
  minSize?: IPoint & number;
  maxSize?: IPoint & number;
  position: IPoint & number;
  scrollOffset?: IPoint & number;
  focused?: boolean;
  zIndex?: number;
}
export interface WindowTemplate {
  sidebarComponent?: Raw<Component> | Component;
  sidebarComponentData?: Raw<object> | object;
  component?: Raw<Component> | Component;
  componentData?: { [key: string]: unknown };
  options?: WindowOptions;
  wrapper?: WindowWrapper;
  layout?: Partial<WindowLayout>;
  parentWindow?: Window;
}
