import { zodToJsonSchema } from 'zod-to-json-schema';
import { z } from 'zod';
import { CallToolResult, Tool } from '@modelcontextprotocol/sdk/types.js';
import { IBybitService, IErrorService } from '../../services';

export const cancelOrderInputSchema = z.object({
  category: z
    .enum(['spot', 'linear', 'inverse', 'option'])
    .describe('Product type: spot, linear, inverse, option'),
  symbol: z.string().describe('Symbol name'),
  orderId: z.string().optional().describe('Order ID'),
  orderLinkId: z.string().optional().describe('User customised order ID'),
  orderFilter: z.string().optional().describe('Order filter'),
});

export type CancelOrderParams = z.infer<typeof cancelOrderInputSchema>;

export const CANCEL_ORDER_TOOL: Tool = {
  name: 'cancel_order',
  description:
    'Cancels an unfilled or partially filled order by specifying orderId or orderLinkId. A trading system must be able to withdraw orders that are no longer desirable.',
  inputSchema: zodToJsonSchema(cancelOrderInputSchema, {
    target: 'jsonSchema7',
  }) as Tool['inputSchema'],
};

export default async function cancelOrder(
  this: { bybitService: IBybitService; errorService: IErrorService },
  params: CancelOrderParams,
): Promise<CallToolResult> {
  try {
    const validated = cancelOrderInputSchema.parse(params);
    const result = await this.bybitService.cancelOrder(validated as Parameters<IBybitService['cancelOrder']>[0]);
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
      operation: 'cancelOrder',
      params,
      timestamp: new Date().toISOString(),
    });
  }
}
