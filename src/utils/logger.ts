const COLORS = {
  reset: "\x1b[0m",
  green: "\x1b[32m",
  yellow: "\x1b[33m",
  red: "\x1b[31m",
  blue: "\x1b[34m",
  cyan: "\x1b[36m",
};

export const Logger = {
  info: (message: string, context?: string) => {
    const ctx = context ? `[${context}] ` : '';
    console.log(`${COLORS.cyan}${ctx}INFO: ${message}${COLORS.reset}`);
  },
  
  success: (message: string, context?: string) => {
    const ctx = context ? `[${context}] ` : '';
    console.log(`${COLORS.green}${ctx}SUCCESS: ${message}${COLORS.reset}`);
  },
  
  warn: (message: string, context?: string) => {
    const ctx = context ? `[${context}] ` : '';
    console.log(`${COLORS.yellow}${ctx}WARN: ${message}${COLORS.reset}`);
  },
  
  error: (message: string, source: string, error?: any) => {
    const errorDetail = error ? `\nDetails: ${error.message || JSON.stringify(error)}` : '';
    console.error(`${COLORS.red}[${source}] ERROR: ${message}${errorDetail}${COLORS.reset}`);
  }
};
