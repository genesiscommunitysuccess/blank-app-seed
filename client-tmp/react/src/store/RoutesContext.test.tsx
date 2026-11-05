import type { AppRouteConfig, PbcRouteInput } from '@genesislcap/foundation-react-utils/router';
import { fireEvent, render, screen } from '@testing-library/react';
import { useState } from 'react';
import { RoutesProvider, useRoutesContext } from './RoutesContext';

/**
 * `getApp()` resolves the shell's `App` singleton out of the DI DOM container, which this
 * unit test has no reason to boot. The stand-in mirrors the only thing the provider reads:
 * a plain `routes` array field, stored once by the real `App` and only ever reassigned
 * (registerAssets/deregisterAssets) — so identity behaves here exactly as it does in the app.
 */
const mockShellApp: { routes: PbcRouteInput[] } = { routes: [] };

jest.mock('@genesislcap/foundation-shell/app', () => ({
  getApp: () => mockShellApp,
}));

// Route pages are inert payload for this test — the provider only parks them in the route
// table as `element` values, never renders them — while dragging in the foundation-auth
// runtime and, for generated dashboards/charts, chart libraries jest cannot transform.
// Stubbed here; the route table itself and `mergePbcRoutes` stay real.
jest.mock('../pages/AuthPage/AuthPage', () => () => null);
jest.mock('../pages/NotPermittedPage/NotPermittedPage', () => () => null);
{{#each routes}}
jest.mock('../pages/{{pascalCase this.name}}/{{pascalCase this.name}}', () => () => null);
{{/each}}

/** Every context value the consumer below saw, in render order. */
const captured: AppRouteConfig[][] = [];

const RoutesConsumer = () => {
  const routes = useRoutesContext();
  captured.push(routes);
  return null;
};

/** A fresh element tree per call, so React cannot bail out of re-rendering the provider. */
const providerTree = () => (
  <RoutesProvider>
    <RoutesConsumer />
  </RoutesProvider>
);

const expectSingleIdentity = () => {
  // initial render plus at least two re-renders
  expect(captured.length).toBeGreaterThan(2);
  captured.forEach((value) => {
    expect(value).toBe(captured[0]);
  });
};

describe('RoutesProvider', () => {
  beforeEach(() => {
    captured.length = 0;
    mockShellApp.routes = [];
  });

  test('hands consumers one context value identity across re-renders', () => {
    const { rerender } = render(providerTree());

    rerender(providerTree());
    rerender(providerTree());

    expectSingleIdentity();
  });

  test('hands consumers one context value identity when a parent state change cascades in', () => {
    const Parent = () => {
      const [tick, setTick] = useState(0);
      return (
        <RoutesProvider>
          <button type="button" onClick={() => setTick(tick + 1)}>
            tick {tick}
          </button>
          <RoutesConsumer />
        </RoutesProvider>
      );
    };

    render(<Parent />);
    const tickButton = screen.getByRole('button');
    fireEvent.click(tickButton);
    fireEvent.click(tickButton);

    expectSingleIdentity();
  });

  test('recomputes the context value when the app reassigns its routes', () => {
    const { rerender } = render(providerTree());
    const beforeReassign = captured[captured.length - 1];

    mockShellApp.routes = [{ path: 'pbc-page', settings: { permissionCode: 'PBC_VIEW' } }];
    rerender(providerTree());

    const afterReassign = captured[captured.length - 1];
    expect(afterReassign).not.toBe(beforeReassign);
    expect(afterReassign.map((route) => route.path)).toContain('/pbc-page');
  });
});
