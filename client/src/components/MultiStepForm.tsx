import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { insertStartupIdeaSchema, type InsertStartupIdea } from '@shared/schema';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { apiRequest } from '@/lib/queryClient';
import { useLocation, Link } from 'wouter';

const steps = [
  { title: 'Idea Overview', fields: ['name', 'description', 'valueProposition'] },
  { title: 'Market Details', fields: ['targetMarket'] },
  { title: 'Competition', fields: ['competitors'] },
  { title: 'Keywords', fields: ['keywords'] },
];

export default function MultiStepForm() {
  const [step, setStep] = useState(0);
  const [, navigate] = useLocation();
  const { toast } = useToast();

  const form = useForm<InsertStartupIdea>({
    resolver: zodResolver(insertStartupIdeaSchema),
    defaultValues: {
      name: '',
      description: '',
      valueProposition: '',
      targetMarket: {
        demographics: '',
        marketSize: '',
        industry: '',
      },
      competitors: [],
      keywords: [],
    },
  });

  const onSubmit = async (data: InsertStartupIdea) => {
    try {
      const response = await apiRequest('POST', '/api/startup-ideas', data);
      const idea = await response.json();
      toast({
        title: 'Success!',
        description: (
          <div className="space-y-2">
            <p>Your startup idea has been submitted successfully.</p>
            <div className="flex gap-2 mt-2">
              <Button variant="outline" size="sm" asChild>
                <Link href="/dashboard">View All Ideas</Link>
              </Button>
              <Button size="sm" asChild>
                <Link href={`/report/${idea.id}`}>View Report</Link>
              </Button>
            </div>
          </div>
        ),
      });
      navigate(`/report/${idea.id}`);
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to submit startup idea.',
        variant: 'destructive',
      });
    }
  };

  const currentFields = steps[step].fields;
  const isLastStep = step === steps.length - 1;

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardContent className="pt-6">
        <div className="mb-8">
          <div className="flex justify-between mb-2">
            {steps.map((s, i) => (
              <div
                key={i}
                className={`flex-1 h-2 mx-1 rounded ${
                  i <= step ? 'bg-primary' : 'bg-muted'
                }`}
              />
            ))}
          </div>
          <h2 className="text-2xl font-bold">{steps[step].title}</h2>
        </div>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(isLastStep ? onSubmit : () => setStep(step + 1))}>
            {currentFields.includes('name') && (
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem className="mb-4">
                    <FormLabel>Startup Name</FormLabel>
                    <FormControl>
                      <Input {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            )}

            {currentFields.includes('description') && (
              <FormField
                control={form.control}
                name="description"
                render={({ field }) => (
                  <FormItem className="mb-4">
                    <FormLabel>Description</FormLabel>
                    <FormControl>
                      <Textarea {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            )}

            {currentFields.includes('valueProposition') && (
              <FormField
                control={form.control}
                name="valueProposition"
                render={({ field }) => (
                  <FormItem className="mb-4">
                    <FormLabel>Value Proposition</FormLabel>
                    <FormControl>
                      <Textarea {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            )}

            {currentFields.includes('targetMarket') && (
              <>
                <FormField
                  control={form.control}
                  name="targetMarket.demographics"
                  render={({ field }) => (
                    <FormItem className="mb-4">
                      <FormLabel>Target Demographics</FormLabel>
                      <FormControl>
                        <Input {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="targetMarket.marketSize"
                  render={({ field }) => (
                    <FormItem className="mb-4">
                      <FormLabel>Market Size</FormLabel>
                      <FormControl>
                        <Input {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="targetMarket.industry"
                  render={({ field }) => (
                    <FormItem className="mb-4">
                      <FormLabel>Industry</FormLabel>
                      <FormControl>
                        <Input {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </>
            )}

            {currentFields.includes('competitors') && (
              <FormField
                control={form.control}
                name="competitors"
                render={({ field }) => (
                  <FormItem className="mb-4">
                    <FormLabel>Competitors (comma-separated)</FormLabel>
                    <FormControl>
                      <Input
                        {...field}
                        value={field.value?.join(', ') || ''}
                        onChange={(e) =>
                          field.onChange(e.target.value.split(',').map((s) => s.trim()))
                        }
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            )}

            {currentFields.includes('keywords') && (
              <FormField
                control={form.control}
                name="keywords"
                render={({ field }) => (
                  <FormItem className="mb-4">
                    <FormLabel>Keywords (comma-separated)</FormLabel>
                    <FormControl>
                      <Input
                        {...field}
                        value={field.value?.join(', ') || ''}
                        onChange={(e) =>
                          field.onChange(e.target.value.split(',').map((s) => s.trim()))
                        }
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            )}

            <div className="flex justify-between mt-6">
              {step > 0 && (
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setStep(step - 1)}
                >
                  Previous
                </Button>
              )}
              <Button type="submit" className="ml-auto">
                {isLastStep ? 'Submit' : 'Next'}
              </Button>
            </div>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}