# Streaming Error Debugging Guide

## Overview
Streaming response errors happen when the AI API is trying to send real-time message responses to your client. This guide helps diagnose and fix these issues.

## Common Streaming Error Scenarios

### 1. **"Streaming response has no body"**
**Cause**: API returned a response without a stream body
**Solution**:
- Verify `NEXT_PUBLIC_TAMBO_URL` is set correctly in `.env.local`
- Check if the API server is online
- Ensure `streaming=true` is enabled in TamboProvider

### 2. **"Failed to parse JSON"**
**Cause**: Streaming response contains malformed JSON
**Solution**:
- Check network tab in browser DevTools (F12)
- Look at the actual response data
- Verify API is returning valid Server-Sent Events (SSE) format

### 3. **Connection timeout or drops**
**Cause**: Network interruption during streaming
**Solution**:
- Check internet connection stability
- Increase browser timeout settings
- Look for firewall/proxy blocking SSE connections

### 4. **"Error in streaming response" Error #N**
**Cause**: Generic streaming error (N is error count)
**Solution**:
- Open browser console (F12)
- Look for detailed error logs
- Check browser DevTools Network tab for failed requests

## Debugging Steps

### Step 1: Check Environment Configuration
```bash
# Verify .env.local exists and has correct values
cat .env.local

# Should contain:
# NEXT_PUBLIC_TAMBO_API_KEY=sk_test_...
# NEXT_PUBLIC_TAMBO_URL=https://api.tambo.ai
```

### Step 2: Open Browser Console
1. Press `F12` to open DevTools
2. Go to **Console** tab
3. Look for error messages with 📡 (streaming) emoji
4. Check for unhandled promise rejections

### Step 3: Check Network Tab
1. In DevTools, go to **Network** tab
2. Filter for XHR/Fetch requests
3. Look for requests to your API URL
4. Check response status (should be 200 for streaming)
5. Preview the response data - should be SSE format:
```
data: {"type":"message_started",...}
data: {"type":"message_delta",...}
data: DONE
```

### Step 4: Monitor Streaming Panel
When sending a message, the chat panel shows:
- **Initializing copilot...** → Thread initialization
- Connection error banner (if something fails)
- **Error #N** → Tracks number of streaming errors

### Step 5: Check Patch Application
```bash
# Verify patch-package is installed
npm list patch-package

# Verify patches directory exists
ls patches/

# Should show: @tambo-ai+typescript-sdk+0.89.0.patch
```

## Enabling Verbose Logging

### Add to your page:
```typescript
// In chat/page.tsx or chat-panel.tsx
useEffect(() => {
  window.debugStreamingErrors = true;
  
  // Log all streaming events
  const originalFetch = window.fetch;
  window.fetch = async (...args) => {
    const response = await originalFetch(...args);
    if (response.headers.get('content-type')?.includes('text/event-stream')) {
      console.log("🚀 SSE Stream started:", args[0]);
    }
    return response;
  };
}, []);
```

### View logs in Console:
```javascript
// Filter for streaming logs
window.location.reload() // Reload to trigger new streaming attempt
// Check console for "📡 Streaming error" messages
```

## Error Recovery Options

### Option 1: Retry Button
- Click "Retry" in the error panel
- Tries to recover without full reload
- Useful for temporary network issues

### Option 2: Page Reload
- Click "Reload Page" button
- Full restart of the application
- Clears all state and reconnects

### Option 3: Disable Streaming (Temporary)
```typescript
// In chat/page.tsx - TEMPORARY FIX ONLY
<TamboProvider
  streaming={false}  // Disable streaming, use polling instead
  ...
>
```

## Advanced Debugging

### Check API Connectivity:
```bash
# Test API endpoint
curl -H "Authorization: Bearer sk_test_..." \
  https://api.tambo.ai/health

# Should return 200 OK
```

### Monitor Memory/Network:
1. Open DevTools Performance tab
2. Start recording
3. Send a message
4. Stop recording
5. Look for long-running tasks or network delays

### Check Response Headers:
In DevTools Network tab, click the streaming request and check:
- **Content-Type**: Must include `text/event-stream`
- **Transfer-Encoding**: Should be `chunked` for streaming
- **Connection**: Should be `keep-alive`

## Troubleshooting Checklist

- [ ] Verified `.env.local` exists with valid API key
- [ ] Checked that `NEXT_PUBLIC_TAMBO_URL` points to correct API
- [ ] Tested network connection (ping api endpoint)
- [ ] Cleared browser cache and reloaded (Ctrl+Shift+R)
- [ ] Checked browser console for specific error messages
- [ ] Verified patch-package is installed and patch applied
- [ ] Disabled browser extensions (if still failing)
- [ ] Tried from different browser (to rule out browser issues)
- [ ] Checked if API server status is online
- [ ] Looked at Network tab to see actual response data

## Log Output Examples

### Successful streaming:
```
🚀 Chat page mounted {
  hasApiKey: true,
  apiUrl: "https://api.tambo.ai",
  streaming: true,
  mcpServersCount: 0
}
```

### Streaming error detected:
```
📡 Streaming error detected: {
  message: "Streaming response has no body",
  errorCount: 1,
  timestamp: "2025-02-08T12:34:56.789Z"
}
```

### Error boundary catch:
```
❌ Error caught by boundary: {
  type: "Streaming Error",
  message: "Failed to parse JSON after multiple chunks",
  timestamp: "2025-02-08T12:34:57.123Z",
  errorCount: 2
}
```

## Contacting Support

When reporting a streaming error, include:
1. Error message (exact text)
2. Error number (Error #N)
3. Browser and OS information
4. Steps to reproduce
5. Console log output (copy from F12)
6. Network tab screenshot (showing failed request)
7. API endpoint being used

## Performance Notes

- First message may be slow (thread initialization)
- Subsequent messages should be faster
- Streaming allows real-time response display
- Patch handles incomplete chunks and SSE parsing edge cases

---

**Last Updated**: February 2025  
**Patch Version**: @tambo-ai/typescript-sdk+0.89.0.patch  
**Related Files**:
- `/patches/@tambo-ai+typescript-sdk+0.89.0.patch`
- `/src/app/chat/page.tsx`
- `/src/app/interactables/components/chat-panel.tsx`
- `/src/components/StreamErrorBoundary.tsx`
- `/.env.local`
