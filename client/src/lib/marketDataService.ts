import { apiRequest } from './queryClient';

export interface MarketData {
  marketSize: string;
  growthRate: string;
  competitors: {
    name: string;
    marketShare: number;
    stockPrice?: number;
  }[];
  revenueProjections: {
    year: number;
    revenue: number;
  }[];
}

export async function fetchMarketData(industry: string): Promise<MarketData> {
  try {
    const response = await apiRequest('GET', `/api/market-data/${encodeURIComponent(industry)}`);
    return await response.json();
  } catch (error) {
    console.error('Error fetching market data:', error);
    throw error;
  }
}

export async function fetchCompetitorData(competitors: string[]): Promise<any> {
  try {
    const response = await apiRequest('POST', '/api/competitors/analysis', { competitors });
    return await response.json();
  } catch (error) {
    console.error('Error fetching competitor data:', error);
    throw error;
  }
}
