class EventEmitter {
  private events: Record<string, (() => void)[]> = {};

  on(event: string, listener: (() => void)): void {
    this.events[event] = this.events[event] || [];
    this.events[event].push(listener);
  }

  emit(event: string, ...args: any[]): void {
    this.events[event]?.forEach(listener => Reflect.apply(listener, this, args));
  }
}

export default new EventEmitter();
