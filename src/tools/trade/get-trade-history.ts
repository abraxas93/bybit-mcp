import { zodToJsonSchema } from 'zod-to-json-schema';
import { z } from 'zod';
import { CallToolResult, Tool } from '@modelcontextprotocol/sdk/types.js';
import { IBybitService, IErrorService } from '../../services';

export const getTradeHistoryInputSchema = z.object({
  category: z
    .enum(['spot', 'linear', 'inverse', 'option'])
    .describe('Product type: spot, linear, inverse, option'),
  symbol: z.string().optional().describe('Symbol name'),
  orderId: z.string().optional().describe('Order ID'),
  orderLinkId: z.string().optional().describe('User customised order ID'),
  baseCoin: z.string().optional().describe('Base coin'),
  startTime: z.number().optional().describe('Start timestamp (ms)'),
  endTime: z.number().optional().describe('End timestamp (ms)'),
  execType: z.string().optional().describe('Execution type'),
  limit: z.number().optional().describe('Limit for data size'),
  cursor: z.string().optional().describe('Cursor'),
});

export type GetTradeHistoryParams = z.infer<typeof getTradeHistoryInputSchema>;

export const GET_TRADE_HISTORY_TOOL: Tool = {
  name: 'get_trade_history',
  description:
    'Returns execution (fill) records, sorted by execution time. Tracking executions is necessary for computing realised P&L, slippage and performance metrics.',
  inputSchema: zodToJsonSchema(getTradeHistoryInputSchema, {
    target: 'jsonSchema7',
  }) as Tool['inputSchema'],
};

export default async function getTradeHistory(
  this: { bybitService: IBybitService; errorService: IErrorService },
  params: GetTradeHistoryParams,
): Promise<CallToolResult> {
  try {
    const validated = getTradeHistoryInputSchema.parse(params);
    const result = await this.bybitService.getTradeHistory(validated as Parameters<IBybitService['getTradeHistory']>[0]);
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
      operation: 'getTradeHistory',
      params,
      timestamp: new Date().toISOString(),
    });
  }
}
