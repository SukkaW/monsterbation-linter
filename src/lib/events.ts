const events: Record<string, Set<() => void> | undefined> = {};

function on(event: string, listener: ((this: void, ...args: any[]) => void)): void {
  (events[event] ||= new Set()).add(listener);
}

function emit(event: string, ...args: any[]): void {
  events[event]?.forEach(listener => Reflect.apply(listener, this, args));
}

function off(event: string, listener: ((this: void, ...args: any[]) => void)): void {
  events[event]?.delete(listener);
}

export default { emit, on, off };
