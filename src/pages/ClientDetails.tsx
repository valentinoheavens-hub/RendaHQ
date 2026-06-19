import React from "react";
import { useParams, Link } from "react-router-dom";
import DashboardLayout from "@/components/layout/DashboardLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  ChevronLeft, 
  Mail, 
  Phone, 
  Globe, 
  ExternalLink, 
  Plus,
  FileText,
  CreditCard,
  MessageSquare,
  UserPlus,
  Sparkles
} from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { showSuccess } from "@/utils/toast";
import { cn } from "@/lib/utils";

const ClientDetails = () => {
  const { clientId } = useParams();

  const client = {
    name: "Acme Corp",
    contact: "John Doe",
    email: "john@acme.com",
    phone: "+1 (555) 000-0000",
    website: "www.acme.com",
    status: "Active",
    avatar: "https://api.dicebear.com/7.x/initials/svg?seed=AC",
    totalRevenue: "$12,500",
    projects: [
      { id: "1", name: "Brand Identity Redesign", status: "In Progress", value: "$5,000" },
      { id: "4", name: "E-commerce Website", status: "Onboarding", value: "$12,000" },
    ],
    invoices: [
      { id: "INV-001", amount: "$1,500", status: "Paid", date: "Oct 12" },
      { id: "INV-005", amount: "$2,500", status: "Draft", date: "Oct 28" },
    ]
  };

  const handleSendOnboarding = () => {
    showSuccess(`Onboarding link sent to ${client.email}!`);
  };

  return (
    <DashboardLayout>
      <div className="space-y-8">
        <div className="flex items-center gap-4">
          <Link to="/clients">
            <Button variant="ghost" size="icon" className="rounded-full">
              <ChevronLeft className="w-5 h-5" />
            </Button>
          </Link>
          <div className="flex items-center gap-4">
            <Avatar className="w-16 h-16 rounded-2xl">
              <AvatarImage src={client.avatar} />
              <AvatarFallback>AC</AvatarFallback>
            </Avatar>
            <div>
              <div className="flex items-center gap-3">
                <h1 className="text-2xl font-bold text-slate-900">{client.name}</h1>
                <Badge className="bg-emerald-50 text-emerald-700 border-none">{client.status}</Badge>
              </div>
              <p className="text-slate-500">Primary Contact: {client.contact}</p>
            </div>
          </div>
          <div className="ml-auto flex gap-3">
            <Button variant="outline" className="border-slate-200 gap-2" onClick={handleSendOnboarding}>
              <UserPlus className="w-4 h-4" />
              Send Onboarding
            </Button>
            <Link to={`/portal/${clientId}`}>
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
              <CardHeader>
                <CardTitle className="text-lg font-bold">Contact Information</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center gap-3 text-sm">
                  <Mail className="w-4 h-4 text-slate-400" />
                  <span className="text-slate-600">{client.email}</span>
                </div>
                <div className="flex items-center gap-3 text-sm">
                  <Phone className="w-4 h-4 text-slate-400" />
                  <span className="text-slate-600">{client.phone}</span>
                </div>
                <div className="flex items-center gap-3 text-sm">
                  <Globe className="w-4 h-4 text-slate-400" />
                  <span className="text-slate-600">{client.website}</span>
                </div>
                <div className="pt-4 border-t border-slate-100">
                  <Link to="/messages">
                    <Button variant="ghost" className="w-full justify-start text-emerald-600 hover:bg-emerald-50 gap-2">
                      <MessageSquare className="w-4 h-4" />
                      Message Client
                    </Button>
                  </Link>
                </div>
              </CardContent>
            </Card>

            <Card className="border-none shadow-sm bg-slate-900 text-white">
              <CardContent className="p-6">
                <p className="text-slate-400 text-xs font-bold uppercase tracking-widest mb-1">Lifetime Value</p>
                <h3 className="text-3xl font-bold">{client.totalRevenue}</h3>
                <div className="mt-4 h-1.5 w-full bg-white/10 rounded-full overflow-hidden">
                  <div className="h-full bg-emerald-500 w-3/4" />
                </div>
                <p className="text-[10px] text-slate-400 mt-2">Top 10% of your clients</p>
              </CardContent>
            </Card>

            <Card className="border-none shadow-sm bg-emerald-50 border-emerald-100">
              <CardContent className="p-6">
                <div className="flex items-center gap-2 text-emerald-600 mb-2">
                  <Sparkles className="w-4 h-4" />
                  <span className="text-xs font-bold uppercase tracking-wider">AI Insight</span>
                </div>
                <p className="text-sm text-emerald-900 font-medium">
                  This client is likely to need a website maintenance retainer next month based on project completion.
                </p>
              </CardContent>
            </Card>
          </div>

          <div className="lg:col-span-2">
            <Tabs defaultValue="projects" className="w-full">
              <TabsList className="bg-white border border-slate-200 p-1 h-12 mb-6">
                <TabsTrigger value="projects" className="gap-2">Projects</TabsTrigger>
                <TabsTrigger value="invoices" className="gap-2">Invoices</TabsTrigger>
                <TabsTrigger value="files" className="gap-2">Files</TabsTrigger>
              </TabsList>

              <TabsContent value="projects" className="space-y-4">
                {client.projects.map((project) => (
                  <Card key={project.id} className="border-none shadow-sm hover:shadow-md transition-all">
                    <CardContent className="p-5 flex items-center justify-between">
                      <div className="flex items-center gap-4">
                        <div className="w-10 h-10 rounded-lg bg-emerald-50 flex items-center justify-center text-emerald-600">
                          <FileText className="w-5 h-5" />
                        </div>
                        <div>
                          <h4 className="font-bold text-slate-900">{project.name}</h4>
                          <p className="text-xs text-slate-500">{project.value}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-4">
                        <Badge variant="secondary" className="bg-slate-100 text-slate-600 border-none">
                          {project.status}
                        </Badge>
                        <Link to={`/project/${project.id}`}>
                          <Button variant="ghost" size="icon" className="text-slate-400">
                            <ExternalLink className="w-4 h-4" />
                          </Button>
                        </Link>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </TabsContent>

              <TabsContent value="invoices" className="space-y-4">
                {client.invoices.map((invoice) => (
                  <Card key={invoice.id} className="border-none shadow-sm">
                    <CardContent className="p-5 flex items-center justify-between">
                      <div className="flex items-center gap-4">
                        <div className="w-10 h-10 rounded-lg bg-emerald-50 flex items-center justify-center text-emerald-600">
                          <CreditCard className="w-5 h-5" />
                        </div>
                        <div>
                          <h4 className="font-bold text-slate-900">{invoice.id}</h4>
                          <p className="text-xs text-slate-500">{invoice.date}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-4">
                        <p className="font-bold text-slate-900">{invoice.amount}</p>
                        <Badge className={cn(
                          "border-none",
                          invoice.status === "Paid" ? "bg-emerald-50 text-emerald-700" : "bg-slate-100 text-slate-600"
                        )}>
                          {invoice.status}
                        </Badge>
                        <Link to={`/invoice/view/${invoice.id}`}>
                          <Button variant="ghost" size="icon" className="text-slate-400">
                            <ExternalLink className="w-4 h-4" />
                          </Button>
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