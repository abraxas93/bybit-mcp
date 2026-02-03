import { zodToJsonSchema } from 'zod-to-json-schema';
import { z } from 'zod';
import { CallToolResult, Tool } from '@modelcontextprotocol/sdk/types.js';
import { IBybitService, IErrorService } from '../../services';

export const getKlineInputSchema = z.object({
  category: z
    .enum(['spot', 'linear', 'inverse', 'option'])
    .describe('Product type: spot, linear, inverse, option'),
  symbol: z.string().describe('Symbol name'),
  interval: z
    .string()
    .describe(
      'Kline interval: 1, 3, 5, 15, 30, 60, 120, 240, 360, 720, D, M, W',
    ),
  start: z.number().optional().describe('Start timestamp (ms)'),
  end: z.number().optional().describe('End timestamp (ms)'),
  limit: z.number().optional().describe('Limit for data size, max 1000'),
});

export type GetKlineParams = z.infer<typeof getKlineInputSchema>;

export const GET_KLINE_TOOL: Tool = {
  name: 'get_kline',
  description:
    'Fetches historical candlestick (OHLCV) data for various intervals. Candles are used for technical indicators, backtesting and strategy signals.',
  inputSchema: zodToJsonSchema(getKlineInputSchema, {
    target: 'jsonSchema7',
  }) as Tool['inputSchema'],
};

export default async function getKline(
  this: { bybitService: IBybitService; errorService: IErrorService },
  params: GetKlineParams,
): Promise<CallToolResult> {
  try {
    const validated = getKlineInputSchema.parse(params);
    const result = await this.bybitService.getKline(validated as Parameters<IBybitService['getKline']>[0]);
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
      operation: 'getKline',
      params,
      timestamp: new Date().toISOString(),
    });
  }
}
