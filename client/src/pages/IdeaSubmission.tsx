import MultiStepForm from '@/components/MultiStepForm';
import { Link } from 'wouter';
import { Button } from '@/components/ui/button';
import { RocketIcon } from 'lucide-react';
import { ThemeToggle } from '@/components/ThemeToggle';

export default function IdeaSubmission() {
  return (
    <div className="min-h-screen bg-background">
      <nav className="border-b">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <Link href="/">
            <div className="flex items-center space-x-2 cursor-pointer">
              <RocketIcon className="h-6 w-6 text-primary" />
              <span className="text-xl font-bold">Market Validator</span>
            </div>
          </Link>
          <div className="flex items-center space-x-4">
            <Link href="/">
              <Button variant="ghost">Home</Button>
            </Link>
            <Link href="/dashboard">
              <Button variant="ghost">Dashboard</Button>
            </Link>
            <ThemeToggle />
          </div>
        </div>
      </nav>

      <div className="container mx-auto px-4 py-8">
        <div className="max-w-2xl mx-auto text-center mb-8">
          <h1 className="text-3xl font-bold mb-4">Submit Your Startup Idea</h1>
          <p className="text-muted-foreground">
            Fill out the form below to get a comprehensive analysis of your startup idea.
          </p>
        </div>
        <MultiStepForm />
      </div>
    </div>
  );
}