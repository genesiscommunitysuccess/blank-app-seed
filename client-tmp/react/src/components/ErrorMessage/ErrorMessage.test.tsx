import { render, screen } from '@testing-library/react';
import { default as ErrorMessage, ErrorMessageProps } from './ErrorMessage';

describe('ErrorMessage Component', () => {
  const message: string = 'Test Error Message';

  test('renders the message as a div by default', () => {
    render(<ErrorMessage message={message} />);
    const displayedMessage: HTMLElement = screen.getByText(message);
    expect(displayedMessage.tagName).toBe('DIV');
    expect(displayedMessage).toBeInTheDocument();
  });

  test('renders the message as an h1 element when elementType is "h1"', () => {
    render(<ErrorMessage message={message} elementType="h1" />);
    const displayedMessage: HTMLElement = screen.getByRole('heading', { level: 1 });
    expect(displayedMessage.tagName).toBe('H1');
    expect(displayedMessage).toBeInTheDocument();
  });

  test('renders the message as a p element when elementType is "p"', () => {
    render(<ErrorMessage message={message} elementType="p" />);
    const displayedMessage: HTMLElement = screen.getByText(message);
    expect(displayedMessage.tagName).toBe('P');
    expect(displayedMessage).toBeInTheDocument();
  });

  test('applies the correct styles to the error message wrapper', () => {
    render(<ErrorMessage message={message} />);
    const wrapper: HTMLElement | null = screen.getByText(message).closest('section');
    expect(wrapper).toHaveStyle(`
      display: flex;
      flex-direction: column;
      justify-content: center;
      align-items: center;
      height: 100%;
      width: 100%;
    `);
  });

  test('applies the correct styles to the error message itself', () => {
    render(<ErrorMessage message={message} />);
    const displayedMessage: HTMLElement = screen.getByText(message);
    const messageWrapper: HTMLElement | null = displayedMessage.parentElement;
    
    expect(messageWrapper).toBeInTheDocument();
    expect(messageWrapper).toHaveStyle(`
      color: var(--neutral-foreground-rest);
      background-color: var(--neutral-layer-4);
      border-color: var(--error-color);
      border-radius: 7px;
      border-style: solid;
      border-width: 4px;
      padding: 5px;
      margin: 15px;
      text-align: center;
      width: fit-content;
      align-self: center;
      height: auto;
      max-height: 100%;
    `);
  });

  test('renders nothing if the message is an empty string', () => {
    const { container }: { container: HTMLElement } = render(<ErrorMessage message="" />);
    expect(container.firstChild).toBeNull();
  });

  test('renders the correct element type for various elementType props', () => {
    const elementTypes: ErrorMessageProps['elementType'][] = ['h1', 'h2', 'h3', 'h4', 'h5', 'h6', 'p', 'span', 'div'];
    elementTypes.forEach((elementType: ErrorMessageProps['elementType']) => {
      const { container }: { container: HTMLElement } = render(<ErrorMessage message={message} elementType={elementType} />);
      const displayedMessage: HTMLElement | null = container.querySelector(elementType as string);
      expect(displayedMessage).toBeInTheDocument();
      expect(displayedMessage?.tagName).toBe((elementType as string).toUpperCase());
    });
  });

  test('renders the message as a div element when elementType is unknown', () => {
    render(<ErrorMessage message={message} />);
    const displayedMessage: HTMLElement = screen.getByText(message);
    expect(displayedMessage.tagName).toBe('DIV');
    expect(displayedMessage).toBeInTheDocument();
  });

  test('renders nothing if the message is null', () => {
    const { container }: { container: HTMLElement } = render(<ErrorMessage />);
    expect(container.firstChild).toBeNull();
  });

  test('renders nothing if the message is undefined', () => {
    const { container }: { container: HTMLElement } = render(<ErrorMessage message={undefined} />);
    expect(container.firstChild).toBeNull();
  });
});