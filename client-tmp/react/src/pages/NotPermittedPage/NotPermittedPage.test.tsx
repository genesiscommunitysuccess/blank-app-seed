import { render, screen } from '@testing-library/react';
import NotPermittedPage from './NotPermittedPage';

jest.mock('@/components/ErrorMessage/ErrorMessage', () => {
  return jest.fn((props: { message: string }) => <h1 data-testid="error-message">{props.message}</h1>);
});

describe('NotPermittedPage Component', () => {
  test('renders the ErrorMessage component with correct props', () => {
    render(<NotPermittedPage />);
    
    const errorMessage: HTMLElement = screen.getByTestId('error-message');
    expect(errorMessage).toBeInTheDocument();
    expect(errorMessage.tagName).toBe('H1');
    expect(errorMessage).toHaveTextContent('You do not have permission to access this part of the application, please contact your administrator.');
  });
});