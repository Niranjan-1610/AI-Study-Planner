"use client";

import {
  MessageInput,
  MessageInputError,
  MessageInputSubmitButton,
  MessageInputTextarea,
  MessageInputToolbar,
} from "@/components/tambo/message-input";
import {
  MessageSuggestions,
  MessageSuggestionsList,
  MessageSuggestionsStatus,
} from "@/components/tambo/message-suggestions";
import { ScrollableMessageContainer } from "@/components/tambo/scrollable-message-container";
import {
  ThreadContent,
  ThreadContentMessages,
} from "@/components/tambo/thread-content";
import type { Suggestion } from "@tambo-ai/react";
import { useTamboThread } from "@tambo-ai/react";
import { useState, useEffect, useRef } from "react";

const defaultSuggestions: Suggestion[] = [
  {
    id: "planner-copilot-1",
    title: "New study block",
    detailedSuggestion:
      "Add a new study block for graph traversal practice on Tuesday at 7:30 PM.",
    messageId: "planner-copilot-new-block",
  },
  {
    id: "planner-copilot-2",
    title: "Prioritize next",
    detailedSuggestion:
      "What should I study next based on my current plan and time?",
    messageId: "planner-copilot-next",
  },
];

export default function ChatPanel() {
  const thread = useTamboThread();
  const [connectionError, setConnectionError] = useState<string | null>(null);
  const [isRetrying, setIsRetrying] = useState(false);
  const [isInitialized, setIsInitialized] = useState(false);
  const errorCountRef = useRef(0);

  useEffect(() => {
    // Check if thread is initialized
    if (thread) {
      setIsInitialized(true);
      errorCountRef.current = 0; // Reset error count on successful init
    }
  }, [thread]);

  useEffect(() => {
    // Add handler for unhandled promise rejections (streaming errors)
    const handleUnhandledRejection = (event: PromiseRejectionEvent) => {
      const error = event.reason;
      const errorMsg = error?.message || String(error);
      
      // Check if this is a streaming-related error
      if (
        errorMsg.includes("stream") ||
        errorMsg.includes("body") ||
        errorMsg.includes("response") ||
        errorMsg.includes("Streaming")
      ) {
        errorCountRef.current += 1;
        console.error("📡 Streaming error detected:", {
          message: errorMsg,
          errorCount: errorCountRef.current,
          timestamp: new Date().toISOString(),
        });

        // Show user-friendly error message
        setConnectionError(`Streaming issue (${errorCountRef.current}): ${errorMsg}`);
        
        // Auto-clear error after 5 seconds but keep error count
        const timeoutId = setTimeout(() => {
          setConnectionError(null);
        }, 5000);

        return () => clearTimeout(timeoutId);
      }
    };

    window.addEventListener("unhandledrejection", handleUnhandledRejection);
    return () => {
      window.removeEventListener("unhandledrejection", handleUnhandledRejection);
    };
  }, []);

  const handleRetry = () => {
    setIsRetrying(true);
    setConnectionError(null);
    errorCountRef.current = 0;
    setTimeout(() => {
      setIsRetrying(false);
      window.location.reload();
    }, 500);
  };

  return (
    <>
      <div className="border-b border-slate-200 px-5 py-4">
        <p className="text-xs uppercase tracking-[0.3em] text-slate-500">
          Planner Copilot
        </p>
        <h2 className="mt-2 text-lg font-semibold text-slate-900">
          Ask for a new study block
        </h2>
      </div>

      {connectionError && (
        <div className="mx-4 mt-3 rounded-lg border border-amber-200 bg-amber-50 p-3 animate-in fade-in">
          <div className="flex items-start gap-2">
            <div className="flex-shrink-0 mt-0.5">
              <svg className="h-4 w-4 text-amber-600" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
              </svg>
            </div>
            <div className="flex-1">
              <p className="text-sm font-medium text-amber-900">Connection Issue</p>
              <p className="mt-1 text-xs text-amber-800 break-words">{connectionError}</p>
            </div>
          </div>
          <button
            onClick={handleRetry}
            disabled={isRetrying}
            className="mt-2 text-xs font-medium text-amber-700 hover:text-amber-900 underline disabled:opacity-50 transition"
          >
            {isRetrying ? "Reconnecting..." : "Retry"}
          </button>
        </div>
      )}

      {!isInitialized ? (
        <div className="flex-1 flex items-center justify-center px-4 py-8">
          <div className="text-center">
            <div className="mb-3 inline-block h-5 w-5 animate-spin rounded-full border-2 border-slate-300 border-t-slate-600"></div>
            <p className="text-sm text-slate-500">Initializing copilot...</p>
          </div>
        </div>
      ) : (
        <>
          <ScrollableMessageContainer className="flex-1 px-4 py-3">
            <ThreadContent variant="default">
              <ThreadContentMessages />
            </ThreadContent>
          </ScrollableMessageContainer>
          
          <div className="px-4 pb-2">
            <MessageSuggestions initialSuggestions={defaultSuggestions}>
              <MessageSuggestionsStatus />
              <MessageSuggestionsList />
            </MessageSuggestions>
          </div>
          
          <div className="border-t border-slate-200 p-4">
            <MessageInput variant="bordered">
              <MessageInputTextarea placeholder="Plan my next session..." />
              <MessageInputToolbar>
                <MessageInputSubmitButton />
              </MessageInputToolbar>
              <MessageInputError />
            </MessageInput>
          </div>
        </>
      )}
    </>
  );
}

