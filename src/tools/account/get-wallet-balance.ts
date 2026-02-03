import { zodToJsonSchema } from 'zod-to-json-schema';
import { z } from 'zod';
import { CallToolResult, Tool } from '@modelcontextprotocol/sdk/types.js';
import { IBybitService, IErrorService } from '../../services';

export const getWalletBalanceInputSchema = z.object({
  accountType: z
    .enum(['UNIFIED', 'CONTRACT', 'SPOT', 'INVESTMENT', 'OPTION', 'FUND'])
    .describe('Account type'),
  coin: z.string().optional().describe('Coin name'),
});

export type GetWalletBalanceParams = z.infer<
  typeof getWalletBalanceInputSchema
>;

export const GET_WALLET_BALANCE_TOOL: Tool = {
  name: 'get_wallet_balance',
  description:
    'Retrieves account balances, equity, margin balance, available balance and per-coin details. The trading bot uses this to ensure sufficient funds and to manage capital allocation.',
  inputSchema: zodToJsonSchema(getWalletBalanceInputSchema, {
    target: 'jsonSchema7',
  }) as Tool['inputSchema'],
};

export default async function getWalletBalance(
  this: { bybitService: IBybitService; errorService: IErrorService },
  params: GetWalletBalanceParams,
): Promise<CallToolResult> {
  try {
    const validated = getWalletBalanceInputSchema.parse(params);
    const result = await this.bybitService.getWalletBalance(validated as Parameters<IBybitService['getWalletBalance']>[0]);
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
      operation: 'getWalletBalance',
      params,
      timestamp: new Date().toISOString(),
    });
  }
}
