import React from 'react';

const styles = {
  errorMessageWrapper: {
    display: 'flex',
    flexDirection: 'column' as const,
    justifyContent: 'center',
    alignItems: 'center',
    height: '100%',
    width: '100%',
  },
  errorMessage: {
    color: 'var(--neutral-foreground-rest)',
    backgroundColor: 'var(--neutral-layer-4)',
    borderColor: 'var(--error-color)',
    borderRadius: '7px',
    borderStyle: 'solid' as const,
    borderWidth: '4px',
    padding: '5px',
    margin: '15px',
    textAlign: 'center' as const,
    width: 'fit-content',
    alignSelf: 'center',
    height: 'auto',
    maxHeight: '100%'
  },
};

export interface ErrorMessageProps {
  elementType?: 'div' | 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6' | 'p' | 'span';
  message?: string;
}

const ErrorMessage: React.FC<ErrorMessageProps> = ({ elementType = 'div', message = '' }) => {
  const ElementType = elementType;

  return message && message !== '' && (
    <section style={styles.errorMessageWrapper}>
      <div style={styles.errorMessage}>
        {(() => {
          switch (ElementType) {
            case 'h1':
              return <h1>{message}</h1>;
            case 'h2':
              return <h2>{message}</h2>;
            case 'h3':
              return <h3>{message}</h3>;
            case 'h4':
              return <h4>{message}</h4>;
            case 'h5':
              return <h5>{message}</h5>;
            case 'h6':
              return <h6>{message}</h6>;
            case 'p':
              return <p>{message}</p>;
            case 'span':
              return <span>{message}</span>;
            default:
              return <div>{message}</div>;
          }
        })()}
      </div>
    </section>
  );
};

export default ErrorMessage;