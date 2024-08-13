import { useEffect } from 'react';
import {
  unstable_HistoryRouter as HistoryRouter,
  Routes,
  Route,
  useLocation,
} from 'react-router-dom';
import { history } from './utils/history';
import LayoutWrapper from './layouts/LayoutWrapper';
import { routeLayouts } from './config';
import AuthGuard from './guards/AuthGuard';
import { AuthProvider } from './store/AuthContext';
// Pages Components
import AuthPage from './pages/auth/AuthPage';
{{#each routes}}
import {{pascalCase this.name}} from './pages/{{kebabCase this.name}}/{{pascalCase this.name}}';
{{/each}}
{{#if FDC3.channels.length}}
import { listenToChannel, onFDC3Ready } from './utils';
{{/if}}
// Genesis Components
import './share/genesis-components';

const LayoutWithLocation = () => {
  const location = useLocation();
  const layout = routeLayouts[location.pathname] || 'default';
  {{#if FDC3.channels.length}}
  useEffect(() => {
    {{#each FDC3.channels}}
    listenToChannel('{{this.name}}', '{{this.type}}', (result) => {
      console.log('Received FDC3 channel message on: {{this.name}} channel, type: {{this.type}}', result);
      // TODO: Add your listener logic here
      // E.g. open a modal or route to specific page: Route.path.push(`[Route name]`);
    });
    {{/each}}
    
    return () => {
      console.log('Component is being unmounted');
    };
  }, []);
  {{/if}}

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
