import { zodToJsonSchema } from 'zod-to-json-schema';
import { z } from 'zod';
import { CallToolResult, Tool } from '@modelcontextprotocol/sdk/types.js';
import { IBybitService, IErrorService } from '../../services';

export const getOpenClosedOrdersInputSchema = z.object({
  category: z
    .enum(['spot', 'linear', 'inverse', 'option'])
    .describe('Product type: spot, linear, inverse, option'),
  symbol: z.string().optional().describe('Symbol name'),
  baseCoin: z.string().optional().describe('Base coin'),
  settleCoin: z.string().optional().describe('Settle coin'),
  orderId: z.string().optional().describe('Order ID'),
  orderLinkId: z.string().optional().describe('User customised order ID'),
  openOnly: z.number().optional().describe('Open only flag'),
  orderFilter: z.string().optional().describe('Order filter'),
  limit: z.number().optional().describe('Limit for data size'),
  cursor: z.string().optional().describe('Cursor'),
});

export type GetOpenClosedOrdersParams = z.infer<
  typeof getOpenClosedOrdersInputSchema
>;

export const GET_OPEN_CLOSED_ORDERS_TOOL: Tool = {
  name: 'get_open_closed_orders',
  description:
    'Returns real-time unfilled/partially filled orders and up to 500 recent closed orders. Monitoring open orders allows the trading bot to know which orders are still pending and to manage them accordingly.',
  inputSchema: zodToJsonSchema(getOpenClosedOrdersInputSchema, {
    target: 'jsonSchema7',
  }) as Tool['inputSchema'],
};

export default async function getOpenClosedOrders(
  this: { bybitService: IBybitService; errorService: IErrorService },
  params: GetOpenClosedOrdersParams,
): Promise<CallToolResult> {
  try {
    const validated = getOpenClosedOrdersInputSchema.parse(params);
    const result = await this.bybitService.getOpenClosedOrders(validated as Parameters<IBybitService['getOpenClosedOrders']>[0]);
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
      operation: 'getOpenClosedOrders',
      params,
      timestamp: new Date().toISOString(),
    });
  }
}
