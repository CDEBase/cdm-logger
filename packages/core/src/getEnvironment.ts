/* eslint-disable no-underscore-dangle */
/* eslint-disable @typescript-eslint/ban-ts-comment */

/**
 * Get environment variables from the current runtime context.
 * Supports multiple environments:
 * - Browser (window.__ENV__, webpack DefinePlugin, window.process.APP_ENV)
 * - React Native / Expo (process.APP_ENV, Hermes)
 * - Tauri desktop (window.__TAURI_ENV__)
 * - Electron (renderer and main process)
 * - Node.js (process.env)
 * - Deno (Deno.env)
 * - Bun (process.env)
 * - Edge runtimes (Vercel Edge, Cloudflare Workers, Deno Deploy)
 * - Web Workers (self.__ENV__)
 */
export function getEnvironment(): Record<string, string | undefined> {
    // @ts-ignore
    const hasWindow = typeof window !== 'undefined';
    // @ts-ignore
    const hasProcess = typeof process !== 'undefined';
    // @ts-ignore
    const hasGlobalThis = typeof globalThis !== 'undefined';

    // React Native environment (Expo, RN CLI)
    // Check for React Native before browser checks since RN has a window-like global
    // @ts-ignore
    if (hasGlobalThis && (globalThis.nativeModuleProxy || globalThis.__fbBatchedBridge || globalThis.HermesInternal)) {
        // @ts-ignore: set by mobile public-config pattern (process.APP_ENV)
        if (hasProcess && process.APP_ENV) {
            // @ts-ignore
            return process.APP_ENV;
        }
        // @ts-ignore
        return globalThis.__ENV__ || {};
    }

    // Tauri desktop environment
    // @ts-ignore
    if (hasWindow && window.__TAURI__) {
        // @ts-ignore
        return window.__TAURI_ENV__ || window.__ENV__ || window.process?.env || {};
    }

    // Electron renderer process
    // @ts-ignore
    if (hasWindow && window.process?.type === 'renderer') {
        // @ts-ignore
        return window.process.env || {};
    }

    // Browser or web-based mobile environment (React, Vue, etc.)
    // Priority: window.__ENV__ -> global __ENV__ (webpack define) -> window.process.APP_ENV -> window.process.env
    // @ts-ignore
    if (hasWindow) {
        // @ts-ignore
        if (window.__ENV__) {
            // @ts-ignore
            return window.__ENV__;
        }
        // @ts-ignore: webpack DefinePlugin may define __ENV__ globally
        if (typeof __ENV__ !== 'undefined' && __ENV__) {
            // @ts-ignore
            return __ENV__;
        }
        // @ts-ignore: set by public-config pattern (window.process.APP_ENV or window.process.env)
        if (window.process?.APP_ENV) {
            // @ts-ignore
            return window.process.APP_ENV;
        }
        // @ts-ignore
        if (window.process?.env) {
            // @ts-ignore
            return window.process.env;
        }
        return {};
    }

    // Edge runtime (Vercel Edge, Cloudflare Workers, Deno Deploy)
    // @ts-ignore
    if (hasGlobalThis && typeof globalThis.EdgeRuntime !== 'undefined') {
        // @ts-ignore
        return globalThis.process?.env || globalThis.env || {};
    }

    // Cloudflare Workers environment
    // @ts-ignore
    if (hasGlobalThis && typeof globalThis.caches !== 'undefined' && !hasWindow) {
        // @ts-ignore
        return globalThis.env || {};
    }

    // Deno environment
    // @ts-ignore
    if (typeof Deno !== 'undefined') {
        // @ts-ignore
        return Object.fromEntries(Deno.env.toObject ? Object.entries(Deno.env.toObject()) : []);
    }

    // Bun environment
    // @ts-ignore
    if (typeof Bun !== 'undefined' && hasProcess) {
        // @ts-ignore
        return process.env || {};
    }

    // Node.js environment (including Electron main process)
    // @ts-ignore
    if (hasProcess && process.versions?.node) {
        // @ts-ignore
        return process.env || {};
    }

    // Web Worker environment
    // @ts-ignore
    if (typeof self !== 'undefined' && typeof importScripts === 'function') {
        // @ts-ignore
        return self.__ENV__ || {};
    }

    // Default fallback - check process.APP_ENV for any remaining cases
    // @ts-ignore
    if (hasProcess && process.APP_ENV) {
        // @ts-ignore
        return process.APP_ENV;
    }

    // Default fallback
    return {};
}
