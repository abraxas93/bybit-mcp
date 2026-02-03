import { RestClientV5 } from 'bybit-api';
import {
  BYBIT_API_KEY,
  BYBIT_API_SECRET,
  BYBIT_TESTNET,
  BYBIT_DEMO_TRADING,
} from '../config/index.js';

export interface IBybitService {
  getInstrumentsInfo(params: {
    category: 'spot' | 'linear' | 'inverse' | 'option';
    symbol?: string;
    baseCoin?: string;
    limit?: number;
    cursor?: string;
  }): Promise<unknown>;

  getOrderbook(params: {
    category: 'spot' | 'linear' | 'inverse' | 'option';
    symbol: string;
    limit?: number;
  }): Promise<unknown>;

  getTickers(params: {
    category: 'spot' | 'linear' | 'inverse' | 'option';
    symbol?: string;
    baseCoin?: string;
    expDate?: string;
  }): Promise<unknown>;

  getKline(params: {
    category: 'spot' | 'linear' | 'inverse' | 'option';
    symbol: string;
    interval: string;
    start?: number;
    end?: number;
    limit?: number;
  }): Promise<unknown>;

  getRecentTrades(params: {
    category: 'spot' | 'linear' | 'inverse' | 'option';
    symbol: string;
    limit?: number;
  }): Promise<unknown>;

  getFundingRateHistory(params: {
    category: 'linear' | 'inverse';
    symbol: string;
    startTime?: number;
    endTime?: number;
    limit?: number;
  }): Promise<unknown>;

  placeOrder(params: {
    category: 'spot' | 'linear' | 'inverse' | 'option';
    symbol: string;
    side: 'Buy' | 'Sell';
    orderType: 'Market' | 'Limit';
    qty: string;
    price?: string;
    timeInForce?: 'GTC' | 'IOC' | 'FOK' | 'PostOnly';
    orderLinkId?: string;
    reduceOnly?: boolean;
    closeOnTrigger?: boolean;
    positionIdx?: number;
    stopLoss?: string;
    takeProfit?: string;
    tpTriggerBy?: string;
    slTriggerBy?: string;
    triggerPrice?: string;
    triggerBy?: string;
    orderFilter?: string;
  }): Promise<unknown>;

  amendOrder(params: {
    category: 'spot' | 'linear' | 'inverse' | 'option';
    symbol: string;
    orderId?: string;
    orderLinkId?: string;
    orderIv?: string;
    triggerPrice?: string;
    qty?: string;
    price?: string;
    takeProfit?: string;
    stopLoss?: string;
    tpTriggerBy?: string;
    slTriggerBy?: string;
    triggerBy?: string;
  }): Promise<unknown>;

  cancelOrder(params: {
    category: 'spot' | 'linear' | 'inverse' | 'option';
    symbol: string;
    orderId?: string;
    orderLinkId?: string;
    orderFilter?: string;
  }): Promise<unknown>;

  getOpenClosedOrders(params: {
    category: 'spot' | 'linear' | 'inverse' | 'option';
    symbol?: string;
    baseCoin?: string;
    settleCoin?: string;
    orderId?: string;
    orderLinkId?: string;
    openOnly?: number;
    orderFilter?: string;
    limit?: number;
    cursor?: string;
  }): Promise<unknown>;

  getOrderHistory(params: {
    category: 'spot' | 'linear' | 'inverse' | 'option';
    symbol?: string;
    orderId?: string;
    orderLinkId?: string;
    orderFilter?: string;
    startTime?: number;
    endTime?: number;
    limit?: number;
    cursor?: string;
  }): Promise<unknown>;

  getTradeHistory(params: {
    category: 'spot' | 'linear' | 'inverse' | 'option';
    symbol?: string;
    orderId?: string;
    orderLinkId?: string;
    baseCoin?: string;
    startTime?: number;
    endTime?: number;
    execType?: string;
    limit?: number;
    cursor?: string;
  }): Promise<unknown>;

  getPositionInfo(params: {
    category: 'linear' | 'inverse' | 'option';
    symbol?: string;
    baseCoin?: string;
    settleCoin?: string;
    limit?: number;
    cursor?: string;
  }): Promise<unknown>;

  setLeverage(params: {
    category: 'linear' | 'inverse';
    symbol: string;
    buyLeverage: string;
    sellLeverage: string;
  }): Promise<unknown>;

  getWalletBalance(params: {
    accountType: 'UNIFIED' | 'CONTRACT' | 'SPOT' | 'INVESTMENT' | 'OPTION' | 'FUND';
    coin?: string;
  }): Promise<unknown>;

  getAccountInfo(): Promise<unknown>;
}

export class BybitService implements IBybitService {
  private client: RestClientV5;

  constructor() {
    this.client = new RestClientV5({
      key: BYBIT_API_KEY,
      secret: BYBIT_API_SECRET,
      testnet: BYBIT_TESTNET,
      demoTrading: BYBIT_DEMO_TRADING,
    });
  }

  async getInstrumentsInfo(params: {
    category: 'spot' | 'linear' | 'inverse' | 'option';
    symbol?: string;
    baseCoin?: string;
    limit?: number;
    cursor?: string;
  }): Promise<unknown> {
    const result = await this.client.getInstrumentsInfo(params);
    return result;
  }

