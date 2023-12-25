export const logger = {
  log: info,
  info,
  warn,
  error,
};

function _logPrefix(level: string): string {
  return `${new Date().toISOString()} [${level}] -`;
}

function info(...args: unknown[]) {
  console.log(_logPrefix("INFO"), ...args);
}

function warn(...args: unknown[]) {
  console.warn(_logPrefix("WARN"), ...args);
}

function error(...args: unknown[]) {
  console.error(_logPrefix("ERROR"), ...args);
}
