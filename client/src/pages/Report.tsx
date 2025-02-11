import { useQuery } from '@tanstack/react-query';
import { useRoute } from 'wouter';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';
import MarketChart from '@/components/charts/MarketChart';
import CompetitorChart from '@/components/charts/CompetitorChart';
import SentimentChart from '@/components/charts/SentimentChart';
import { generatePDF } from '@/lib/pdfGenerator';
import { fetchMarketData } from '@/lib/marketDataService';
import { analyzeRedditSentiment } from '@/lib/redditService';
import type { StartupIdea } from '@shared/schema';
import { Download, HelpCircle } from 'lucide-react';

export default function Report() {
  const [, params] = useRoute('/report/:id');
  const id = params?.id ? parseInt(params.id) : 0;

  const { data: idea, isLoading: isIdeaLoading } = useQuery<StartupIdea>({
    queryKey: [`/api/startup-ideas/${id}`],
  });

  const { data: marketData, isLoading: isMarketLoading } = useQuery({
    queryKey: ['market-data', idea?.targetMarket.industry],
    queryFn: () => fetchMarketData(idea!.targetMarket.industry),
    enabled: !!idea,
  });

  const { data: sentimentData, isLoading: isSentimentLoading } = useQuery({
    queryKey: ['reddit-sentiment', idea?.name],
    queryFn: () => analyzeRedditSentiment(idea!.name, idea!.targetMarket.industry),
    enabled: !!idea,
  });

  const isLoading = isIdeaLoading || isMarketLoading || isSentimentLoading;

  if (isIdeaLoading) {
    return (
      <div className="min-h-screen bg-background py-8">
        <div className="container mx-auto px-4">
          <Skeleton className="h-12 w-1/3 mb-8" />
          <div className="grid gap-8">
            {Array.from({ length: 3 }).map((_, i) => (
              <Skeleton key={i} className="h-[400px] w-full" />
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (!idea) {
    return (
      <div className="min-h-screen bg-background py-8">
        <div className="container mx-auto px-4">
          <Card>
            <CardContent className="p-6 text-center">
              <p className="text-muted-foreground">Report not found</p>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background py-8">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold">{idea.name} - Market Analysis Report</h1>
          <Button onClick={() => generatePDF(idea)}>
            <Download className="mr-2 h-4 w-4" />
            Download PDF
          </Button>
        </div>

        <div className="grid gap-8">
          <Card>
            <CardHeader>
              <CardTitle>Executive Summary</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground mb-4">{idea.description}</p>
              <h3 className="font-semibold mb-2">Value Proposition</h3>
              <p className="text-muted-foreground">{idea.valueProposition}</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <div className="flex items-center gap-2">
                <CardTitle>Market Analysis</CardTitle>
                <Tooltip>
                  <TooltipTrigger>
                    <HelpCircle className="h-4 w-4 text-muted-foreground" />
                  </TooltipTrigger>
                  <TooltipContent>
                    <p className="max-w-xs">
                      Market analysis includes market size, growth rate, and industry trends based on real-time data.
                    </p>
                  </TooltipContent>
                </Tooltip>
              </div>
            </CardHeader>
            <CardContent>
              {isMarketLoading ? (
                <div className="space-y-4">
                  <Skeleton className="h-8 w-1/3" />
                  <Skeleton className="h-8 w-1/2" />
                  <Skeleton className="h-[300px] w-full" />
                </div>
              ) : (
                <>
                  <div className="grid md:grid-cols-2 gap-4 mb-6">
                    <div>
                      <h4 className="font-medium mb-1">Market Size</h4>
                      <p className="text-2xl font-bold">{marketData?.marketSize}</p>
                    </div>
                    <div>
                      <h4 className="font-medium mb-1">Growth Rate</h4>
                      <p className="text-2xl font-bold">{marketData?.growthRate}</p>
                    </div>
                  </div>
                  <MarketChart data={marketData} />
                </>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <div className="flex items-center gap-2">
                <CardTitle>Sentiment Analysis</CardTitle>
                <Tooltip>
                  <TooltipTrigger>
                    <HelpCircle className="h-4 w-4 text-muted-foreground" />
                  </TooltipTrigger>
                  <TooltipContent>
                    <p className="max-w-xs">
                      Analysis of social media sentiment and discussions about your idea or similar products.
                    </p>
                  </TooltipContent>
                </Tooltip>
              </div>
            </CardHeader>
            <CardContent>
              {isSentimentLoading ? (
                <div className="space-y-4">
                  <Skeleton className="h-8 w-1/3" />
                  <Skeleton className="h-[300px] w-full" />
                </div>
              ) : (
                <SentimentChart data={sentimentData} />
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <div className="flex items-center gap-2">
                <CardTitle>Competitor Analysis</CardTitle>
                <Tooltip>
                  <TooltipTrigger>
                    <HelpCircle className="h-4 w-4 text-muted-foreground" />
                  </TooltipTrigger>
                  <TooltipContent>
                    <p className="max-w-xs">
                      Overview of market competitors, their market share, and key features.
                    </p>
                  </TooltipContent>
                </Tooltip>
              </div>
            </CardHeader>
            <CardContent>
              {isMarketLoading ? (
                <div className="space-y-4">
                  <Skeleton className="h-8 w-1/3" />
                  <Skeleton className="h-[300px] w-full" />
                </div>
              ) : (
                <CompetitorChart data={marketData?.competitors} />
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}