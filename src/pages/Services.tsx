"use client";

import React from "react";
import DashboardLayout from "@/components/layout/DashboardLayout";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { 
  Plus, 
  Search, 
  MoreVertical, 
  Package, 
  Tag, 
  Clock, 
  DollarSign,
  Layers,
  Edit2,
  Copy
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

const Services = () => {
  const services = [
    { 
      id: 1, 
      name: "Brand Identity Package", 
      category: "Design", 
      price: "$2,500", 
      duration: "2-3 weeks",
      description: "Complete visual identity including logo, typography, and color palette.",
      status: "Active"
    },
    { 
      id: 2, 
      name: "UI/UX Audit", 
      category: "Consulting", 
      price: "$800", 
      duration: "3-5 days",
      description: "Comprehensive review of your existing product with actionable improvements.",
      status: "Active"
    },
    { 
      id: 3, 
      name: "Monthly Maintenance", 
      category: "Development", 
      price: "$500/mo", 
      duration: "Ongoing",
      description: "Security updates, bug fixes, and minor content adjustments.",
      status: "Active"
    },
    { 
      id: 4, 
      name: "Social Media Kit", 
      category: "Design", 
      price: "$400", 
      duration: "2 days",
      description: "Templates for Instagram, LinkedIn, and Twitter based on your brand.",
      status: "Draft"
    },
  ];

  return (
    <DashboardLayout>
      <div className="space-y-8">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-slate-900">Service Catalog</h1>
            <p className="text-slate-500">Define your standard packages to speed up proposals and invoicing.</p>
          </div>
          <Button className="bg-emerald-600 hover:bg-emerald-700 text-white gap-2">
            <Plus className="w-4 h-4" />
            Add New Service
          </Button>
        </div>

        <div className="flex items-center gap-4">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <Input placeholder="Search services..." className="pl-10 bg-white border-slate-200" />
          </div>
          <div className="flex gap-2">
            <Button variant="outline" className="border-slate-200">All Categories</Button>
            <Button variant="ghost" className="text-slate-500">Design</Button>
            <Button variant="ghost" className="text-slate-500">Development</Button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {services.map((service) => (
            <Card key={service.id} className="border-none shadow-sm hover:shadow-md transition-all group">
              <CardContent className="p-6">
                <div className="flex justify-between items-start mb-4">
                  <div className="w-12 h-12 rounded-xl bg-emerald-50 flex items-center justify-center text-emerald-600">
                    <Package className="w-6 h-6" />
                  </div>
                  <Badge className={cn(
                    "border-none",
                    service.status === "Active" ? "bg-emerald-50 text-emerald-700" : "bg-slate-100 text-slate-600"
                  )}>
                    {service.status}
                  </Badge>
                </div>
                
                <div className="space-y-2 mb-6">
                  <h3 className="font-bold text-lg text-slate-900 group-hover:text-emerald-600 transition-colors">
                    {service.name}
                  </h3>
                  <p className="text-sm text-slate-500 line-clamp-2 leading-relaxed">
                    {service.description}
                  </p>
                </div>

                <div className="grid grid-cols-2 gap-4 py-4 border-y border-slate-50 mb-6">
                  <div className="flex items-center gap-2">
                    <DollarSign className="w-4 h-4 text-slate-400" />
                    <div>
                      <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Price</p>
                      <p className="font-bold text-slate-900 text-sm">{service.price}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Clock className="w-4 h-4 text-slate-400" />
                    <div>
                      <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Duration</p>
                      <p className="font-bold text-slate-900 text-sm">{service.duration}</p>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <Button variant="outline" className="flex-1 border-slate-200 text-slate-600 gap-2">
                    <Edit2 className="w-3.5 h-3.5" />
                    Edit
                  </Button>
                  <Button variant="ghost" size="icon" className="text-slate-400">
                    <Copy className="w-4 h-4" />
                  </Button>
                  <Button variant="ghost" size="icon" className="text-slate-400">
                    <MoreVertical className="w-4 h-4" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
          
          <button className="border-2 border-dashed border-slate-200 rounded-3xl p-6 flex flex-col items-center justify-center text-slate-400 hover:border-emerald-300 hover:text-emerald-500 transition-all min-h-[280px] group">
            <div className="w-12 h-12 rounded-full bg-slate-50 flex items-center justify-center mb-4 group-hover:bg-emerald-50">
              <Plus className="w-6 h-6" />
            </div>
            <p className="font-bold">Create New Package</p>
            <p className="text-sm">Standardize your offerings</p>
          </button>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default Services;