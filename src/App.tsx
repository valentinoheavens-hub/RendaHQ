"use client";

import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "@/context/AuthContext";
import { ProtectedRoute } from "@/components/ProtectedRoute";
import Index from "./pages/Index";
import SignIn from "./pages/SignIn";
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
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const P = ({ el }: { el: React.ReactNode }) => <ProtectedRoute>{el}</ProtectedRoute>;

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
        <AuthProvider>
          <Routes>
            {/* Public */}
            <Route path="/" element={<Index />} />
            <Route path="/signin" element={<SignIn />} />
            <Route path="/login" element={<SignIn />} />
            <Route path="/portal/:clientId" element={<ClientPortal />} />
            <Route path="/onboarding/:token" element={<ClientOnboarding />} />
            <Route path="/invoice/view/:invoiceId" element={<InvoiceView />} />

            {/* Protected */}
            <Route path="/dashboard" element={<P el={<Dashboard />} />} />
            <Route path="/diagnostics" element={<P el={<BusinessDiagnostics />} />} />
            <Route path="/strategy" element={<P el={<StrategicPlanning />} />} />
            <Route path="/team-optimization" element={<P el={<TeamOptimization />} />} />
            <Route path="/staff/:staffId" element={<P el={<StaffDetails />} />} />
            <Route path="/market" element={<P el={<MarketIntelligence />} />} />
            <Route path="/growth" element={<P el={<GrowthLab />} />} />
            <Route path="/workflows" element={<P el={<Workflows />} />} />
            <Route path="/leads" element={<P el={<Leads />} />} />
            <Route path="/lead/:leadId" element={<P el={<LeadDetails />} />} />
            <Route path="/projects" element={<P el={<Projects />} />} />
            <Route path="/project-templates" element={<P el={<ProjectTemplates />} />} />
            <Route path="/proposals" element={<P el={<Proposals />} />} />
            <Route path="/proposal/new" element={<P el={<ProposalBuilder />} />} />
            <Route path="/proposal/view/:proposalId" element={<P el={<ProposalView />} />} />
            <Route path="/project/:projectId/change-order" element={<P el={<ChangeOrderBuilder />} />} />
            <Route path="/staff-onboarding" element={<P el={<StaffOnboarding />} />} />
            <Route path="/contracts" element={<P el={<Contracts />} />} />
            <Route path="/contract/edit/:contractId" element={<P el={<ContractEditor />} />} />
            <Route path="/invoices" element={<P el={<Invoices />} />} />
            <Route path="/invoice/new" element={<P el={<InvoiceBuilder />} />} />
            <Route path="/clients" element={<P el={<Clients />} />} />
            <Route path="/client/:clientId" element={<P el={<ClientDetails />} />} />
            <Route path="/time" element={<P el={<TimeTracking />} />} />
            <Route path="/messages" element={<P el={<Messages />} />} />
            <Route path="/reports" element={<P el={<Reports />} />} />
            <Route path="/help" element={<P el={<HelpCenter />} />} />
            <Route path="/settings" element={<P el={<Settings />} />} />
            <Route path="/project/new" element={<P el={<CreateProject />} />} />
            <Route path="/project/:projectId" element={<P el={<ProjectDetails />} />} />
            <Route path="/questionnaire-builder" element={<P el={<QuestionnaireBuilder />} />} />
            <Route path="/services" element={<P el={<Services />} />} />
            <Route path="/expenses" element={<P el={<Expenses />} />} />
            <Route path="/files" element={<P el={<Files />} />} />
            <Route path="/calendar" element={<P el={<Calendar />} />} />
            <Route path="/automations" element={<P el={<Automations />} />} />
            <Route path="/payments" element={<P el={<Payments />} />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </AuthProvider>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
