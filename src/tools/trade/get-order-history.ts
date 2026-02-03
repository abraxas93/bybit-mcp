import { zodToJsonSchema } from 'zod-to-json-schema';
import { z } from 'zod';
import { CallToolResult, Tool } from '@modelcontextprotocol/sdk/types.js';
import { IBybitService, IErrorService } from '../../services';

export const getOrderHistoryInputSchema = z.object({
  category: z
    .enum(['spot', 'linear', 'inverse', 'option'])
    .describe('Product type: spot, linear, inverse, option'),
  symbol: z.string().optional().describe('Symbol name'),
  orderId: z.string().optional().describe('Order ID'),
  orderLinkId: z.string().optional().describe('User customised order ID'),
  orderFilter: z.string().optional().describe('Order filter'),
  startTime: z.number().optional().describe('Start timestamp (ms)'),
  endTime: z.number().optional().describe('End timestamp (ms)'),
  limit: z.number().optional().describe('Limit for data size'),
  cursor: z.string().optional().describe('Cursor'),
});

export type GetOrderHistoryParams = z.infer<typeof getOrderHistoryInputSchema>;

export const GET_ORDER_HISTORY_TOOL: Tool = {
  name: 'get_order_history',
  description:
    'Queries order history for the past two years and supports filters by symbol, time or status. Useful for auditing, analytics and reconciliation of past orders.',
  inputSchema: zodToJsonSchema(getOrderHistoryInputSchema, {
    target: 'jsonSchema7',
  }) as Tool['inputSchema'],
};

export default async function getOrderHistory(
  this: { bybitService: IBybitService; errorService: IErrorService },
  params: GetOrderHistoryParams,
): Promise<CallToolResult> {
  try {
    const validated = getOrderHistoryInputSchema.parse(params);
    const result = await this.bybitService.getOrderHistory(validated as Parameters<IBybitService['getOrderHistory']>[0]);
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
      operation: 'getOrderHistory',
      params,
      timestamp: new Date().toISOString(),
    });
  }
}