  async getOrderbook(params: {
    category: 'spot' | 'linear' | 'inverse' | 'option';
    symbol: string;
    limit?: number;
  }): Promise<unknown> {
    const result = await this.client.getOrderbook(params);
    return result;
  }

  async getTickers(params: {
    category: 'spot' | 'linear' | 'inverse' | 'option';
    symbol?: string;
    baseCoin?: string;
    expDate?: string;
  }): Promise<unknown> {
    const result = await this.client.getTickers(params as any);
    return result;
  }

  async getKline(params: {
    category: 'spot' | 'linear' | 'inverse' | 'option';
    symbol: string;
    interval: string;
    start?: number;
    end?: number;
    limit?: number;
  }): Promise<unknown> {
    // Kline doesn't support 'option' category, filter it out
    if (params.category === 'option') {
      throw new Error('Kline endpoint does not support option category');
    }
    const result = await this.client.getKline(params as any);
    return result;
  }

  async getRecentTrades(params: {
    category: 'spot' | 'linear' | 'inverse' | 'option';
    symbol: string;
    limit?: number;
  }): Promise<unknown> {
    const result = await (this.client as any).getPublicTrades(params);
    return result;
  }

  async getFundingRateHistory(params: {
    category: 'linear' | 'inverse';
    symbol: string;
    startTime?: number;
    endTime?: number;
    limit?: number;
  }): Promise<unknown> {
    const result = await this.client.getFundingRateHistory(params);
    return result;
  }

  async placeOrder(params: {
    category: 'spot' | 'linear' | 'inverse' | 'option';
    symbol: string;
    side: 'Buy' | 'Sell';
    orderType: 'Market' | 'Limit';
    qty: string;
    price?: string;
    timeInForce?: 'GTC' | 'IOC' | 'FOK' | 'PostOnly';
    orderLinkId?: string;
    reduceOnly?: boolean;
    closeOnTrigger?: boolean;
    positionIdx?: number;
    stopLoss?: string;
    takeProfit?: string;
    tpTriggerBy?: string;
    slTriggerBy?: string;
    triggerPrice?: string;
    triggerBy?: string;
    orderFilter?: string;
  }): Promise<unknown> {
    const result = await this.client.submitOrder(params as any);
    return result;
  }

  async amendOrder(params: {
    category: 'spot' | 'linear' | 'inverse' | 'option';
    symbol: string;
    orderId?: string;
    orderLinkId?: string;
    orderIv?: string;
    triggerPrice?: string;
    qty?: string;
    price?: string;
    takeProfit?: string;
    stopLoss?: string;
    tpTriggerBy?: string;
    slTriggerBy?: string;
    triggerBy?: string;
  }): Promise<unknown> {
    const result = await this.client.amendOrder(params as any);
    return result;
  }

  async cancelOrder(params: {
    category: 'spot' | 'linear' | 'inverse' | 'option';
    symbol: string;
    orderId?: string;
    orderLinkId?: string;
    orderFilter?: string;
  }): Promise<unknown> {
    const result = await this.client.cancelOrder(params as any);
    return result;
  }

  async getOpenClosedOrders(params: {
    category: 'spot' | 'linear' | 'inverse' | 'option';
    symbol?: string;
    baseCoin?: string;
    settleCoin?: string;
    orderId?: string;
    orderLinkId?: string;
    openOnly?: number;
    orderFilter?: string;
    limit?: number;
    cursor?: string;
  }): Promise<unknown> {
    const result = await (this.client as any).getOpenOrders(params);
    return result;
  }

  async getOrderHistory(params: {
    category: 'spot' | 'linear' | 'inverse' | 'option';
    symbol?: string;
    orderId?: string;
    orderLinkId?: string;
    orderFilter?: string;
    startTime?: number;
    endTime?: number;
    limit?: number;
    cursor?: string;
  }): Promise<unknown> {
    const result = await this.client.getHistoricOrders(params as any);
    return result;
  }

  async getTradeHistory(params: {
    category: 'spot' | 'linear' | 'inverse' | 'option';
    symbol?: string;
    orderId?: string;
    orderLinkId?: string;
    baseCoin?: string;
    startTime?: number;
    endTime?: number;
    execType?: string;
    limit?: number;
    cursor?: string;
  }): Promise<unknown> {
    const result = await this.client.getExecutionList(params as any);
    return result;
  }

  async getPositionInfo(params: {
    category: 'linear' | 'inverse' | 'option';
    symbol?: string;
    baseCoin?: string;
    settleCoin?: string;
    limit?: number;
    cursor?: string;
  }): Promise<unknown> {
    const result = await this.client.getPositionInfo(params);
    return result;
  }

  async setLeverage(params: {
    category: 'linear' | 'inverse';
    symbol: string;
    buyLeverage: string;
    sellLeverage: string;
  }): Promise<unknown> {
    const result = await this.client.setLeverage(params);
    return result;
  }

  async getWalletBalance(params: {
    accountType: 'UNIFIED' | 'CONTRACT' | 'SPOT' | 'INVESTMENT' | 'OPTION' | 'FUND';
    coin?: string;
  }): Promise<unknown> {
    const result = await this.client.getWalletBalance(params);
    return result;
  }

  async getAccountInfo(): Promise<unknown> {
    const result = await this.client.getAccountInfo();
    return result;
  }
}
