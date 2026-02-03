import { zodToJsonSchema } from 'zod-to-json-schema';
import { z } from 'zod';
import { CallToolResult, Tool } from '@modelcontextprotocol/sdk/types.js';
import { IBybitService, IErrorService } from '../../services';

export const getPositionInfoInputSchema = z.object({
  category: z
    .enum(['linear', 'inverse', 'option'])
    .describe('Product type: linear, inverse, option'),
  symbol: z.string().optional().describe('Symbol name'),
  baseCoin: z.string().optional().describe('Base coin'),
  settleCoin: z.string().optional().describe('Settle coin'),
  limit: z.number().optional().describe('Limit for data size'),
  cursor: z.string().optional().describe('Cursor'),
});

export type GetPositionInfoParams = z.infer<typeof getPositionInfoInputSchema>;

export const GET_POSITION_INFO_TOOL: Tool = {
  name: 'get_position_info',
  description:
    'Provides real-time position details such as size, average entry price, mark price, unrealised P&L, margin mode and liquidation price. A trading agent uses this to track its exposure and risk.',
  inputSchema: zodToJsonSchema(getPositionInfoInputSchema, {
    target: 'jsonSchema7',
  }) as Tool['inputSchema'],
};

export default async function getPositionInfo(
  this: { bybitService: IBybitService; errorService: IErrorService },
  params: GetPositionInfoParams,
): Promise<CallToolResult> {
  try {
    const validated = getPositionInfoInputSchema.parse(params);
    const result = await this.bybitService.getPositionInfo(validated as Parameters<IBybitService['getPositionInfo']>[0]);
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
      operation: 'getPositionInfo',
      params,
      timestamp: new Date().toISOString(),
    });
  }
}
