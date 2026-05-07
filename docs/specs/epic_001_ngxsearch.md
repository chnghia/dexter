# Epic 001: NGX Search Integration

## Objective
Introduce a new web search tool (`ngxsearch`) powered by a custom search endpoint hosted at `172.16.0.25:8080/search`. This tool provides an alternative or supplementary web search provider within the Dexter agent ecosystem.

## Key Changes

1. **New Search Implementation (`src/tools/search/ngxsearch.ts`)**:
   - Implements `ngxSearchTool` utilizing LangChain's `DynamicStructuredTool`.
   - Sends a `GET` request to the provided endpoint with the query string.
   - Parses the JSON response and formats it into the standard structure expected by the agent using `formatToolResult`.

2. **Tool Registration (`src/tools/registry.ts`)**:
   - Conditionally registers `ngx_search` under the `web_search` tool name.
   - It is activated when the `NGXSEARCH_URL` environment variable is defined.
   - Evaluated alongside other search providers (Exa, Perplexity, Tavily).

3. **Environment Configuration (`env.example`)**:
   - Added `NGXSEARCH_URL` as a reference for configuring the service (defaulting to `http://172.16.0.25:8080/search`).

## Usage
When `NGXSEARCH_URL` is set in the `.env` file, the agent's `web_search` tool will route queries to the NGX search service instead of fallback options (if prioritized appropriately in `registry.ts`).

## Verification
- Run `bun run typecheck` to ensure the new tool aligns with `StructuredToolInterface`.
- Run the agent with `NGXSEARCH_URL` defined and invoke a query that triggers a web search to verify the end-to-end integration.
