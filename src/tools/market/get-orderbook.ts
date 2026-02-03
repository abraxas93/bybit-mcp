import { zodToJsonSchema } from 'zod-to-json-schema';
import { z } from 'zod';
import { CallToolResult, Tool } from '@modelcontextprotocol/sdk/types.js';
import { IBybitService, IErrorService } from '../../services';

export const getOrderbookInputSchema = z.object({
  category: z
    .enum(['spot', 'linear', 'inverse', 'option'])
    .describe('Product type: spot, linear, inverse, option'),
  symbol: z.string().describe('Symbol name'),
  limit: z.number().optional().describe('Limit for data size, max 1000'),
});

export type GetOrderbookParams = z.infer<typeof getOrderbookInputSchema>;

export const GET_ORDERBOOK_TOOL: Tool = {
  name: 'get_orderbook',
  description:
    'Provides a snapshot of the order book (up to 1000 levels) for a given symbol. Real-time order-book depth is essential for assessing liquidity and determining limit prices or slippage control.',
  inputSchema: zodToJsonSchema(getOrderbookInputSchema, {
    target: 'jsonSchema7',
  }) as Tool['inputSchema'],
};

export default async function getOrderbook(
  this: { bybitService: IBybitService; errorService: IErrorService },
  params: GetOrderbookParams,
): Promise<CallToolResult> {
  try {
    const validated = getOrderbookInputSchema.parse(params);
    const result = await this.bybitService.getOrderbook(validated as Parameters<IBybitService['getOrderbook']>[0]);
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
      operation: 'getOrderbook',
      params,
      timestamp: new Date().toISOString(),
    });
  }
}
