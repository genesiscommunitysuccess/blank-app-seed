import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import ErrorMessage from './ErrorMessage';

describe('ErrorMessage Component', () => {
  const message = 'Test Error Message';

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
    const wrapper = screen.getByText(message).closest('section');
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
    const displayedMessage = screen.getByText(message);
    const messageWrapper = displayedMessage.parentElement;
    
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
    const { container } = render(<ErrorMessage message="" />);
    expect(container.firstChild).toBeNull();
  });

  test('renders the correct element type for various elementType props', () => {
    const elementTypes = ['h1', 'h2', 'h3', 'h4', 'h5', 'h6', 'p', 'span', 'div'];
    elementTypes.forEach((elementType) => {
      const { container } = render(<ErrorMessage message={message} elementType={elementType} />);
      const displayedMessage = container.querySelector(elementType);
      expect(displayedMessage).toBeInTheDocument();
      expect(displayedMessage.tagName).toBe(elementType.toUpperCase());
    });
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