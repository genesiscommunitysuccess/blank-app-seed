import { render } from '@testing-library/react';
import AuthPage from './AuthPage';

test('renders AuthPage component', () => {
  const { container } = render(<AuthPage />);
  const authPageElement: Element | null = container.querySelector('.auth-page');
  expect(authPageElement).toBeInTheDocument();
  const clientAppLoginElement: Element | null = container.querySelector('client-app-login');
  expect(clientAppLoginElement).toBeInTheDocument();
});