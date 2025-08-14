import {ConfigKeys} from "../types.ts";

export const getConfig = (key: ConfigKeys, fallback?: string): string | undefined => {
    // For client-side, check window.hievents first (runtime-injected env vars)
    if (typeof window !== 'undefined' && (window as any).hievents) {
        const value = (window as any).hievents[key];
        if (value) return value;
    }
    
    // For client-side, also check import.meta.env (build-time env vars)
    if (typeof window !== 'undefined') {
        const value = (import.meta as any).env?.[key];
        if (value) return value;
    }
    
    // For server-side, use process.env
    if (typeof (globalThis as any).process !== 'undefined' && (globalThis as any).process.env) {
        const value = (globalThis as any).process.env[key];
        if (value) return value;
    }
    
    return fallback;
};
