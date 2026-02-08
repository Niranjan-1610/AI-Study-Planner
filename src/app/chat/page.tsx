"use client";

import dynamic from "next/dynamic";
import { useMcpServers } from "@/components/tambo/mcp-config-modal";
import { components, tools } from "@/lib/tambo";
import { TamboProvider } from "@tambo-ai/react";
import { StreamErrorBoundary } from "@/components/StreamErrorBoundary";
import { useState, useEffect } from "react";

const MessageThreadFull = dynamic(
  () =>
    import("@/components/tambo/message-thread-full").then(
      (mod) => mod.MessageThreadFull,
    ),
  {
    loading: () => (
      <div className="h-full flex items-center justify-center">
        <div className="text-center">
          <div className="mb-3 inline-block h-6 w-6 animate-spin rounded-full border-2 border-slate-300 border-t-slate-600"></div>
          <p className="mt-3 text-sm text-slate-500">Loading chat experience...</p>
        </div>
      </div>
    ),
  },
);

export default function Home() {
  const mcpServers = useMcpServers();
  const [retryCount, setRetryCount] = useState(0);
  const apiKey = process.env.NEXT_PUBLIC_TAMBO_API_KEY;
  const apiUrl = process.env.NEXT_PUBLIC_TAMBO_URL;

  useEffect(() => {
    // Log configuration on mount for debugging
    console.log("🚀 Chat page mounted", {
      hasApiKey: !!apiKey,
      apiUrl: apiUrl || "default (https://api.tambo.ai)",
      streaming: true,
      mcpServersCount: mcpServers?.length || 0,
    });

    // Add global error handler for streaming errors
    const handleError = (event: ErrorEvent) => {
      if (event.message.includes("streaming") || event.message.includes("stream")) {
        console.error("❌ Streaming error caught:", {
          message: event.message,
          filename: event.filename,
          lineno: event.lineno,
          colno: event.colno,
          stack: event.error?.stack,
        });
      }
    };

    window.addEventListener("error", handleError);
    return () => window.removeEventListener("error", handleError);
  }, [apiKey, apiUrl, mcpServers]);

  if (!apiKey) {
    return (
      <div className="h-screen flex flex-col items-center justify-center bg-slate-50 p-6">
        <div className="max-w-md">
          <div className="rounded-lg border border-amber-200 bg-amber-50 p-6">
            <h2 className="text-lg font-semibold text-amber-900">Configuration Missing</h2>
            <p className="mt-2 text-sm text-amber-800">
              The NEXT_PUBLIC_TAMBO_API_KEY environment variable is not set.
            </p>
            <p className="mt-2 text-xs text-amber-700">
              Please add it to your .env.local file and restart the server.
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <StreamErrorBoundary
      fallback={
        <div className="h-screen flex flex-col items-center justify-center bg-slate-50 p-6">
          <div className="max-w-md">
            <div className="rounded-lg border border-red-200 bg-red-50 p-6">
              <h2 className="text-lg font-semibold text-red-900">Streaming Connection Error</h2>
              <p className="mt-2 text-sm text-red-700">
                The streaming connection encountered an error. This could be caused by:
              </p>
              <ul className="mt-3 space-y-1 text-xs text-red-600">
                <li>• API server is unavailable</li>
                <li>• Network connectivity issues</li>
                <li>• Invalid API credentials</li>
                <li>• Browser compatibility issues</li>
              </ul>
              <button
                onClick={() => {
                  setRetryCount(prev => prev + 1);
                  console.log("Retrying streaming connection...", { attempt: retryCount + 1 });
                  setTimeout(() => window.location.reload(), 500);
                }}
                className="mt-4 w-full rounded-lg bg-red-600 px-4 py-2 text-sm font-medium text-white transition hover:bg-red-700 active:scale-95"
              >
                Retry (Attempt {retryCount + 1})
              </button>
              <p className="mt-2 text-xs text-red-500">
                Check browser console (F12) for detailed error logs.
              </p>
            </div>
          </div>
        </div>
      }
    >
      <TamboProvider
        apiKey={apiKey}
        components={components}
        tools={tools}
        tamboUrl={apiUrl}
        streaming={true}
        autoGenerateThreadName={false}
        mcpServers={mcpServers}
      >
        <div className="h-screen overflow-hidden">
          <MessageThreadFull className="h-full" />
        </div>
      </TamboProvider>
    </StreamErrorBoundary>
  );
}
