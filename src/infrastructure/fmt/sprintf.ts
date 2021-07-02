export function sprintf(s: string, ...args: string[]): string {
  let str = s;
  for (let i = 0; i < args.length; i += 1) {
    str = str.replace(`{${i}}`, args[i]);
  }
  return str;
}
