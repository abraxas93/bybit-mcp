import { zodToJsonSchema } from 'zod-to-json-schema';
import { z } from 'zod';
import { CallToolResult, Tool } from '@modelcontextprotocol/sdk/types.js';
import { IBybitService, IErrorService } from '../../services';

export const getTickersInputSchema = z.object({
  category: z
    .enum(['spot', 'linear', 'inverse', 'option'])
    .describe('Product type: spot, linear, inverse, option'),
  symbol: z.string().optional().describe('Symbol name'),
  baseCoin: z.string().optional().describe('Base coin'),
  expDate: z.string().optional().describe('Expiry date'),
});

export type GetTickersParams = z.infer<typeof getTickersInputSchema>;

export const GET_TICKERS_TOOL: Tool = {
  name: 'get_tickers',
  description:
    'Returns the latest price snapshot, best bid/ask and 24-hour volume for each symbol. A trading bot uses tickers to monitor current prices and market movements without fetching the entire order book.',
  inputSchema: zodToJsonSchema(getTickersInputSchema, {
    target: 'jsonSchema7',
  }) as Tool['inputSchema'],
};

export default async function getTickers(
  this: { bybitService: IBybitService; errorService: IErrorService },
  params: GetTickersParams,
): Promise<CallToolResult> {
  try {
    const validated = getTickersInputSchema.parse(params);
    const result = await this.bybitService.getTickers(validated as Parameters<IBybitService['getTickers']>[0]);
    return {
      content: [
        {
          type: 'text',
          text: JSON.stringify(result, null, 2),
        },
      ],
    };
  } catch (error) {
    return this.errorService.handleError(error, {
      operation: 'getTickers',
      params,
      timestamp: new Date().toISOString(),
    });
  }
}
