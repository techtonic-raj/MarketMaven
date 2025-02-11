import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { RocketIcon, TrendingUpIcon, UsersIcon, SearchIcon } from "lucide-react";

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-background">
      <nav className="border-b">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <div className="flex items-center space-x-2">
            <RocketIcon className="h-6 w-6 text-primary" />
            <span className="text-xl font-bold">Market Validator</span>
          </div>
          <div className="space-x-4">
            <Link href="/submit">
              <Button variant="ghost">Get Started</Button>
            </Link>
            <Link href="/dashboard">
              <Button variant="ghost">Dashboard</Button>
            </Link>
          </div>
        </div>
      </nav>

      <main>
        <section className="py-20 text-center">
          <div className="container mx-auto px-4">
            <h1 className="text-4xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-primary to-blue-600 bg-clip-text text-transparent">
              Validate Your Startup Idea with Data-Driven Insights
            </h1>
            <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
              Analyze market trends, competitors, and online sentiment to make informed decisions about your startup idea.
            </p>
            <Link href="/submit">
              <Button size="lg" className="text-lg">
                Get Started
              </Button>
            </Link>
          </div>
        </section>

        <section className="py-20 bg-muted/50">
          <div className="container mx-auto px-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <Card>
                <CardContent className="p-6 text-center">
                  <TrendingUpIcon className="h-12 w-12 mx-auto mb-4 text-primary" />
                  <h3 className="text-xl font-semibold mb-2">Market Analysis</h3>
                  <p className="text-muted-foreground">
                    Get detailed insights into market size, trends, and growth potential.
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-6 text-center">
                  <UsersIcon className="h-12 w-12 mx-auto mb-4 text-primary" />
                  <h3 className="text-xl font-semibold mb-2">Competitor Research</h3>
                  <p className="text-muted-foreground">
                    Understand your competition and identify market gaps.
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-6 text-center">
                  <SearchIcon className="h-12 w-12 mx-auto mb-4 text-primary" />
                  <h3 className="text-xl font-semibold mb-2">Sentiment Analysis</h3>
                  <p className="text-muted-foreground">
                    Analyze social media sentiment to gauge market reception.
                  </p>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}
