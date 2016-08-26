class DrawingEventEmitter {
  constructor() {
    this.handlers = {};
  }

  on(event, handler) {
    let eventHandlers = this.handlers[event];

    if(!eventHandlers) {
      this.handlers[event] = eventHandlers = [];
    }

    eventHandlers.push(handler);
  }

  emit(event, ...args) {
    let eventHandlers = this.handlers[event];

    if(!eventHandlers) {
      return;
    }

    for (let eventHandler of eventHandlers) {
      eventHandler(...args);
    }
  }
}
