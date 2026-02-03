import { zodToJsonSchema } from 'zod-to-json-schema';
import { z } from 'zod';
import { CallToolResult, Tool } from '@modelcontextprotocol/sdk/types.js';
import { IBybitService, IErrorService } from '../../services';

export const setLeverageInputSchema = z.object({
  category: z
    .enum(['linear', 'inverse'])
    .describe('Product type: linear, inverse'),
  symbol: z.string().describe('Symbol name'),
  buyLeverage: z.string().describe('Buy leverage'),
  sellLeverage: z.string().describe('Sell leverage'),
});

export type SetLeverageParams = z.infer<typeof setLeverageInputSchema>;

export const SET_LEVERAGE_TOOL: Tool = {
  name: 'set_leverage',
  description:
    'Changes the leverage for a symbol (requires specifying separate buy and sell leverage). Managing leverage is a risk-control tool; an automated trader may adjust leverage before entering positions.',
  inputSchema: zodToJsonSchema(setLeverageInputSchema, {
    target: 'jsonSchema7',
  }) as Tool['inputSchema'],
};

export default async function setLeverage(
  this: { bybitService: IBybitService; errorService: IErrorService },
  params: SetLeverageParams,
): Promise<CallToolResult> {
  try {
    const validated = setLeverageInputSchema.parse(params);
    const result = await this.bybitService.setLeverage(validated as Parameters<IBybitService['setLeverage']>[0]);
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
      operation: 'setLeverage',
      params,
      timestamp: new Date().toISOString(),
    });
  }
}
