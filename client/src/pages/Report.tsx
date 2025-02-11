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
import { Download, HelpCircle, Star, TrendingUp, Users, BarChart2, FileText } from 'lucide-react';
import { Progress } from '@/components/ui/progress';

export default function Report() {
  const [, params] = useRoute('/report/:id');
  const id = params?.id ? parseInt(params.id) : 0;

  const { data: idea, isLoading: isIdeaLoading } = useQuery<StartupIdea>({
    queryKey: [`/api/startup-ideas/${id}`],
  });

  const { data: analysis, isLoading: isAnalysisLoading } = useQuery({
    queryKey: [`/api/startup-ideas/${id}/analysis`],
    enabled: !!idea,
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

  const { data: recommendations, isLoading: isRecommendationsLoading } = useQuery({
    queryKey: [`/api/startup-ideas/${id}/recommendations`],
    enabled: !!idea,
  });

  const isLoading = isIdeaLoading || isAnalysisLoading || isMarketLoading || isSentimentLoading || isRecommendationsLoading;
  const loadingProgress = ((Number(!isIdeaLoading) + Number(!isAnalysisLoading) + 
    Number(!isMarketLoading) + Number(!isSentimentLoading) + Number(!isRecommendationsLoading)) / 5) * 100;

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background py-8">
        <div className="container mx-auto px-4">
          <div className="max-w-xl mx-auto mb-8">
            <Progress value={loadingProgress} className="h-2" />
            <p className="text-center text-sm text-muted-foreground mt-2">
              Analyzing your startup idea...
            </p>
          </div>
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
          <div>
            <h1 className="text-3xl font-bold mb-2">{idea.name}</h1>
            <div className="flex items-center gap-2">
              <Star className="h-5 w-5 text-yellow-500" />
              <span className="font-medium">
                Viability Score: {analysis?.executiveSummary.viabilityScore}/100
              </span>
            </div>
          </div>
          <Button onClick={() => generatePDF(idea)}>
            <Download className="mr-2 h-4 w-4" />
            Download Report
          </Button>
        </div>

        <div className="grid gap-8">
          {/* Executive Summary */}
          <Card>
            <CardHeader>
              <CardTitle>Executive Summary</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-muted-foreground">{analysis?.executiveSummary.overview}</p>
              <div className="mt-4">
                <h3 className="font-medium mb-2">Key Findings</h3>
                <ul className="list-disc list-inside space-y-1">
                  {analysis?.executiveSummary.keyFindings.map((finding, index) => (
                    <li key={index} className="text-muted-foreground">{finding}</li>
                  ))}
                </ul>
              </div>
            </CardContent>
          </Card>

          {/* Market Analysis */}
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
                      Comprehensive analysis of market size, growth potential, and industry trends.
                    </p>
                  </TooltipContent>
                </Tooltip>
              </div>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-2 gap-4 mb-6">
                <div>
                  <h4 className="font-medium mb-1">Market Size</h4>
                  <p className="text-2xl font-bold">{analysis?.marketAnalysis.marketSize}</p>
                </div>
                <div>
                  <h4 className="font-medium mb-1">Growth Potential</h4>
                  <p className="text-2xl font-bold">{analysis?.marketAnalysis.growthPotential}</p>
                </div>
              </div>
              <div className="mb-6">
                <h4 className="font-medium mb-2">Industry Trends</h4>
                <ul className="list-disc list-inside space-y-1">
                  {analysis?.marketAnalysis.industryTrends.map((trend, index) => (
                    <li key={index} className="text-muted-foreground">{trend}</li>
                  ))}
                </ul>
              </div>
              <MarketChart data={marketData} />
            </CardContent>
          </Card>

          {/* Competitor Analysis */}
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
                      Overview of market competitors, their strengths, and market gaps.
                    </p>
                  </TooltipContent>
                </Tooltip>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                {analysis?.competitorAnalysis.directCompetitors.map((competitor, index) => (
                  <div key={index} className="border-b pb-4 last:border-0">
                    <h4 className="font-medium mb-2">{competitor.name}</h4>
                    <div className="grid md:grid-cols-2 gap-4">
                      <div>
                        <h5 className="text-sm font-medium text-muted-foreground mb-1">Strengths</h5>
                        <ul className="list-disc list-inside space-y-1">
                          {competitor.strengths.map((strength, idx) => (
                            <li key={idx} className="text-sm">{strength}</li>
                          ))}
                        </ul>
                      </div>
                      <div>
                        <h5 className="text-sm font-medium text-muted-foreground mb-1">Weaknesses</h5>
                        <ul className="list-disc list-inside space-y-1">
                          {competitor.weaknesses.map((weakness, idx) => (
                            <li key={idx} className="text-sm">{weakness}</li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
              <CompetitorChart data={marketData?.competitors} />
            </CardContent>
          </Card>

          {/* SWOT Analysis */}
          <Card>
            <CardHeader>
              <CardTitle>SWOT Analysis</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <h4 className="font-medium mb-2 text-green-600">Strengths</h4>
                  <ul className="list-disc list-inside space-y-1">
                    {analysis?.swotAnalysis.strengths.map((item, index) => (
                      <li key={index} className="text-muted-foreground">{item}</li>
                    ))}
                  </ul>
                </div>
                <div>
                  <h4 className="font-medium mb-2 text-red-600">Weaknesses</h4>
                  <ul className="list-disc list-inside space-y-1">
                    {analysis?.swotAnalysis.weaknesses.map((item, index) => (
                      <li key={index} className="text-muted-foreground">{item}</li>
                    ))}
                  </ul>
                </div>
                <div>
                  <h4 className="font-medium mb-2 text-blue-600">Opportunities</h4>
                  <ul className="list-disc list-inside space-y-1">
                    {analysis?.swotAnalysis.opportunities.map((item, index) => (
                      <li key={index} className="text-muted-foreground">{item}</li>
                    ))}
                  </ul>
                </div>
                <div>
                  <h4 className="font-medium mb-2 text-yellow-600">Threats</h4>
                  <ul className="list-disc list-inside space-y-1">
                    {analysis?.swotAnalysis.threats.map((item, index) => (
                      <li key={index} className="text-muted-foreground">{item}</li>
                    ))}
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Sentiment Analysis */}
          <Card>
            <CardHeader>
              <div className="flex items-center gap-2">
                <CardTitle>Social Media Sentiment</CardTitle>
                <Tooltip>
                  <TooltipTrigger>
                    <HelpCircle className="h-4 w-4 text-muted-foreground" />
                  </TooltipTrigger>
                  <TooltipContent>
                    <p className="max-w-xs">
                      Analysis of social media discussions and sentiment about your idea.
                    </p>
                  </TooltipContent>
                </Tooltip>
              </div>
            </CardHeader>
            <CardContent>
              <div className="mb-6">
                <p className="text-muted-foreground">{sentimentData?.summary}</p>
              </div>
              <SentimentChart data={sentimentData} />
              <div className="mt-6">
                <h4 className="font-medium mb-2">Key Themes</h4>
                <div className="space-y-2">
                  {sentimentData?.keyThemes.map((theme, index) => (
                    <div key={index} className="flex items-center justify-between">
                      <span>{theme.theme}</span>
                      <span className="text-sm text-muted-foreground">
                        Mentions: {theme.frequency}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Recommendations */}
          <Card>
            <CardHeader>
              <CardTitle>Strategic Recommendations</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                <div>
                  <h4 className="font-medium mb-2">Recommended Features</h4>
                  <ul className="list-disc list-inside space-y-1">
                    {recommendations?.features.map((feature, index) => (
                      <li key={index} className="text-muted-foreground">{feature}</li>
                    ))}
                  </ul>
                </div>
                <div>
                  <h4 className="font-medium mb-2">Suggested Improvements</h4>
                  <ul className="list-disc list-inside space-y-1">
                    {recommendations?.improvements.map((improvement, index) => (
                      <li key={index} className="text-muted-foreground">{improvement}</li>
                    ))}
                  </ul>
                </div>
                <div>
                  <h4 className="font-medium mb-2">Marketing Strategies</h4>
                  <ul className="list-disc list-inside space-y-1">
                    {recommendations?.marketingStrategies.map((strategy, index) => (
                      <li key={index} className="text-muted-foreground">{strategy}</li>
                    ))}
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Implementation Timeline */}
          <Card>
            <CardHeader>
              <CardTitle>Implementation Timeline</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                {recommendations?.timeline.map((phase, index) => (
                  <div key={index} className="border-l-2 border-primary pl-4">
                    <h4 className="font-medium">
                      Phase {index + 1}: {phase.phase}
                    </h4>
                    <p className="text-sm text-muted-foreground mb-2">
                      Duration: {phase.duration}
                    </p>
                    <ul className="list-disc list-inside space-y-1">
                      {phase.activities.map((activity, idx) => (
                        <li key={idx} className="text-sm text-muted-foreground">
                          {activity}
                        </li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}