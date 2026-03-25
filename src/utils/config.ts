import { existsSync, readFileSync } from 'fs';
import { join } from 'path';

type Config = {
  exclude?: Array<string>;
};

const CONFIG_FILE_NAME = '.gitwizrc';

export function getConfig(): Config {
  const configPath = join(process.cwd(), CONFIG_FILE_NAME);

  if (!existsSync(configPath)) {
    return {};
  }

  try {
    const content = readFileSync(configPath, 'utf8');
    return JSON.parse(content);
  } catch {
    console.warn(`\x1b[33m[git-wiz] Warning: Failed to parse "${CONFIG_FILE_NAME}". Please check the file for valid JSON.\x1b[0m`);
    return {};
  }
}
