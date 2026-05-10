// =============================================================================
// Traveloop — Error Boundary Component
// =============================================================================
// Reusable React error boundary for catching render errors in component trees.
// Provides a fallback UI with retry action.
// =============================================================================

'use client';

import { Component, type ErrorInfo, type ReactNode } from 'react';
import { AlertTriangle, RefreshCw } from 'lucide-react';

interface ErrorBoundaryProps {
  children: ReactNode;
  /** Custom fallback component (optional) */
  fallback?: ReactNode;
  /** Called when an error is caught */
  onError?: (error: Error, errorInfo: ErrorInfo) => void;
}

interface ErrorBoundaryState {
  hasError: boolean;
  error: Error | null;
}

export class ErrorBoundary extends Component<
  ErrorBoundaryProps,
  ErrorBoundaryState
> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo): void {
    // Log to console in development
    console.error('[ErrorBoundary] Caught error:', error, errorInfo);

    // Call optional error handler (e.g., Sentry reporting)
    this.props.onError?.(error, errorInfo);
  }

  handleRetry = (): void => {
    this.setState({ hasError: false, error: null });
  };

  render(): ReactNode {
    if (this.state.hasError) {
      // Use custom fallback if provided
      if (this.props.fallback) {
        return this.props.fallback;
      }

      // Default fallback UI
      return (
        <div className="flex flex-col items-center justify-center py-16">
          <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-destructive/10">
            <AlertTriangle className="h-7 w-7 text-destructive" />
          </div>
          <h2 className="mb-2 text-lg font-semibold text-foreground">
            Something went wrong
          </h2>
          <p className="mb-6 max-w-sm text-center text-sm text-muted-foreground">
            An unexpected error occurred. Please try again or refresh the page.
          </p>
          {process.env.NODE_ENV === 'development' && this.state.error && (
            <pre className="mb-6 max-w-lg overflow-auto rounded-lg bg-muted p-4 text-xs text-muted-foreground">
              {this.state.error.message}
            </pre>
          )}
          <button
            onClick={this.handleRetry}
            className="inline-flex items-center gap-2 rounded-lg bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90"
          >
            <RefreshCw className="h-4 w-4" />
            Try Again
          </button>
        </div>
      );
    }

    return this.props.children;
  }
}
