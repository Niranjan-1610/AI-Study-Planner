"use client";

import { useEffect } from "react";

function randomUuidFallback(): string {
  const cryptoObj = globalThis.crypto;
  if (cryptoObj?.getRandomValues) {
    const bytes = new Uint8Array(16);
    cryptoObj.getRandomValues(bytes);

    // RFC 4122 version 4 UUID.
    bytes[6] = (bytes[6] & 0x0f) | 0x40;
    bytes[8] = (bytes[8] & 0x3f) | 0x80;

    const hex = Array.from(bytes, (b) => b.toString(16).padStart(2, "0"));
    return `${hex[0]}${hex[1]}${hex[2]}${hex[3]}-${hex[4]}${hex[5]}-${hex[6]}${hex[7]}-${hex[8]}${hex[9]}-${hex[10]}${hex[11]}${hex[12]}${hex[13]}${hex[14]}${hex[15]}`;
  }

  // Non-crypto fallback for very old environments.
  return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, (c) => {
    const r = (Math.random() * 16) | 0;
    const v = c === "x" ? r : (r & 0x3) | 0x8;
    return v.toString(16);
  });
}

export default function CryptoPolyfill() {
  useEffect(() => {
    const cryptoObj = globalThis.crypto as Crypto | undefined;
    if (!cryptoObj) {
      return;
    }
    if (typeof cryptoObj.randomUUID === "function") {
      return;
    }
    try {
      Object.defineProperty(cryptoObj, "randomUUID", {
        value: randomUuidFallback,
        configurable: true,
      });
    } catch {
      (cryptoObj as Crypto & { randomUUID: () => string }).randomUUID =
        randomUuidFallback as () => `${string}-${string}-${string}-${string}-${string}`;
    }
  }, []);

  return null;
}
