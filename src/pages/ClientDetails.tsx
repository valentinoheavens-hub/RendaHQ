import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import DashboardLayout from "@/components/layout/DashboardLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  ChevronLeft,
  Mail,
  Phone,
  Building2,
  ExternalLink,
  Plus,
  FileText,
  CreditCard,
  Loader2,
  UserPlus,
} from "lucide-react";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { showSuccess, showError } from "@/utils/toast";
import { cn } from "@/lib/utils";
import { clientStore, Client } from "@/lib/clientStore";
import { projectStore, Project } from "@/lib/projectStore";
import { invoiceStore, Invoice } from "@/lib/invoiceStore";
import { proposalStore, Proposal } from "@/lib/proposalStore";
import { useCurrency } from "@/hooks/useCurrency";

const ClientDetails = () => {
  const { clientId } = useParams();
  const { format } = useCurrency();

  const [client, setClient] = useState<Client | null>(null);
  const [projects, setProjects] = useState<Project[]>([]);
  const [invoices, setInvoices] = useState<Invoice[]>([]);
  const [proposals, setProposals] = useState<Proposal[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!clientId) return;
    let active = true;
    (async () => {
      try {
        const c = await clientStore.getById(clientId);
        if (!active) return;
        setClient(c);
        const [allProjects, allInvoices, allProposals] = await Promise.all([
          projectStore.getAll().catch(() => []),
          invoiceStore.getAll().catch(() => []),
          proposalStore.getAll().catch(() => []),
        ]);
        if (!active) return;
        setProjects(allProjects.filter((p) => p.client_id === clientId));
        setInvoices(allInvoices.filter((i) => i.client_id === clientId));
        setProposals(allProposals.filter((p) => p.client_id === clientId));
      } finally {
        if (active) setLoading(false);
      }
    })();
    return () => { active = false; };
  }, [clientId]);

  // Lifetime value = what this client has actually paid.
  const lifetimeValue = invoices
    .filter((i) => i.status === "Paid")
    .reduce((sum, i) => sum + (Number(i.amount) || 0), 0);
  const outstanding = invoices
    .filter((i) => i.status === "Sent" || i.status === "Overdue")
    .reduce((sum, i) => sum + (Number(i.amount) || 0), 0);

  const handleSendOnboarding = () => {
    if (!client?.email) { showError("Add an email address for this client first."); return; }
    showSuccess(`Onboarding link ready to send to ${client.email}.`);
  };

  if (loading) {
    return (
      <DashboardLayout>
        <div className="flex justify-center py-24">
          <Loader2 className="w-8 h-8 animate-spin text-emerald-500" />
        </div>
      </DashboardLayout>
    );
  }

  if (!client) {
    return (
      <DashboardLayout>
        <div className="max-w-md mx-auto text-center py-24">
          <h2 className="text-xl font-bold text-slate-900 mb-2">Client not found</h2>
          <p className="text-slate-500 mb-6">This client may have been deleted.</p>
          <Link to="/clients">
            <Button className="bg-emerald-600 hover:bg-emerald-700 text-white">Back to clients</Button>
          </Link>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="space-y-8">
        <div className="flex flex-wrap items-center gap-4">
          <Link to="/clients">
            <Button variant="ghost" size="icon" className="rounded-full">
              <ChevronLeft className="w-5 h-5" />
            </Button>
          </Link>
          <div className="flex items-center gap-4">
            <Avatar className="w-16 h-16 rounded-2xl">
              <AvatarFallback className="rounded-2xl bg-emerald-100 text-emerald-700 font-bold text-xl">
                {client.name.charAt(0).toUpperCase()}
              </AvatarFallback>
            </Avatar>
            <div>
              <div className="flex items-center gap-3">
                <h1 className="text-2xl font-bold text-slate-900">{client.name}</h1>
                <Badge className={cn(
                  "border-none",
                  client.status === "Active" ? "bg-emerald-50 text-emerald-700" :
                  client.status === "Onboarding" ? "bg-amber-50 text-amber-700" :
                  "bg-slate-100 text-slate-600"
                )}>
                  {client.status}
                </Badge>
              </div>
              {client.company && <p className="text-slate-500">{client.company}</p>}
            </div>
          </div>
          <div className="ml-auto flex flex-wrap gap-3">
            <Button variant="outline" className="border-slate-200 gap-2" onClick={handleSendOnboarding}>
              <UserPlus className="w-4 h-4" />
              Send Onboarding
            </Button>
            <Link to={`/portal/${client.id}`}>
              <Button variant="outline" className="border-slate-200 gap-2">
                <ExternalLink className="w-4 h-4" />
                View Portal
              </Button>
            </Link>
            <Link to="/project/new">
              <Button className="bg-emerald-600 hover:bg-emerald-700 text-white gap-2">
                <Plus className="w-4 h-4" />
                New Project
              </Button>
            </Link>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-1 space-y-6">
            <Card className="border-none shadow-sm">
              <CardHeader><CardTitle className="text-lg font-bold">Contact Information</CardTitle></CardHeader>
              <CardContent className="space-y-4">
                {client.email ? (
                  <a href={`mailto:${client.email}`} className="flex items-center gap-3 text-sm hover:text-emerald-600">
                    <Mail className="w-4 h-4 text-slate-400 shrink-0" />
                    <span className="text-slate-600 break-all">{client.email}</span>
                  </a>
                ) : (
                  <div className="flex items-center gap-3 text-sm">
                    <Mail className="w-4 h-4 text-slate-300 shrink-0" />
                    <span className="text-slate-400">No email on file</span>
                  </div>
                )}
                <div className="flex items-center gap-3 text-sm">
                  <Phone className={cn("w-4 h-4 shrink-0", client.phone ? "text-slate-400" : "text-slate-300")} />
                  <span className={client.phone ? "text-slate-600" : "text-slate-400"}>
                    {client.phone || "No phone on file"}
                  </span>
                </div>
                <div className="flex items-center gap-3 text-sm">
                  <Building2 className={cn("w-4 h-4 shrink-0", client.company ? "text-slate-400" : "text-slate-300")} />
                  <span className={client.company ? "text-slate-600" : "text-slate-400"}>
                    {client.company || "No company on file"}
                  </span>
                </div>
                {client.notes && (
                  <div className="pt-4 border-t border-slate-100">
                    <p className="text-xs font-bold uppercase tracking-widest text-slate-400 mb-1">Notes</p>
                    <p className="text-sm text-slate-600 leading-relaxed">{client.notes}</p>
                  </div>
                )}
              </CardContent>
            </Card>

            <Card className="border-none shadow-sm bg-slate-900 text-white">
              <CardContent className="p-6">
                <p className="text-slate-400 text-xs font-bold uppercase tracking-widest mb-1">Lifetime Value</p>
                <h3 className="text-3xl font-bold">{format(lifetimeValue)}</h3>
                <p className="text-[11px] text-slate-400 mt-2">
                  {outstanding > 0
                    ? `${format(outstanding)} still outstanding`
                    : invoices.length === 0 ? "No invoices yet" : "All invoices settled"}
                </p>
              </CardContent>
            </Card>
          </div>

          <div className="lg:col-span-2">
            <Tabs defaultValue="projects" className="w-full">
              <TabsList className="bg-white border border-slate-200 p-1 h-12 mb-6">
                <TabsTrigger value="projects">Projects ({projects.length})</TabsTrigger>
                <TabsTrigger value="invoices">Invoices ({invoices.length})</TabsTrigger>
                <TabsTrigger value="proposals">Proposals ({proposals.length})</TabsTrigger>
              </TabsList>

              <TabsContent value="projects" className="space-y-4">
                {projects.length === 0 ? (
                  <div className="text-center py-12 bg-white rounded-2xl border border-dashed border-slate-200">
                    <p className="text-slate-500 font-medium">No projects for this client yet</p>
                    <Link to="/project/new">
                      <Button variant="outline" className="mt-4 border-slate-200">Create a project</Button>
                    </Link>
                  </div>
                ) : projects.map((project) => (
                  <Card key={project.id} className="border-none shadow-sm hover:shadow-md transition-all">
                    <CardContent className="p-5 flex items-center justify-between gap-4">
                      <div className="flex items-center gap-4 min-w-0">
                        <div className="w-10 h-10 rounded-lg bg-emerald-50 flex items-center justify-center text-emerald-600 shrink-0">
                          <FileText className="w-5 h-5" />
                        </div>
                        <div className="min-w-0">
                          <h4 className="font-bold text-slate-900 truncate">{project.name}</h4>
                          <p className="text-xs text-slate-500">{format(Number(project.budget) || 0)}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-4 shrink-0">
                        <Badge variant="secondary" className="bg-slate-100 text-slate-600 border-none">{project.status}</Badge>
                        <Link to={`/project/${project.id}`}>
                          <Button variant="ghost" size="icon" className="text-slate-400"><ExternalLink className="w-4 h-4" /></Button>
                        </Link>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </TabsContent>

              <TabsContent value="invoices" className="space-y-4">
                {invoices.length === 0 ? (
                  <div className="text-center py-12 bg-white rounded-2xl border border-dashed border-slate-200">
                    <p className="text-slate-500 font-medium">No invoices for this client yet</p>
                    <Link to="/invoice/new">
                      <Button variant="outline" className="mt-4 border-slate-200">Create an invoice</Button>
                    </Link>
                  </div>
                ) : invoices.map((invoice) => (
                  <Card key={invoice.id} className="border-none shadow-sm">
                    <CardContent className="p-5 flex items-center justify-between gap-4">
                      <div className="flex items-center gap-4 min-w-0">
                        <div className="w-10 h-10 rounded-lg bg-emerald-50 flex items-center justify-center text-emerald-600 shrink-0">
                          <CreditCard className="w-5 h-5" />
                        </div>
                        <div className="min-w-0">
                          <h4 className="font-bold text-slate-900 truncate">{invoice.invoice_number}</h4>
                          <p className="text-xs text-slate-500">
                            {invoice.due_date ? `Due ${new Date(invoice.due_date).toLocaleDateString()}` : "No due date"}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center gap-4 shrink-0">
                        <span className="font-bold text-slate-900">{format(Number(invoice.amount) || 0)}</span>
                        <Badge className={cn(
                          "border-none",
                          invoice.status === "Paid" ? "bg-emerald-50 text-emerald-700" :
                          invoice.status === "Overdue" ? "bg-rose-50 text-rose-700" :
                          "bg-slate-100 text-slate-600"
                        )}>
                          {invoice.status}
                        </Badge>
                        <Link to={`/invoice/view/${invoice.id}`}>
                          <Button variant="ghost" size="icon" className="text-slate-400"><ExternalLink className="w-4 h-4" /></Button>
                        </Link>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </TabsContent>

              <TabsContent value="proposals" className="space-y-4">
                {proposals.length === 0 ? (
                  <div className="text-center py-12 bg-white rounded-2xl border border-dashed border-slate-200">
                    <p className="text-slate-500 font-medium">No proposals for this client yet</p>
                    <Link to="/proposal/new">
                      <Button variant="outline" className="mt-4 border-slate-200">Create a proposal</Button>
                    </Link>
                  </div>
                ) : proposals.map((prop) => (
                  <Card key={prop.id} className="border-none shadow-sm">
                    <CardContent className="p-5 flex items-center justify-between gap-4">
                      <div className="flex items-center gap-4 min-w-0">
                        <div className="w-10 h-10 rounded-lg bg-emerald-50 flex items-center justify-center text-emerald-600 shrink-0">
                          <FileText className="w-5 h-5" />
                        </div>
                        <div className="min-w-0">
                          <h4 className="font-bold text-slate-900 truncate">{prop.title}</h4>
                          <p className="text-xs text-slate-500">{new Date(prop.created_at).toLocaleDateString()}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-4 shrink-0">
                        <span className="font-bold text-slate-900">{format(Number(prop.total) || 0)}</span>
                        <Badge className={cn(
                          "border-none",
                          prop.status === "Accepted" ? "bg-emerald-50 text-emerald-700" :
                          prop.status === "Sent" ? "bg-blue-50 text-blue-700" :
                          "bg-slate-100 text-slate-600"
                        )}>
                          {prop.status}
                        </Badge>
                        <Link to={`/proposal/view/${prop.id}`}>
                          <Button variant="ghost" size="icon" className="text-slate-400"><ExternalLink className="w-4 h-4" /></Button>
                        </Link>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default ClientDetails;
