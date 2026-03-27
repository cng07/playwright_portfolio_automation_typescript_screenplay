import { Page } from '@playwright/test';
import * as fs from 'fs';
import * as path from 'path';

/**
 * Pause execution for specified milliseconds
 */
export const pause = (ms: number): Promise<void> => {
  return new Promise(resolve => setTimeout(resolve, ms));
};

/**
 * Get random number between min and max
 */
export const getRandomNumber = (min: number, max: number): number => {
  return Math.floor(Math.random() * (max - min + 1)) + min;
};

/**
 * Build full URL for internal paths
 */
export const buildInternalUrls = (paths: string[]): string[] => {
  const baseUrl = 'https://carlosng07.vercel.app';
  return paths.map(currentPath => `${baseUrl}${currentPath}`);
};

/**
 * Verify API response for a list of URLs
 */
export const verifyUrlsApiResponses = async (
  page: Page,
  urls: string[],
  options: { expectedStatus?: number; timeout?: number } = {}
): Promise<Map<string, number>> => {
  const { timeout = 5000 } = options;
  const results = new Map<string, number>();

  for (const url of urls) {
    try {
      let response = await page.request.head(url, { timeout });
      if (response.status() === 405 || response.status() === 501) {
        response = await page.request.get(url, { timeout });
      }

      results.set(url, response.status());
      console.log(`[OK] ${url}: ${response.status()}`);
    } catch (error) {
      console.log(`[ERROR] ${url}: Failed to verify - ${error}`);
      results.set(url, 0);
    }
  }

  return results;
};

/**
 * Verify internal paths API responses
 */
export const verifyInternalPathsApiResponses = async (
  page: Page,
  paths: string[],
  options: { expectedStatus?: number; timeout?: number } = {}
): Promise<Map<string, number>> => {
  const fullUrls = buildInternalUrls(paths);
  return verifyUrlsApiResponses(page, fullUrls, options);
};

/**
 * Read CSV file and get value by row and header
 */
export const getLinkOnCSV = async (
  rowNum: number,
  header: string
): Promise<string> => {
  const csvPath = path.join(
    process.cwd(),
    'src/test-data',
    'linkFile.csv'
  );

  if (!fs.existsSync(csvPath)) {
    throw new Error(`CSV file not found at ${csvPath}`);
  }

  const fileContent = fs.readFileSync(csvPath, 'utf-8');
  const lines = fileContent.split('\n').filter((line: string) => line.trim());

  if (lines.length <= rowNum + 1) {
    throw new Error(`Row ${rowNum} does not exist in CSV`);
  }

  const headers = lines[0].split(',').map((columnHeader: string) => columnHeader.trim());
  const columnIndex = headers.indexOf(header);

  if (columnIndex === -1) {
    throw new Error(`Header "${header}" not found in CSV`);
  }

  const values = lines[rowNum + 1].split(',').map((value: string) => value.trim());
  return values[columnIndex];
};

/**
 * Log a formatted message
 */
export const log = (message: string, tag: string = 'INFO'): void => {
  console.log(`[${tag}] ${new Date().toISOString()} - ${message}`);
};
