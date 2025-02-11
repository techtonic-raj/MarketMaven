import { apiRequest } from './queryClient';

export interface RedditSentiment {
  overallSentiment: {
    positive: number;
    neutral: number;
    negative: number;
  };
  topPosts: {
    title: string;
    url: string;
    sentiment: 'positive' | 'neutral' | 'negative';
    score: number;
  }[];
  keywords: {
    text: string;
    count: number;
    sentiment: number;
  }[];
}

export async function analyzeRedditSentiment(
  idea: string,
  industry: string
): Promise<RedditSentiment> {
  try {
    const response = await apiRequest('POST', '/api/reddit/analyze', {
      idea,
      industry,
    });
    return await response.json();
  } catch (error) {
    console.error('Error analyzing Reddit sentiment:', error);
    throw error;
  }
}
