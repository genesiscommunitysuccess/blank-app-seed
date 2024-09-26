import 'jest-preset-angular/setup-jest';

// Mock window.matchMedia
Object.defineProperty(window, 'matchMedia', {
  writable: true,
  value: (query: string) => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: jest.fn(), // Deprecated
    removeListener: jest.fn(), // Deprecated
    addEventListener: jest.fn(),
    removeEventListener: jest.fn(),
    dispatchEvent: jest.fn(),
  }),
});

// Mock BroadcastChannel
class MockBroadcastChannel {
  name: string;
  onmessage: ((this: BroadcastChannel, ev: MessageEvent) => any) | null = null;
  onmessageerror: ((this: BroadcastChannel, ev: MessageEvent) => any) | null = null;

  constructor(name: string) {
    this.name = name;
  }

  postMessage(message: any) {
    if (this.onmessage) {
      this.onmessage({ data: message } as MessageEvent);
    }
  }

  close() {}

  addEventListener() {}
  removeEventListener() {}
  dispatchEvent() {
    return false;
  }
}

Object.defineProperty(window, 'BroadcastChannel', {
  writable: true,
  value: MockBroadcastChannel,
});
