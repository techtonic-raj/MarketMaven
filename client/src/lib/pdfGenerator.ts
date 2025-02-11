import type { StartupIdea } from "@shared/schema";
import { mockMarketData, mockSentimentData } from "./mockData";

export async function generatePDF(idea: StartupIdea) {
  // This is a mock implementation. In a real app, you'd use a PDF library
  const content = `
    Market Validation Report
    
    ${idea.name}
    Generated on ${new Date().toLocaleDateString()}
    
    Executive Summary:
    ${idea.description}
    
    Value Proposition:
    ${idea.valueProposition}
    
    Market Analysis:
    Market Size: ${mockMarketData.marketSize}
    Growth Rate: ${mockMarketData.growthRate}
    
    Target Market:
    Demographics: ${JSON.stringify(idea.targetMarket)}
    
    Competitor Analysis:
    ${JSON.stringify(idea.competitors, null, 2)}
    
    Sentiment Analysis:
    Positive: ${mockSentimentData.positive}%
    Neutral: ${mockSentimentData.neutral}%
    Negative: ${mockSentimentData.negative}%
    
    Keywords:
    ${idea.keywords.join(", ")}
  `;

  // In a real implementation, convert this to PDF
  // For now, just create a Blob and download it
  const blob = new Blob([content], { type: 'text/plain' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `${idea.name.toLowerCase().replace(/\s+/g, '-')}-report.txt`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}
