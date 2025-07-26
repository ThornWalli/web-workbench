// const MAX_STACK_SIZE = 50; // Maximum number of items in the stack

import { ReplaySubject } from 'rxjs';

type StackItem<T> = SubStackItem<T>[];
type SubStackItem<T> = T;

export default class Stacker<T> {
  readonly maxStackSize: number = 20; // Maximum number of items in the stack
  private stack: StackItem<T>[] = [];
  private subStack?: SubStackItem<T>[];
  private onAdd?: (item: SubStackItem<T>) => Promise<SubStackItem<T>>;
  // private onForward?: (
  //   stacker: Stacker<T>,
  //   newIndex: number,
  //   lastInde: number
  // ) => Promise<void>;
  // private onBackward?: (
  //   stacker: Stacker<T>,
  //   newIndex: number,
  //   lastInde: number
  // ) => Promise<void>;
  // private onComplete?: () => void;
  // private onLimitReached?: (stack: StackItem<T>) => void;
  index: number = -1;

  forward$ = new ReplaySubject<{
    stacker: Stacker<T>;
    newIndex: number;
    lastInde: number;
  }>(1);
  backward$ = new ReplaySubject<{
    stacker: Stacker<T>;
    newIndex: number;
    lastInde: number;
  }>(1);
  complete$ = new ReplaySubject<void>(1);
  limitReached$ = new ReplaySubject<StackItem<T>>(1);

  constructor({
    maxStackSize
    // onForward,
    // onBackward,
    // onComplete,
    // onLimitReached
  }: {
    maxStackSize?: number;
    // onForward?: Stacker<T>['onForward'];
    // onBackward?: Stacker<T>['onBackward'];
    // onComplete?: Stacker<T>['onComplete'];
    // onLimitReached?: Stacker<T>['onLimitReached'];
  }) {
    if (maxStackSize) {
      this.maxStackSize = maxStackSize;
    }
    // this.onForward = onForward;
    // this.onBackward = onBackward;
    // this.onComplete = onComplete;
    // this.onLimitReached = onLimitReached;
  }

  start() {
    // If we are not at the end of the stack, remove all items after the current index
    if (this.index < this.stack.length - 1) {
      this.stack = this.getStackAtIndex(this.index);
    }
    this.subStack = [];
  }

  async add(item: SubStackItem<T>) {
    if (!this.subStack) {
      throw new Error('Stack not started. Call start() before adding items.');
    }
    item = (await this.onAdd?.(item)) || item;
    this.subStack.push(item);
  }

  stop() {
    if (this.subStack) {
      this.stack.push(this.subStack);
      this.subStack = undefined;
    }
    if (this.stack.length > this.maxStackSize) {
      const stack = this.stack.shift();
      if (stack) {
        this.limitReached$.next(stack);
      }
    }
    this.index = this.stack.length - 1;
    this.complete$.next();
  }

  abort() {
    this.subStack = undefined;
    this.index = this.stack.length - 1;
  }

  async forward() {
    if (this.index < this.stack.length - 1) {
      const index = this.index;
      this.index++;
      await this.forward$.next({
        stacker: this,
        newIndex: this.index,
        lastInde: index
      });
    }
  }
  async backward() {
    if (this.index > -1) {
      const index = this.index;
      this.index--;
      await this.backward$.next({
        stacker: this,
        newIndex: this.index,
        lastInde: index
      });
    }
  }

  getStackAtIndex(index: number) {
    return this.stack.slice(0, Math.max(index + 1, 0));
  }

  getStack() {
    return this.stack;
  }

  get active() {
    return this.subStack !== undefined;
  }

  get length() {
    return this.stack.length;
  }
  get subStackLength() {
    return this.stack.reduce((result, actions) => result + actions.length, 0);
  }

  clear() {
    this.stack = [];
    this.subStack = undefined;
    this.index = -1;
  }
}
