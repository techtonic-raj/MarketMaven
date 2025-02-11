import { apiRequest } from './queryClient';

export interface RedditSentiment {
  summary: string;
  overallSentiment: {
    positive: number;
    neutral: number;
    negative: number;
  };
  keyThemes: Array<{
    theme: string;
    frequency: number;
    sentiment: number;
  }>;
  topPosts: {
    title: string;
    url: string;
    sentiment: 'positive' | 'neutral' | 'negative';
    score: number;
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