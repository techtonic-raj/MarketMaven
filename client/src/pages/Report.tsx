import { useQuery } from '@tanstack/react-query';
import { useRoute } from 'wouter';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import MarketChart from '@/components/charts/MarketChart';
import CompetitorChart from '@/components/charts/CompetitorChart';
import SentimentChart from '@/components/charts/SentimentChart';
import { generatePDF } from '@/lib/pdfGenerator';
import type { StartupIdea } from '@shared/schema';
import { Download } from 'lucide-react';

export default function Report() {
  const [, params] = useRoute('/report/:id');
  const id = params?.id ? parseInt(params.id) : 0;

  const { data: idea, isLoading } = useQuery<StartupIdea>({
    queryKey: [`/api/startup-ideas/${id}`],
  });

  if (isLoading) {
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

          <div className="grid md:grid-cols-2 gap-8">
            <Card>
              <CardHeader>
                <CardTitle>Target Market</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <p>
                    <span className="font-semibold">Demographics:</span>{' '}
                    {idea.targetMarket.demographics}
                  </p>
                  <p>
                    <span className="font-semibold">Market Size:</span>{' '}
                    {idea.targetMarket.marketSize}
                  </p>
                  <p>
                    <span className="font-semibold">Industry:</span>{' '}
                    {idea.targetMarket.industry}
                  </p>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Keywords</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex flex-wrap gap-2">
                  {idea.keywords.map((keyword) => (
                    <span
                      key={keyword}
                      className="px-3 py-1 bg-primary/10 text-primary rounded-full text-sm"
                    >
                      {keyword}
                    </span>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          <MarketChart />
          <CompetitorChart />
          <SentimentChart />
        </div>
      </div>
    </div>
  );
}
