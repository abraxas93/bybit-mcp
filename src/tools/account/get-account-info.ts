import { zodToJsonSchema } from 'zod-to-json-schema';
import { z } from 'zod';
import { CallToolResult, Tool } from '@modelcontextprotocol/sdk/types.js';
import { IBybitService, IErrorService } from '../../services';

export const getAccountInfoInputSchema = z.object({
  random_string: z
    .string()
    .optional()
    .describe('Dummy parameter for no-parameter tools'),
});

export type GetAccountInfoParams = z.infer<typeof getAccountInfoInputSchema>;

export const GET_ACCOUNT_INFO_TOOL: Tool = {
  name: 'get_account_info',
  description:
    'Returns account settings such as margin mode (isolated, regular or portfolio), unified-margin status, spot-hedging status and update time. Knowing the account mode is important for correct margin calculations and risk management.',
  inputSchema: zodToJsonSchema(getAccountInfoInputSchema, {
    target: 'jsonSchema7',
  }) as Tool['inputSchema'],
};

export default async function getAccountInfo(
  this: { bybitService: IBybitService; errorService: IErrorService },
  _params: GetAccountInfoParams,
): Promise<CallToolResult> {
  try {
    const result = await this.bybitService.getAccountInfo();
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
      operation: 'getAccountInfo',
      params: {},
      timestamp: new Date().toISOString(),
    });
  }
}
