import { Component, type ReactNode } from 'react';
import { AlertTriangle, RefreshCw } from 'lucide-react';

interface ErrorBoundaryProps {
  children: ReactNode;
  fallback?: ReactNode;
}

interface ErrorBoundaryState {
  hasError: boolean;
  error: Error | null;
}

export class ErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
  state: ErrorBoundaryState = { hasError: false, error: null };

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return { hasError: true, error };
  }

  handleRefresh = () => {
    window.location.reload();
  };

  handleReset = () => {
    this.setState({ hasError: false, error: null });
  };

  render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback;
      }

      return (
        <div className="min-h-screen bg-surface-100 flex items-center justify-center p-4 sm:p-8">
          <div className="max-w-md w-full text-center">
            <div className="inline-flex items-center justify-center w-16 h-16 sm:w-20 sm:h-20 rounded-2xl bg-amber-100 text-amber-600 mb-6 shadow-inner">
              <AlertTriangle className="w-8 h-8 sm:w-10 sm:h-10" aria-hidden="true" />
            </div>

            <h1 className="text-xl sm:text-2xl font-bold font-display text-slate-900 mb-3">
              Oups, quelque chose s'est mal passé
            </h1>

            <p className="text-sm sm:text-base text-slate-600 mb-8 leading-relaxed">
              Une erreur inattendue est survenue. Vous pouvez rafraîchir la page pour réessayer.
            </p>

            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <button
                type="button"
                onClick={this.handleRefresh}
                className="inline-flex items-center justify-center gap-2 rounded-xl bg-brand-600 px-5 py-3 text-sm font-semibold text-white shadow-lg shadow-brand-500/30 transition-all hover:bg-brand-700 hover:-translate-y-0.5 active:scale-[0.98] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-500"
              >
                <RefreshCw className="h-4 w-4" aria-hidden="true" />
                Rafraîchir la page
              </button>
              <button
                type="button"
                onClick={this.handleReset}
                className="inline-flex items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white px-5 py-3 text-sm font-semibold text-slate-700 shadow-sm transition-all hover:bg-slate-50 hover:-translate-y-0.5 active:scale-[0.98] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-500"
              >
                Réessayer sans rafraîchir
              </button>
            </div>

            {this.state.error && (
              <details className="mt-8 text-left">
                <summary className="cursor-pointer text-xs font-medium text-slate-400 hover:text-slate-600 transition-colors">
                  Détails techniques
                </summary>
                <pre className="mt-2 rounded-xl bg-slate-100 p-4 text-xs text-slate-700 overflow-x-auto border border-slate-200">
                  {this.state.error.message}
                  {'\n\n'}
                  {this.state.error.stack}
                </pre>
              </details>
            )}
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
