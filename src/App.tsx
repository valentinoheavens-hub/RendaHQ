"use client";

import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import Dashboard from "./pages/Dashboard";
import BusinessDiagnostics from "./pages/BusinessDiagnostics";
import StrategicPlanning from "./pages/StrategicPlanning";
import MarketIntelligence from "./pages/MarketIntelligence";
import GrowthLab from "./pages/GrowthLab";
import Workflows from "./pages/Workflows";
import Leads from "./pages/Leads";
import LeadDetails from "./pages/LeadDetails";
import Projects from "./pages/Projects";
import ProjectTemplates from "./pages/ProjectTemplates";
import Proposals from "./pages/Proposals";
import ProposalBuilder from "./pages/ProposalBuilder";
import ProposalView from "./pages/ProposalView";
import ChangeOrderBuilder from "./pages/ChangeOrderBuilder";
import ClientPortal from "./pages/ClientPortal";
import Contracts from "./pages/Contracts";
import Invoices from "./pages/Invoices";
import InvoiceBuilder from "./pages/InvoiceBuilder";
import InvoiceView from "./pages/InvoiceView";
import Clients from "./pages/Clients";
import ClientDetails from "./pages/ClientDetails";
import TimeTracking from "./pages/TimeTracking";
import Messages from "./pages/Messages";
import Reports from "./pages/Reports";
import HelpCenter from "./pages/HelpCenter";
import Settings from "./pages/Settings";
import ProjectDetails from "./pages/ProjectDetails";
import QuestionnaireBuilder from "./pages/QuestionnaireBuilder";
import CreateProject from "./pages/CreateProject";
import ContractEditor from "./pages/ContractEditor";
import ClientOnboarding from "./pages/ClientOnboarding";
import StaffOnboarding from "./pages/StaffOnboarding";
import StaffDetails from "./pages/StaffDetails";
import Services from "./pages/Services";
import Expenses from "./pages/Expenses";
import Files from "./pages/Files";
import Calendar from "./pages/Calendar";
import TeamOptimization from "./pages/TeamOptimization";
import Automations from "./pages/Automations";
import Payments from "./pages/Payments";
import SignIn from "./pages/SignIn";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/diagnostics" element={<BusinessDiagnostics />} />
          <Route path="/strategy" element={<StrategicPlanning />} />
          <Route path="/team-optimization" element={<TeamOptimization />} />
          <Route path="/staff/:staffId" element={<StaffDetails />} />
          <Route path="/market" element={<MarketIntelligence />} />
          <Route path="/growth" element={<GrowthLab />} />
          <Route path="/workflows" element={<Workflows />} />
          <Route path="/leads" element={<Leads />} />
          <Route path="/lead/:leadId" element={<LeadDetails />} />
          <Route path="/projects" element={<Projects />} />
          <Route path="/project-templates" element={<ProjectTemplates />} />
          <Route path="/proposals" element={<Proposals />} />
          <Route path="/proposal/new" element={<ProposalBuilder />} />
          <Route path="/proposal/view/:proposalId" element={<ProposalView />} />
          <Route path="/project/:projectId/change-order" element={<ChangeOrderBuilder />} />
          <Route path="/portal/:clientId" element={<ClientPortal />} />
          <Route path="/onboarding/:token" element={<ClientOnboarding />} />
          <Route path="/staff-onboarding" element={<StaffOnboarding />} />
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
          <Route path="/services" element={<Services />} />
          <Route path="/expenses" element={<Expenses />} />
          <Route path="/files" element={<Files />} />
          <Route path="/calendar" element={<Calendar />} />
          <Route path="/automations" element={<Automations />} />
          <Route path="/payments" element={<Payments />} />
          <Route path="/signin" element={<SignIn />} />
          <Route path="/login" element={<SignIn />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;