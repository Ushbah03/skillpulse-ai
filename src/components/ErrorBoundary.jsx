import React from 'react';
import { AlertTriangle, RefreshCw, Home, ChevronDown, ChevronUp } from 'lucide-react';

export class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      hasError: false,
      error: null,
      errorInfo: null,
      showDetails: false
    };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    this.setState({ errorInfo });

    // Structured observability logging
    const errorReport = {
      timestamp: new Date().toISOString(),
      name: error?.name || 'Error',
      message: error?.message || 'Unknown error',
      stack: error?.stack,
      componentStack: errorInfo?.componentStack,
      url: window.location.href,
      userAgent: navigator.userAgent
    };

    console.error('SkillPulse AI [Global Error Boundary]:', errorReport);

    // If Sentry / monitoring SDK is mounted, forward event
    if (window.Sentry && typeof window.Sentry.captureException === 'function') {
      window.Sentry.captureException(error, { extra: errorInfo });
    }
  }

  handleReset = () => {
    this.setState({ hasError: false, error: null, errorInfo: null });
  };

  handleReload = () => {
    window.location.reload();
  };

  handleGoHome = () => {
    window.location.href = '/';
  };

  render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback;
      }

      return (
        <div className="min-h-screen bg-slate-950 text-slate-100 flex items-center justify-center p-4">
          <div className="max-w-xl w-full bg-slate-900/90 border border-red-500/30 rounded-2xl p-6 sm:p-8 shadow-2xl backdrop-blur-xl">
            <div className="w-14 h-14 rounded-2xl bg-red-500/10 border border-red-500/20 flex items-center justify-center mb-6 text-red-400">
              <AlertTriangle className="w-7 h-7" />
            </div>

            <h1 className="text-2xl font-bold text-white mb-2 tracking-tight">
              Something went wrong
            </h1>
            <p className="text-slate-400 text-sm leading-relaxed mb-6">
              SkillPulse AI encountered an unexpected interface issue. Your workspace and data are completely secure.
            </p>

            <div className="flex flex-wrap gap-3 mb-6">
              <button
                onClick={this.handleReload}
                className="flex items-center gap-2 px-4 py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl text-sm font-medium transition shadow-lg shadow-indigo-600/20"
              >
                <RefreshCw className="w-4 h-4" />
                Reload Application
              </button>
              <button
                onClick={this.handleGoHome}
                className="flex items-center gap-2 px-4 py-2.5 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-xl text-sm font-medium transition border border-slate-700"
              >
                <Home className="w-4 h-4" />
                Return to Home
              </button>
              <button
                onClick={this.handleReset}
                className="px-4 py-2.5 bg-slate-800/60 hover:bg-slate-800 text-slate-300 rounded-xl text-sm font-medium transition border border-slate-700/60"
              >
                Try Again
              </button>
            </div>

            {/* Collapsible Error Diagnostics */}
            <div className="border-t border-slate-800/80 pt-4">
              <button
                onClick={() => this.setState({ showDetails: !this.state.showDetails })}
                className="flex items-center justify-between w-full text-xs text-slate-400 hover:text-slate-200 transition py-1"
              >
                <span className="font-mono">Technical Error Details</span>
                {this.state.showDetails ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
              </button>

              {this.state.showDetails && (
                <div className="mt-3 p-3.5 bg-slate-950/80 rounded-xl border border-slate-800/60 font-mono text-xs text-red-400/90 overflow-x-auto max-h-48 whitespace-pre-wrap select-all">
                  <p className="font-bold mb-1 text-red-300">
                    {this.state.error?.toString()}
                  </p>
                  <p className="text-slate-500 text-[11px] mt-1">
                    {this.state.errorInfo?.componentStack || this.state.error?.stack}
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
