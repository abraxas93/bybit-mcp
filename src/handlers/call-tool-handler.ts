import {
  CallToolRequest,
  CallToolResult,
} from '@modelcontextprotocol/sdk/types.js';
import { IContainer } from '../container/index.js';
import echo from '../tools/echo.js';
import addTwoNumbers from '../tools/add-two-numbers.js';
import getTime from '../tools/get-time.js';
import getInstrumentsInfo from '../tools/market/get-instruments-info.js';
import getOrderbook from '../tools/market/get-orderbook.js';
import getTickers from '../tools/market/get-tickers.js';
import getKline from '../tools/market/get-kline.js';
import getRecentTrades from '../tools/market/get-recent-trades.js';
import getFundingRateHistory from '../tools/market/get-funding-rate-history.js';
import placeOrder from '../tools/trade/place-order.js';
import amendOrder from '../tools/trade/amend-order.js';
import cancelOrder from '../tools/trade/cancel-order.js';
import getOpenClosedOrders from '../tools/trade/get-open-closed-orders.js';
import getOrderHistory from '../tools/trade/get-order-history.js';
import getTradeHistory from '../tools/trade/get-trade-history.js';
import getPositionInfo from '../tools/position/get-position-info.js';
import setLeverage from '../tools/position/set-leverage.js';
import getWalletBalance from '../tools/account/get-wallet-balance.js';
import getAccountInfo from '../tools/account/get-account-info.js';

export async function handleToolCall(
  this: IContainer,
  request: CallToolRequest,
): Promise<CallToolResult> {
  const { name, arguments: args } = request.params;

  switch (name) {
    case 'echo':
      return echo.call(this, args);

    case 'add':
      return addTwoNumbers.call(this, args);

    case 'get_time':
      return getTime.call(this, args);

    case 'get_instruments_info':
      return await getInstrumentsInfo.call(this, args);

    case 'get_orderbook':
      return await getOrderbook.call(this, args);

    case 'get_tickers':
      return await getTickers.call(this, args);

    case 'get_kline':
      return await getKline.call(this, args);

    case 'get_recent_trades':
      return await getRecentTrades.call(this, args);

    case 'get_funding_rate_history':
      return await getFundingRateHistory.call(this, args);

    case 'place_order':
      return await placeOrder.call(this, args);

    case 'amend_order':
      return await amendOrder.call(this, args);

    case 'cancel_order':
      return await cancelOrder.call(this, args);

    case 'get_open_closed_orders':
      return await getOpenClosedOrders.call(this, args);

    case 'get_order_history':
      return await getOrderHistory.call(this, args);

    case 'get_trade_history':
      return await getTradeHistory.call(this, args);

    case 'get_position_info':
      return await getPositionInfo.call(this, args);

    case 'set_leverage':
      return await setLeverage.call(this, args);

    case 'get_wallet_balance':
      return await getWalletBalance.call(this, args);

    case 'get_account_info':
      return await getAccountInfo.call(this, args);

    default:
      throw new Error(`Unknown tool: ${name}`);
  }
}
