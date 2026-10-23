import { Connect } from '@genesislcap/foundation-comms';
import { DI } from '@genesislcap/web-core';
import { act, render, screen } from '@testing-library/react';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import DefaultLayout from './DefaultLayout';

/** The part of the stand-in `Connect` this test drives. */
type MockConnect = {
  isConnected: boolean;
  setConnected: (connected: boolean) => void;
};

/**
 * A stand-in for the shared `Connect`, with only what the layout reads: the current status and
 * the `isConnected$` stream that announces each change. Built inside the factory because the
 * layout resolves it from the DI container at import time, before this file's body runs.
 */
jest.mock('@genesislcap/web-core', () => {
  const listeners = new Set<(connected: boolean) => void>();
  const connect = {
    isConnected: false,
    isConnected$: {
      subscribe: (listener: (connected: boolean) => void) => {
        listeners.add(listener);
        return { unsubscribe: () => listeners.delete(listener) };
      },
    },
    setConnected: (connected: boolean) => {
      connect.isConnected = connected;
      listeners.forEach((listener) => listener(connected));
    },
  };
  return { DI: { getOrCreateDOMContainer: () => ({ get: () => connect }) } };
});

// The real modules boot the design system and the comms runtime, which this test has no reason
// to load; the layout only needs the names it imports from them.
jest.mock('@genesislcap/foundation-comms', () => ({ Connect: Symbol('Connect') }));
jest.mock('@genesislcap/foundation-ui', () => ({ getNavItems: () => [] }));
jest.mock('@genesislcap/foundation-utils', () => ({ LOGOUT_URL: 'gwf/logout' }));
jest.mock('@genesislcap/rapid-design-system', () => ({
  applyMode: jest.fn(),
  injectThemeStyles: jest.fn(),
  nextMode: jest.fn(),
  resolveInitialMode: jest.fn(),
}));
jest.mock('../../styles/active-theme', () => ({ activeTheme: {}, modeToggleEnabled: false }));
jest.mock('../../pbc/utils', () => ({ registerStylesTarget: jest.fn() }));
jest.mock('../../store/RoutesContext', () => ({ useRoutesContext: () => [] }));

// How a renderer fills its target on reconnect is its own business; a placeholder per target
// is enough to see whether the layout keeps it mounted.
jest.mock('../../pbc/elementsRenderer', () => ({ target }: { target: string[] }) => (
  <div data-testid={`pbc-${target[0]}`} />
));

const connect = DI.getOrCreateDOMContainer().get(Connect) as unknown as MockConnect;

/** One PBC target per `PBCElementsRenderer` the layout renders, the header's own included. */
const PBC_TARGET_COUNT = 5;

const header = () => document.querySelector('foundation-header');
const pbcTargets = () => screen.queryAllByTestId(/^pbc-/);

const renderLayout = () =>
  render(
    <MemoryRouter>
      <Routes>
        <Route element={<DefaultLayout />}>
          <Route index element={<p data-testid="page" />} />
        </Route>
      </Routes>
    </MemoryRouter>,
  );

describe('DefaultLayout', () => {
  beforeEach(() => {
    connect.setConnected(false);
  });

  test('mounts the header and the PBC targets once the app first connects', () => {
    renderLayout();

    expect(header()).toBeNull();
    expect(pbcTargets()).toHaveLength(0);
    expect(screen.getByTestId('page')).toBeInTheDocument();

    act(() => connect.setConnected(true));

    expect(header()).toBeInTheDocument();
    expect(pbcTargets()).toHaveLength(PBC_TARGET_COUNT);
  });

  test('keeps the header and the PBC targets mounted while the socket reconnects', () => {
    connect.setConnected(true);
    renderLayout();
    const headerBefore = header();
    const targetsBefore = pbcTargets();
    expect(headerBefore).toBeInTheDocument();
    expect(targetsBefore).toHaveLength(PBC_TARGET_COUNT);

    // A session refresh replaces the socket: the status reads disconnected until the new one opens.
    act(() => connect.setConnected(false));

    expect(header()).toBe(headerBefore);
    targetsBefore.forEach((target) => expect(target).toBeInTheDocument());

    act(() => connect.setConnected(true));

    expect(header()).toBe(headerBefore);
    targetsBefore.forEach((target) => expect(target).toBeInTheDocument());
    expect(pbcTargets()).toHaveLength(PBC_TARGET_COUNT);
  });
});
