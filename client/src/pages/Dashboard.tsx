import { useQuery } from '@tanstack/react-query';
import { Link } from 'wouter';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import type { StartupIdea } from '@shared/schema';
import { Skeleton } from '@/components/ui/skeleton';

export default function Dashboard() {
  const { data: ideas, isLoading } = useQuery<StartupIdea[]>({
    queryKey: ['/api/startup-ideas'],
  });

  return (
    <div className="min-h-screen bg-background py-8">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold">Your Startup Ideas</h1>
          <Link href="/submit">
            <Button>Submit New Idea</Button>
          </Link>
        </div>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {isLoading &&
            Array.from({ length: 3 }).map((_, i) => (
              <Card key={i}>
                <CardHeader>
                  <Skeleton className="h-6 w-3/4" />
                </CardHeader>
                <CardContent>
                  <Skeleton className="h-20 w-full mb-4" />
                  <Skeleton className="h-8 w-1/2" />
                </CardContent>
              </Card>
            ))}

          {ideas?.map((idea) => (
            <Card key={idea.id}>
              <CardHeader>
                <CardTitle>{idea.name}</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground mb-4 line-clamp-3">
                  {idea.description}
                </p>
                <Link href={`/report/${idea.id}`}>
                  <Button className="w-full">View Report</Button>
                </Link>
              </CardContent>
            </Card>
          ))}

          {!isLoading && !ideas?.length && (
            <Card className="col-span-full">
              <CardContent className="p-6 text-center">
                <p className="text-muted-foreground">
                  No startup ideas submitted yet. Start by submitting your first idea!
                </p>
                <Link href="/submit">
                  <Button className="mt-4">Submit Idea</Button>
                </Link>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}
