"use client";

import React, { ReactNode } from "react";

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
  errorCount: number;
  isStreamingError: boolean;
}

export class StreamErrorBoundary extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { 
      hasError: false, 
      error: null, 
      errorCount: 0,
      isStreamingError: false 
    };
  }

  static getDerivedStateFromError(error: Error) {
    const isStreamingError = error.message?.includes("stream") || 
                            error.message?.includes("body") ||
                            error.message?.includes("response") ||
                            error.message?.includes("Streaming");
    
    return (prevState: State) => ({
      hasError: true,
      error,
      isStreamingError,
      errorCount: prevState.errorCount + 1,
    });
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    // Log error details for debugging
    const isStreamingError = error.message?.includes("stream") || 
                            error.message?.includes("body") ||
                            error.message?.includes("response");
    
    console.error((isStreamingError ? "📡 " : "❌ ") + "Error caught by boundary:", {
      type: isStreamingError ? "Streaming Error" : "General Error",
      message: error.message,
      stack: error.stack,
      componentStack: errorInfo.componentStack,
      timestamp: new Date().toISOString(),
      errorCount: this.state.errorCount + 1,
    });
  }

  handleReset = () => {
    this.setState({ hasError: false, error: null, isStreamingError: false });
  };

  handleReload = () => {
    this.handleReset();
    // Use setTimeout to ensure state update completes before reload
    setTimeout(() => {
      window.location.reload();
    }, 100);
  };

  render() {
    if (this.state.hasError) {
      const { isStreamingError, error, errorCount } = this.state;
      
      return (
        this.props.fallback || (
          <div className="h-screen flex flex-col items-center justify-center bg-gradient-to-br from-slate-50 to-slate-100 p-6">
            <div className="max-w-md">
              <div className="rounded-lg border border-red-200 bg-white p-8 shadow-lg">
                <div className="flex items-start gap-3">
                  <div className="mt-0.5">
                    {isStreamingError ? (
                      <svg
                        className="h-6 w-6 text-orange-600 animate-pulse"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M8.111 16.251a.375.375 0 01-.469-.46l1.08-4.15a.375.375 0 01.36-.267h2.25c.41 0 .664-.41.464-.783L8.716 4.5c-.176-.307.02-.683.38-.683h2.004c.476 0 .88.329.953.781l1.07 6.038c.055.31.337.55.646.55h.766c.41 0 .664.41.464.783l-1.08 4.15a.375.375 0 01-.36.267h-2.25c-.41 0-.664.41-.464.783l1.078 4.15c.176.307-.02.683-.38.683h-2.004c-.476 0-.88-.329-.953-.781l-1.07-6.038c-.055-.31-.337-.55-.646-.55h-.766c-.41 0-.664-.41-.464-.783l1.08-4.15z"
                        />
                      </svg>
                    ) : (
                      <svg
                        className="h-6 w-6 text-red-600"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M12 8v4m0 4v.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                        />
                      </svg>
                    )}
                  </div>
                  <div className="flex-1">
                    <h2 className="text-lg font-semibold text-slate-900">
                      {isStreamingError ? "Streaming Connection Error" : "Connection Error"}
                    </h2>
                    <p className="mt-2 text-sm text-slate-600 break-words">
                      {error?.message ||
                        "An error occurred. Please try again."}
                    </p>
                    <p className="mt-1 text-xs text-slate-500">
                      Error #{errorCount}
                      {isStreamingError && " • Streaming Issue"}
                    </p>
                  </div>
                </div>

                {isStreamingError && (
                  <div className="mt-4 rounded-lg bg-orange-50 p-3 border border-orange-100">
                    <p className="text-xs font-medium text-orange-900 mb-1">
                      Streaming troubleshooting:
                    </p>
                    <ul className="text-xs text-orange-800 space-y-0.5">
                      <li>• Check your internet connection</li>
                      <li>• Verify API credentials in .env.local</li>
                      <li>• Check if the API server is online</li>
                      <li>• Try disabling browser extensions</li>
                    </ul>
                  </div>
                )}

                <div className="mt-6 flex gap-2">
                  <button
                    onClick={this.handleReload}
                    className="flex-1 rounded-lg bg-red-600 px-4 py-2 text-sm font-medium text-white transition hover:bg-red-700 active:scale-95"
                  >
                    Reload Page
                  </button>
                  <button
                    onClick={this.handleReset}
                    className="flex-1 rounded-lg border border-slate-200 px-4 py-2 text-sm font-medium text-slate-700 transition hover:bg-slate-50"
                  >
                    Dismiss
                  </button>
                </div>

                <p className="mt-4 text-xs text-slate-500">
                  Open browser console (F12) for detailed error logs.
                </p>
              </div>
            </div>
          </div>
        )
      );
    }

    return this.props.children;
  }
}
