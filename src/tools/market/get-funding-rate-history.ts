import { zodToJsonSchema } from 'zod-to-json-schema';
import { z } from 'zod';
import { CallToolResult, Tool } from '@modelcontextprotocol/sdk/types.js';
import { IBybitService, IErrorService } from '../../services';

export const getFundingRateHistoryInputSchema = z.object({
  category: z
    .enum(['linear', 'inverse'])
    .describe('Product type: linear, inverse'),
  symbol: z.string().describe('Symbol name'),
  startTime: z.number().optional().describe('Start timestamp (ms)'),
  endTime: z.number().optional().describe('End timestamp (ms)'),
  limit: z.number().optional().describe('Limit for data size, max 1000'),
});

export type GetFundingRateHistoryParams = z.infer<
  typeof getFundingRateHistoryInputSchema
>;

export const GET_FUNDING_RATE_HISTORY_TOOL: Tool = {
  name: 'get_funding_rate_history',
  description:
    'Returns historical funding rates for perpetual contracts. Funding is an important cost for derivative strategies; a trading bot may use it to predict funding-rate-driven price moves or manage financing costs.',
  inputSchema: zodToJsonSchema(getFundingRateHistoryInputSchema, {
    target: 'jsonSchema7',
  }) as Tool['inputSchema'],
};

export default async function getFundingRateHistory(
  this: { bybitService: IBybitService; errorService: IErrorService },
  params: GetFundingRateHistoryParams,
): Promise<CallToolResult> {
  try {
    const validated = getFundingRateHistoryInputSchema.parse(params);
    const result = await this.bybitService.getFundingRateHistory(validated as Parameters<IBybitService['getFundingRateHistory']>[0]);
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
      operation: 'getFundingRateHistory',
      params,
      timestamp: new Date().toISOString(),
    });
  }
}
