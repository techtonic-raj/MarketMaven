import MultiStepForm from '@/components/MultiStepForm';

export default function IdeaSubmission() {
  return (
    <div className="min-h-screen bg-background py-8">
      <div className="container mx-auto px-4">
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
