import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import Dashboard from "./pages/Dashboard";
import Projects from "./pages/Projects";
import Proposals from "./pages/Proposals";
import ClientPortal from "./pages/ClientPortal";
import Contracts from "./pages/Contracts";
import Invoices from "./pages/Invoices";
import InvoiceBuilder from "./pages/InvoiceBuilder";
import InvoiceView from "./pages/InvoiceView";
import Clients from "./pages/Clients";
import ClientDetails from "./pages/ClientDetails";
import TimeTracking from "./pages/TimeTracking";
import Settings from "./pages/Settings";
import ProjectDetails from "./pages/ProjectDetails";
import QuestionnaireBuilder from "./pages/QuestionnaireBuilder";
import CreateProject from "./pages/CreateProject";
import ContractEditor from "./pages/ContractEditor";
import ClientOnboarding from "./pages/ClientOnboarding";
import Reports from "./pages/Reports";
import Messages from "./pages/Messages";
import HelpCenter from "./pages/HelpCenter";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/projects" element={<Projects />} />
          <Route path="/proposals" element={<Proposals />} />
          <Route path="/portal/:clientId" element={<ClientPortal />} />
          <Route path="/onboarding/:token" element={<ClientOnboarding />} />
          <Route path="/contracts" element={<Contracts />} />
          <Route path="/contract/edit/:contractId" element={<ContractEditor />} />
          <Route path="/invoices" element={<Invoices />} />
          <Route path="/invoice/new" element={<InvoiceBuilder />} />
          <Route path="/invoice/view/:invoiceId" element={<InvoiceView />} />
          <Route path="/clients" element={<Clients />} />
          <Route path="/client/:clientId" element={<ClientDetails />} />
          <Route path="/time" element={<TimeTracking />} />
          <Route path="/messages" element={<Messages />} />
          <Route path="/reports" element={<Reports />} />
          <Route path="/help" element={<HelpCenter />} />
          <Route path="/settings" element={<Settings />} />
          <Route path="/project/new" element={<CreateProject />} />
          <Route path="/project/:projectId" element={<ProjectDetails />} />
          <Route path="/questionnaire-builder" element={<QuestionnaireBuilder />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;