/**
 * @interface
 * @typedef {Object} IReporter
 * @property {function(string | unknown, ...unknown[]): void} debug - Logs a debug message.
 * @property {function(string | unknown, ...unknown[]): void} verbose - Logs a verbose message.
 * @property {function(string | unknown, ...unknown[]): void} info - Logs an info message.
 * @property {function(string | unknown, ...unknown[]): void} warn - Logs a warning message.
 * @property {function(string | unknown, ...unknown[]): void} error - Logs an error message.
 * @property {function(string | unknown, ...unknown[]): void} fatal - Logs a fatal error message.
 */

export { IReporter }
