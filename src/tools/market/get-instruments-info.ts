import { zodToJsonSchema } from 'zod-to-json-schema';
import { z } from 'zod';
import { CallToolResult, Tool } from '@modelcontextprotocol/sdk/types.js';
import { IBybitService, IErrorService } from '../../services';

export const getInstrumentsInfoInputSchema = z.object({
  category: z
    .enum(['spot', 'linear', 'inverse', 'option'])
    .describe('Product type: spot, linear, inverse, option'),
  symbol: z.string().optional().describe('Symbol name'),
  baseCoin: z.string().optional().describe('Base coin'),
  limit: z.number().optional().describe('Limit for data size'),
  cursor: z.string().optional().describe('Cursor'),
});

export type GetInstrumentsInfoParams = z.infer<
  typeof getInstrumentsInfoInputSchema
>;

export const GET_INSTRUMENTS_INFO_TOOL: Tool = {
  name: 'get_instruments_info',
  description:
    'Returns contract/spot instrument specifications including price scale, tick size, order-quantity limits and leverage filters. A trading system needs this data to correctly format orders (e.g., choose a valid price increment and quantity) and to know which symbols are available.',
  inputSchema: zodToJsonSchema(getInstrumentsInfoInputSchema, {
    target: 'jsonSchema7',
  }) as Tool['inputSchema'],
};

export default async function getInstrumentsInfo(
  this: { bybitService: IBybitService; errorService: IErrorService },
  params: GetInstrumentsInfoParams,
): Promise<CallToolResult> {
  try {
    const validated = getInstrumentsInfoInputSchema.parse(params);
    const result = await this.bybitService.getInstrumentsInfo(validated as Parameters<IBybitService['getInstrumentsInfo']>[0]);
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
      operation: 'getInstrumentsInfo',
      params,
      timestamp: new Date().toISOString(),
    });
  }
}
