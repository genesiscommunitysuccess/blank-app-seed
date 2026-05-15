import React, { useState } from 'react';
import { errorBoundaryStyles } from './ErrorBoundaryStyles';

type ErrorBoundaryScope = 'application' | 'tile';

type ErrorBoundaryFallbackProps = {
  scope: ErrorBoundaryScope;
  referenceId: string;
  title: string;
  subtitle: string;
  details: string;
  onRetry: () => void;
};

type BaseErrorBoundaryProps = {
  scope: ErrorBoundaryScope;
  title: string;
  tileRegistration?: string;
  children: React.ReactNode;
};

type BaseErrorBoundaryState = {
  hasError: boolean;
  error: Error | null;
  componentStack: string;
  capturedAt: string;
  referenceId: string;
};

const initialBoundaryState: BaseErrorBoundaryState = {
  hasError: false,
  error: null,
  componentStack: '',
  capturedAt: '',
  referenceId: '',
};

const toError = (value: unknown): Error => {
  if (value instanceof Error) {
    return value;
  }

  if (typeof value === 'string') {
    return new Error(value);
  }

  try {
    return new Error(JSON.stringify(value));
  } catch {
    return new Error('Unknown non-serializable error');
  }
};

const createReferenceId = (): string => {
  const timestamp = new Date().toISOString().split(':').join('-');
  // oxlint-disable-next-line no-magic-numbers -- base-36 encoding with 6-char slice is a well-known ID generation pattern
  const random = Math.random().toString(36).slice(2, 8).toUpperCase();
  return `APP-${timestamp}-${random}`;
};

const ErrorBoundaryFallback: React.FC<ErrorBoundaryFallbackProps> = ({
  scope,
  referenceId,
  title,
  subtitle,
  details,
  onRetry,
}) => {
  const [copied, setCopied] = useState(false);
  const [copyHelpVisible, setCopyHelpVisible] = useState(false);

  const COPY_RESET_DELAY_MS = 2_000;

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(details);
      setCopied(true);
      setCopyHelpVisible(false);
      window.setTimeout(() => {
        setCopied(false);
      }, COPY_RESET_DELAY_MS);
    } catch {
      setCopyHelpVisible(true);
    }
  };

  return (
    <section className="error-boundary" role="alert">
      <style>{errorBoundaryStyles}</style>
      <div className="error-boundary__top">
        <span className="error-boundary__status">
          {scope === 'application' ? 'Application incident' : 'Tile incident'}
        </span>
        <span className="error-boundary__reference">Ref: {referenceId}</span>
      </div>
      <h2 className="error-boundary__title">{title}</h2>
      <p className="error-boundary__subtitle">{subtitle}</p>
      <p className="error-boundary__hint">
        Tip: copy diagnostics and paste directly into Cursor to speed up debugging.
      </p>
      <textarea
        className="error-boundary__details"
        readOnly
        value={details}
        aria-label="Error diagnostics details"
      />
      <div className="error-boundary__actions">
        <button type="button" className="error-boundary__button" onClick={onRetry}>
          Retry
        </button>
        <button
          type="button"
          className="error-boundary__button error-boundary__button--secondary"
          onClick={handleCopy}
        >
          {copied ? 'Copied' : 'Copy diagnostics'}
        </button>
      </div>
      {copyHelpVisible ? (
        <p className="error-boundary__manual-copy-help">
          Clipboard access is blocked in this browser context. Please select the diagnostics text
          and copy it manually.
        </p>
      ) : null}
    </section>
  );
};

class BaseErrorBoundary extends React.Component<BaseErrorBoundaryProps, BaseErrorBoundaryState> {
  public constructor(props: BaseErrorBoundaryProps) {
    super(props);
    this.state = initialBoundaryState;
  }

  public static getDerivedStateFromError(error: unknown): Partial<BaseErrorBoundaryState> {
    const normalized = toError(error);
    return {
      hasError: true,
      error: normalized,
      capturedAt: new Date().toISOString(),
      referenceId: createReferenceId(),
    };
  }

  public componentDidCatch(error: unknown, errorInfo: React.ErrorInfo): void {
    const normalized = toError(error);
    this.setState({
      componentStack: errorInfo.componentStack ?? '',
    });

    console.error(`[${this.props.scope}] error boundary captured an error`, {
      referenceId: this.state.referenceId,
      title: this.props.title,
      tileRegistration: this.props.tileRegistration,
      error: normalized,
      componentStack: errorInfo.componentStack,
    });
  }

  private readonly handleRetry = (): void => {
    this.setState(initialBoundaryState);
  };

  public render(): React.ReactNode {
    if (!this.state.hasError || !this.state.error) {
      return this.props.children;
    }

    const { scope, title, tileRegistration } = this.props;
    const diagnostics = [
      `Reference: ${this.state.referenceId}`,
      `Scope: ${scope}`,
      `Title: ${title}`,
      `Tile registration: ${tileRegistration ?? 'N/A'}`,
      `Captured at: ${this.state.capturedAt}`,
      `URL: ${window.location.href}`,
      `User agent: ${window.navigator.userAgent}`,
      `Error name: ${this.state.error.name}`,
      `Error message: ${this.state.error.message}`,
      'Error stack:',
      this.state.error.stack ?? 'No stack available',
      'Component stack:',
      this.state.componentStack || 'No component stack available',
    ].join('\n');

    const fallbackTitle =
      scope === 'application' ? 'Something went wrong' : `Something went wrong in "${title}"`;
    const fallbackSubtitle =
      scope === 'application'
        ? 'The app hit an unexpected error. You can retry or copy diagnostics for a fast fix.'
        : 'This tile crashed, but the rest of the application keeps running. Retry or copy diagnostics.';

    return (
      <ErrorBoundaryFallback
        scope={scope}
        referenceId={this.state.referenceId}
        title={fallbackTitle}
        subtitle={fallbackSubtitle}
        details={diagnostics}
        onRetry={this.handleRetry}
      />
    );
  }
}

type AppErrorBoundaryProps = {
  children: React.ReactNode;
};

export const AppErrorBoundary: React.FC<AppErrorBoundaryProps> = ({ children }) => {
  return (
    <BaseErrorBoundary scope="application" title="Application">
      {children}
    </BaseErrorBoundary>
  );
};

type TileErrorBoundaryProps = {
  title: string;
  tileRegistration: string;
  children: React.ReactNode;
};

export const TileErrorBoundary: React.FC<TileErrorBoundaryProps> = ({
  title,
  tileRegistration,
  children,
}) => {
  return (
    <BaseErrorBoundary scope="tile" title={title} tileRegistration={tileRegistration}>
      {children}
    </BaseErrorBoundary>
  );
};

export const withTileErrorBoundary = (
  Component: React.ComponentType,
  title: string,
  tileRegistration: string,
): React.FC => {
  const WrappedWithErrorBoundary: React.FC = () => {
    return (
      <TileErrorBoundary title={title} tileRegistration={tileRegistration}>
        <Component />
      </TileErrorBoundary>
    );
  };

  WrappedWithErrorBoundary.displayName = `WithTileErrorBoundary(${title}:${tileRegistration}:${Component.displayName || Component.name || 'TileComponent'})`;
  return WrappedWithErrorBoundary;
};
