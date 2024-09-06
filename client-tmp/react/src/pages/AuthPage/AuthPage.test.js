import { render } from '@testing-library/react';
import AuthPage from './AuthPage';

test('renders AuthPage component', () => {
  const { container } = render(<AuthPage />);
  const authPageElement = container.querySelector('.auth-page');
  expect(authPageElement).toBeInTheDocument();
  const clientAppLoginElement = container.querySelector('client-app-login');
  expect(clientAppLoginElement).toBeInTheDocument();
});