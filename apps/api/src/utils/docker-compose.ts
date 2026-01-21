import fs from 'fs';

export function parseComposeServices(content: string): string[] {
  const lines = content.split(/\r?\n/);
  const services: string[] = [];
  let inServices = false;

  for (const line of lines) {
    if (!inServices) {
      if (/^services:\s*$/.test(line)) {
        inServices = true;
      }
      continue;
    }

    if (line.trim() === '' || line.trim().startsWith('#')) {
      continue;
    }

    if (/^\S/.test(line)) {
      break;
    }

    const match = line.match(/^\s{2}([a-zA-Z0-9_-]+):\s*$/);
    if (match) {
      services.push(match[1]);
    }
  }

  return services;
}

export function readComposeServices(path: string): string[] {
  const content = fs.readFileSync(path, 'utf8');
  return parseComposeServices(content);
}
