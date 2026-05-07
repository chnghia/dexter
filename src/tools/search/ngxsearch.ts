import { DynamicStructuredTool } from '@langchain/core/tools';
import { z } from 'zod';
import { formatToolResult, parseSearchResults } from '../types.js';
import { logger } from '../../utils/logger.js';

export const ngxSearchTool = new DynamicStructuredTool({
  name: 'web_search',
  description:
    'Search the web for current information on any topic. Returns relevant search results with URLs and content snippets.',
  schema: z.object({
    query: z.string().describe('The search query to look up on the web'),
  }),
  func: async (input) => {
    try {
      const baseUrl = process.env.NGXSEARCH_URL || 'http://172.16.0.25:8080/search';
      const url = new URL(baseUrl);
      url.searchParams.append('q', input.query);

      const response = await fetch(url.toString(), {
        method: 'GET',
        headers: {
          'Accept': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const result = await response.json();
      const { parsed, urls } = parseSearchResults(result);
      return formatToolResult(parsed, urls);
    } catch (error) {
      const message = error instanceof Error ? error.message : String(error);
      logger.error(`[NGX Search API] error: ${message}`);
      throw new Error(`[NGX Search API] ${message}`);
    }
  },
});
