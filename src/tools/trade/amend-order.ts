import { zodToJsonSchema } from 'zod-to-json-schema';
import { z } from 'zod';
import { CallToolResult, Tool } from '@modelcontextprotocol/sdk/types.js';
import { IBybitService, IErrorService } from '../../services';

export const amendOrderInputSchema = z.object({
  category: z
    .enum(['spot', 'linear', 'inverse', 'option'])
    .describe('Product type: spot, linear, inverse, option'),
  symbol: z.string().describe('Symbol name'),
  orderId: z.string().optional().describe('Order ID'),
  orderLinkId: z.string().optional().describe('User customised order ID'),
  orderIv: z.string().optional().describe('Implied volatility'),
  triggerPrice: z.string().optional().describe('Trigger price'),
  qty: z.string().optional().describe('Order quantity'),
  price: z.string().optional().describe('Order price'),
  takeProfit: z.string().optional().describe('Take profit price'),
  stopLoss: z.string().optional().describe('Stop loss price'),
  tpTriggerBy: z.string().optional().describe('Take profit trigger by'),
  slTriggerBy: z.string().optional().describe('Stop loss trigger by'),
  triggerBy: z.string().optional().describe('Trigger by'),
});

export type AmendOrderParams = z.infer<typeof amendOrderInputSchema>;

export const AMEND_ORDER_TOOL: Tool = {
  name: 'amend_order',
  description:
    'Modifies an existing unfilled or partially filled order; allows changing price, quantity or trigger price. Adjusting orders is crucial when market conditions change after submission.',
  inputSchema: zodToJsonSchema(amendOrderInputSchema, {
    target: 'jsonSchema7',
  }) as Tool['inputSchema'],
};

export default async function amendOrder(
  this: { bybitService: IBybitService; errorService: IErrorService },
  params: AmendOrderParams,
): Promise<CallToolResult> {
  try {
    const validated = amendOrderInputSchema.parse(params);
    const result = await this.bybitService.amendOrder(validated as Parameters<IBybitService['amendOrder']>[0]);
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
      operation: 'amendOrder',
      params,
      timestamp: new Date().toISOString(),
    });
  }
}
