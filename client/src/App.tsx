import { Switch, Route } from "wouter";
import { QueryClientProvider } from "@tanstack/react-query";
import { queryClient } from "./lib/queryClient";
import { Toaster } from "@/components/ui/toaster";
import LandingPage from "@/pages/LandingPage";
import IdeaSubmission from "@/pages/IdeaSubmission";
import Dashboard from "@/pages/Dashboard";
import Report from "@/pages/Report";
import NotFound from "@/pages/not-found";
import { ThemeProvider } from "@/providers/theme-provider";
import { ThemeToggle } from "@/components/ThemeToggle";

function Router() {
  return (
    <Switch>
      <Route path="/" component={LandingPage} />
      <Route path="/submit" component={IdeaSubmission} />
      <Route path="/dashboard" component={Dashboard} />
      <Route path="/report/:id" component={Report} />
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <ThemeProvider>
      <QueryClientProvider client={queryClient}>
        <Router />
        <Toaster />
      </QueryClientProvider>
    </ThemeProvider>
  );
}

export default App;