export const errorBoundaryStyles = `
.error-boundary,
.error-boundary__tile-wrap {
  width: 100%;
  height: 100%;
}

.error-boundary {
  --eb-bg: #f6f8fb;
  --eb-surface: #ffffff;
  --eb-text: #18212f;
  --eb-text-muted: #5f6f84;
  --eb-border: #d3dae6;
  --eb-accent: #2f6fed;
  --eb-accent-hover: #255dcc;
  --eb-accent-foreground: #ffffff;
  --eb-error: #c53d3d;
  --eb-focus: #2f6fed;
  --eb-font: 'Segoe UI', 'Helvetica Neue', Arial, sans-serif;

  box-sizing: border-box;
  display: flex;
  flex-direction: column;
  gap: 12px;
  align-items: flex-start;
  padding: 16px;
  background: var(--eb-bg);
  color: var(--eb-text);
}

.error-boundary__top,
.error-boundary__title,
.error-boundary__subtitle,
.error-boundary__hint,
.error-boundary__details,
.error-boundary__actions,
.error-boundary__manual-copy-help {
  width: 100%;
}

.error-boundary__top {
  display: flex;
  width: 100%;
  align-items: center;
  justify-content: space-between;
  gap: 10px;
  flex-wrap: wrap;
}

.error-boundary__status {
  display: inline-flex;
  align-items: center;
  border: 1px solid var(--eb-error);
  border-radius: 999px;
  padding: 5px 10px;
  font-family: var(--eb-font);
  text-transform: uppercase;
  letter-spacing: 0.13em;
  font-size: 11px;
  font-weight: 700;
  color: var(--eb-error);
  background: #fff4f4;
}

.error-boundary__reference {
  font-family: 'Menlo', 'Consolas', 'Liberation Mono', monospace;
  font-size: 11px;
  letter-spacing: 0.08em;
  color: var(--eb-text-muted);
  text-transform: uppercase;
}

.error-boundary__title {
  margin: 0;
  font-family: var(--eb-font);
  font-size: clamp(22px, 3vw, 30px);
  line-height: 1.15;
  font-weight: 700;
  color: var(--eb-text);
  text-wrap: balance;
}

.error-boundary__subtitle {
  margin: 0;
  max-width: 80ch;
  font-family: var(--eb-font);
  color: var(--eb-text);
  line-height: 1.45;
}

.error-boundary__hint {
  margin: -2px 0 2px;
  font-family: var(--eb-font);
  color: var(--eb-text-muted);
  font-size: 13px;
}

.error-boundary__details {
  box-sizing: border-box;
  width: 100%;
  min-height: 190px;
  max-height: 360px;
  padding: 12px;
  border: 1px solid var(--eb-border);
  border-radius: 10px;
  background: var(--eb-surface);
  color: var(--eb-text);
  font-family: 'Menlo', 'Consolas', 'Liberation Mono', 'Courier New', monospace;
  font-size: 12px;
  line-height: 1.5;
  resize: vertical;
}

.error-boundary__actions {
  display: flex;
  gap: 10px;
  flex-wrap: wrap;
}

.error-boundary__button {
  border: 1px solid var(--eb-accent);
  border-radius: 999px;
  background: var(--eb-accent);
  color: var(--eb-accent-foreground);
  cursor: pointer;
  padding: 9px 16px;
  font-family: var(--eb-font);
  font-size: 12px;
  font-weight: 700;
  letter-spacing: 0.04em;
  text-transform: uppercase;
  transition: transform 180ms ease, background-color 180ms ease;
}

.error-boundary__button--secondary {
  border-color: var(--eb-border);
  background: var(--eb-surface);
  color: var(--eb-text);
}

.error-boundary__button:hover {
  background: var(--eb-accent-hover);
  transform: translateY(-1px);
}

.error-boundary__button--secondary:hover {
  background: #eef2f8;
}

.error-boundary__button:focus-visible {
  outline: 2px solid var(--eb-focus);
  outline-offset: 2px;
}

.error-boundary__manual-copy-help {
  margin: 2px 0 0;
  font-size: 13px;
  color: var(--eb-text-muted);
  line-height: 1.4;
}
`;
