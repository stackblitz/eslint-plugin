import type { FlatConfig } from '@typescript-eslint/utils/ts-eslint';

export function getFiles(config: FlatConfig.Config, defaultFiles: string[]): Array<string[] | string> {
  if (config.files && config.files.length > 0) {
    return config.files;
  }

  return defaultFiles;
}
