export function analyzeSentiment(text: string) {
  // Mock sentiment analysis using simple keyword matching
  const positiveWords = ['good', 'great', 'excellent', 'amazing', 'love', 'innovative'];
  const negativeWords = ['bad', 'poor', 'terrible', 'hate', 'awful'];
  
  const words = text.toLowerCase().split(/\s+/);
  
  let positive = 0;
  let negative = 0;
  let neutral = 0;
  
  words.forEach(word => {
    if (positiveWords.includes(word)) positive++;
    else if (negativeWords.includes(word)) negative++;
    else neutral++;
  });
  
  const total = positive + negative + neutral;
  
  return {
    positive: Math.round((positive / total) * 100),
    negative: Math.round((negative / total) * 100),
    neutral: Math.round((neutral / total) * 100),
  };
}

export function getSentimentColor(sentiment: number) {
  if (sentiment >= 70) return 'text-green-500';
  if (sentiment >= 40) return 'text-yellow-500';
  return 'text-red-500';
}
