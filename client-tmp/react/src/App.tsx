import React from 'react';
import {
  unstable_HistoryRouter as HistoryRouter,
  Routes,
  Route,
  useLocation,
} from 'react-router-dom';
import history from './utils/history';
import LayoutWrapper from './layouts/LayoutWrapper';
import { routeLayouts } from './config';
import AuthGuard from './guards/AuthGuard';
import { AuthProvider } from './store/AuthContext';
// Pages Components
import AuthPage from './pages/auth/AuthPage';
{{#each routes}}
import {{pascalCase this.name}} from './pages/{{kebabCase this.name}}/{{pascalCase this.name}}';
{{/each}}
// Genesis Components
import './share/genesis-components';

const LayoutWithLocation = () => {
  const location = useLocation();
  const layout = routeLayouts[location.pathname] || 'default';

  let pageComponent;

  switch (location.pathname) {
    case '/auth':
      pageComponent = <AuthPage />;
      break;
  {{#each routes}}
    case '/{{kebabCase this.name}}':
      pageComponent = <{{pascalCase this.name}} />;
      break;
  {{/each}}
    default:
      pageComponent = <AuthPage />;
  }

  if (
    location.pathname === '/auth' ||
    location.pathname === '/'
  ) {
    return <LayoutWrapper layout={layout}>{pageComponent}</LayoutWrapper>;
  } else {
    return (
      <AuthGuard>
        <LayoutWrapper layout={layout}>{pageComponent}</LayoutWrapper>
      </AuthGuard>
    );
  }
};

const App: React.FC = () => {
  return (
    <AuthProvider>
      <HistoryRouter history={history}>
        <Routes>
          <Route path="*" element={<LayoutWithLocation />} />
        </Routes>
      </HistoryRouter>
    </AuthProvider>
  );
};

export default App;
