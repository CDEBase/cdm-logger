/* eslint-disable no-underscore-dangle */
/* eslint-disable @typescript-eslint/ban-ts-comment */
export function getEnvironment() {
    // Browser or web-based mobile environment
    // @ts-ignore: Object is possibly 'undefined'.
    if (typeof window !== 'undefined') {
        // @ts-ignore: Object is possibly 'undefined'.
        return window.process?.APP_ENV || window?.__ENV__;
    }
    // Node.js environment
    // @ts-ignore: Object is possibly 'undefined'.
    if (typeof window === 'undefined' && typeof process !== 'undefined') {
        return process.env;
    }

    // Default fallback if neither window nor process is defined
    return {}; // Empty object as fallback if no env detected
}
