import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";

import Home from "@/pages/Home";
import BikesList from "@/pages/BikesList";
import BikeDetail from "@/pages/BikeDetail";
import Login from "@/pages/Login";
import Admin from "@/pages/Admin";
import NotFound from "@/pages/NotFound";

function Router() {
  return (
    <Switch>
      <Route path="/" component={Home} />
      <Route path="/login" component={Login} />
      <Route path="/admin" component={Admin} />
      <Route path="/bikes" component={BikesList} />
      <Route path="/bikes/:id" component={BikeDetail} />
      <Route path="/used-bikes" component={BikesList} />
      <Route path="/compare" component={BikesList} />
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Router />
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
