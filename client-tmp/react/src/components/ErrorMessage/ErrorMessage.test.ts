import { render, screen } from '@testing-library/react';
import ErrorMessage from './ErrorMessage';

describe('ErrorMessage Component', () => {
  const message: string = 'Test Error Message';

  test('renders the message as a div by default', () => {
    render(<ErrorMessage message={message} />);
    const displayedMessage = screen.getByText(message);
    expect(displayedMessage.tagName).toBe('DIV');
    expect(displayedMessage).toBeInTheDocument();
  });

  test('renders the message as an h1 element when elementType is "h1"', () => {
    render(<ErrorMessage message={message} elementType="h1" />);
    const displayedMessage = screen.getByRole('heading', { level: 1 });
    expect(displayedMessage.tagName).toBe('H1');
    expect(displayedMessage).toBeInTheDocument();
  });

  test('renders the message as a p element when elementType is "p"', () => {
    render(<ErrorMessage message={message} elementType="p" />);
    const displayedMessage = screen.getByText(message);
    expect(displayedMessage.tagName).toBe('P');
    expect(displayedMessage).toBeInTheDocument();
  });

  test('applies the correct styles to the error message wrapper', () => {
    render(<ErrorMessage message={message} />);
    const wrapper = screen.getByText(message).parentElement;
    expect(wrapper).toHaveStyle('display: flex');
    expect(wrapper).toHaveStyle('flex-direction: column');
    expect(wrapper).toHaveStyle('justify-content: center');
    expect(wrapper).toHaveStyle('align-items: center');
    expect(wrapper).toHaveStyle('height: 100%');
    expect(wrapper).toHaveStyle('width: 100%');
  });

  test('renders the message as a div element when elementType is unknown', () => {
    render(<ErrorMessage message={message} elementType="unknown" />);
    const displayedMessage = screen.getByText(message);
    expect(displayedMessage.tagName).toBe('DIV');
    expect(displayedMessage).toBeInTheDocument();
  });

  test('renders nothing if the message is null', () => {
    const { container } = render(<ErrorMessage message={null} />);
    expect(container.firstChild).toBeNull();
  });

  test('renders nothing if the message is undefined', () => {
    const { container } = render(<ErrorMessage message={undefined} />);
    expect(container.firstChild).toBeNull();
  });
});