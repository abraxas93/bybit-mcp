import { zodToJsonSchema } from 'zod-to-json-schema';
import { z } from 'zod';
import { CallToolResult, Tool } from '@modelcontextprotocol/sdk/types.js';
import { IBybitService, IErrorService } from '../../services';

export const getRecentTradesInputSchema = z.object({
  category: z
    .enum(['spot', 'linear', 'inverse', 'option'])
    .describe('Product type: spot, linear, inverse, option'),
  symbol: z.string().describe('Symbol name'),
  limit: z.number().optional().describe('Limit for data size, max 1000'),
});

export type GetRecentTradesParams = z.infer<typeof getRecentTradesInputSchema>;

export const GET_RECENT_TRADES_TOOL: Tool = {
  name: 'get_recent_trades',
  description:
    'Retrieves recent executed trades with price, size and side. Useful for tick-level backtesting, detecting volume spikes and building custom indicators.',
  inputSchema: zodToJsonSchema(getRecentTradesInputSchema, {
    target: 'jsonSchema7',
  }) as Tool['inputSchema'],
};

export default async function getRecentTrades(
  this: { bybitService: IBybitService; errorService: IErrorService },
  params: GetRecentTradesParams,
): Promise<CallToolResult> {
  try {
    const validated = getRecentTradesInputSchema.parse(params);
    const result = await this.bybitService.getRecentTrades(validated as Parameters<IBybitService['getRecentTrades']>[0]);
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
      operation: 'getRecentTrades',
      params,
      timestamp: new Date().toISOString(),
    });
  }
}
