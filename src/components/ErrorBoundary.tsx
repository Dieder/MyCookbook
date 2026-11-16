import { Component, ErrorInfo, ReactNode } from 'react';

interface ErrorBoundaryProps {
  children: ReactNode;
}

interface ErrorBoundaryState {
  hasError: boolean;
  message: string;
}

export class ErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = { hasError: false, message: '' };
  }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return {
      hasError: true,
      message: error.message || 'An unexpected error occurred.',
    };
  }

  componentDidCatch(error: Error, info: ErrorInfo) {
    console.error('Application ErrorBoundary caught:', error, info);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-[var(--bg-paper)] text-[var(--text-ink)] flex items-center justify-center p-6">
          <div className="max-w-lg w-full border border-[var(--border-line)] bg-[var(--bg-surface)] p-8 space-y-4">
            <p className="text-xs font-mono uppercase tracking-[0.14em] text-[var(--accent-secondary)]">
              Kitchen Recovery
            </p>
            <h1 className="font-display text-2xl text-[var(--text-ink)]">
              Something went wrong while loading this page.
            </h1>
            <p className="text-sm font-serif text-[var(--text-muted)] leading-relaxed">
              {this.state.message}
            </p>
            <button
              type="button"
              onClick={() => window.location.reload()}
              className="px-4 py-2 bg-[var(--accent-primary)] text-[var(--accent-primary-fg)] text-xs font-mono cursor-pointer"
            >
              Reload Cookbook
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
