const events: Record<string, Array<() => void> | undefined> = {};

const on = (event: string, listener: ((this: void, ...args: any[]) => void)): void => {
  (events[event] ||= []).push(listener);
};

const emit = (event: string, ...args: any[]): void => {
  events[event]?.forEach(listener => Reflect.apply(listener, this, args));
};

export default { emit, on };
