import { zodToJsonSchema } from 'zod-to-json-schema';
import { z } from 'zod';
import { CallToolResult, Tool } from '@modelcontextprotocol/sdk/types.js';
import { IBybitService, IErrorService } from '../../services';

export const placeOrderInputSchema = z.object({
  category: z
    .enum(['spot', 'linear', 'inverse', 'option'])
    .describe('Product type: spot, linear, inverse, option'),
  symbol: z.string().describe('Symbol name'),
  side: z.enum(['Buy', 'Sell']).describe('Buy or Sell'),
  orderType: z.enum(['Market', 'Limit']).describe('Order type: Market or Limit'),
  qty: z.string().describe('Order quantity'),
  price: z.string().optional().describe('Order price (required for Limit orders)'),
  timeInForce: z
    .enum(['GTC', 'IOC', 'FOK', 'PostOnly'])
    .optional()
    .describe('Time in force: GTC, IOC, FOK, PostOnly'),
  orderLinkId: z.string().optional().describe('User customised order ID'),
  reduceOnly: z.boolean().optional().describe('Reduce only'),
  closeOnTrigger: z.boolean().optional().describe('Close on trigger'),
  positionIdx: z.number().optional().describe('Position index'),
  stopLoss: z.string().optional().describe('Stop loss price'),
  takeProfit: z.string().optional().describe('Take profit price'),
  tpTriggerBy: z.string().optional().describe('Take profit trigger by'),
  slTriggerBy: z.string().optional().describe('Stop loss trigger by'),
  triggerPrice: z.string().optional().describe('Trigger price'),
  triggerBy: z.string().optional().describe('Trigger by'),
  orderFilter: z.string().optional().describe('Order filter'),
});

export type PlaceOrderParams = z.infer<typeof placeOrderInputSchema>;

export const PLACE_ORDER_TOOL: Tool = {
  name: 'place_order',
  description:
    'Submits a new order (limit, market, conditional, etc.) for spot, perpetual or option products. The endpoint supports specifying order type, quantity, price and time-in-force. This is the core operation for opening positions.',
  inputSchema: zodToJsonSchema(placeOrderInputSchema, {
    target: 'jsonSchema7',
  }) as Tool['inputSchema'],
};

export default async function placeOrder(
  this: { bybitService: IBybitService; errorService: IErrorService },
  params: PlaceOrderParams,
): Promise<CallToolResult> {
  try {
    const validated = placeOrderInputSchema.parse(params);
    const result = await this.bybitService.placeOrder(validated as Parameters<IBybitService['placeOrder']>[0]);
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
      operation: 'placeOrder',
      params,
      timestamp: new Date().toISOString(),
    });
  }
}
