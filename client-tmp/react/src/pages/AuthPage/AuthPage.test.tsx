import { render } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import AuthPage from './AuthPage';

// The login module pulls in the whole foundation-auth runtime (design-system registration,
// fast-router); this test only asserts the page shell renders.
jest.mock('../../share/foundation-login.ts', () => ({
  configureFoundationLogin: jest.fn(),
}));

test('renders AuthPage component', () => {
  const { container } = render(
    <MemoryRouter>
      <AuthPage />
    </MemoryRouter>,
  );
  const authPageElement: Element | null = container.querySelector('.auth-page');
  expect(authPageElement).toBeInTheDocument();
  const clientAppLoginElement: Element | null = container.querySelector('client-app-login');
  expect(clientAppLoginElement).toBeInTheDocument();
});
