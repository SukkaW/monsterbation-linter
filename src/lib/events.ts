const events: Record<string, Set<() => void> | undefined> = {};

const on = (event: string, listener: ((this: void, ...args: any[]) => void)): void => {
  (events[event] ||= new Set()).add(listener);
};

const emit = (event: string, ...args: any[]): void => {
  events[event]?.forEach(listener => Reflect.apply(listener, this, args));
};

const off = (event: string, listener: ((this: void, ...args: any[]) => void)): void => {
  events[event]?.delete(listener);
};

export default { emit, on, off };
