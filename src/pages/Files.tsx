"use client";

import React from "react";
import DashboardLayout from "@/components/layout/DashboardLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { 
  Search, 
  Plus, 
  FileText, 
  Image as ImageIcon, 
  FileCode, 
  MoreVertical, 
  Download, 
  Share2,
  Folder,
  Filter,
  UploadCloud
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import { cn } from "@/lib/utils";

const Files = () => {
  const files = [
    { id: 1, name: "Brand_Guidelines_v2.pdf", project: "Brand Identity", size: "4.2 MB", type: "PDF", date: "Oct 28, 2023", owner: "Felix K." },
    { id: 2, name: "Homepage_Mockup_Final.fig", project: "Mobile App UI", size: "12.8 MB", type: "Design", date: "Oct 25, 2023", owner: "Sarah Chen" },
    { id: 3, name: "Contract_Signed_Acme.pdf", project: "Brand Identity", size: "1.1 MB", type: "PDF", date: "Oct 20, 2023", owner: "System" },
    { id: 4, name: "Logo_Assets_Package.zip", project: "Brand Identity", size: "25.4 MB", type: "Archive", date: "Oct 18, 2023", owner: "Felix K." },
    { id: 5, name: "User_Flow_Diagram.png", project: "Mobile App UI", size: "2.1 MB", type: "Image", date: "Oct 15, 2023", owner: "Sarah Chen" },
  ];

  const getFileIcon = (type: string) => {
    switch (type) {
      case "PDF": return <FileText className="w-4 h-4 text-rose-500" />;
      case "Image": return <ImageIcon className="w-4 h-4 text-blue-500" />;
      case "Design": return <FileCode className="w-4 h-4 text-purple-500" />;
      default: return <Folder className="w-4 h-4 text-amber-500" />;
    }
  };

  return (
    <DashboardLayout>
      <div className="space-y-8">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-slate-900">Files & Assets</h1>
            <p className="text-slate-500">Centralized storage for all your project documents and deliverables.</p>
          </div>
          <div className="flex gap-3">
            <Button variant="outline" className="border-slate-200 gap-2">
              <Folder className="w-4 h-4" />
              New Folder
            </Button>
            <Button className="bg-indigo-600 hover:bg-indigo-700 text-white gap-2">
              <UploadCloud className="w-4 h-4" />
              Upload Files
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <Card className="border-none shadow-sm bg-indigo-50 border-indigo-100">
            <CardContent className="p-6">
              <p className="text-xs font-bold text-indigo-600 uppercase tracking-wider mb-1">Storage Used</p>
              <h3 className="text-2xl font-bold text-slate-900">1.2 GB / 5 GB</h3>
              <div className="mt-3 h-2 w-full bg-white rounded-full overflow-hidden">
                <div className="h-full bg-indigo-600 w-[24%]" />
              </div>
            </CardContent>
          </Card>
          <Card className="border-none shadow-sm">
            <CardContent className="p-6">
              <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">Total Files</p>
              <h3 className="text-2xl font-bold text-slate-900">124</h3>
            </CardContent>
          </Card>
          <Card className="border-none shadow-sm">
            <CardContent className="p-6">
              <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">Shared with Clients</p>
              <h3 className="text-2xl font-bold text-slate-900">42</h3>
            </CardContent>
          </Card>
          <Card className="border-none shadow-sm">
            <CardContent className="p-6">
              <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">Recent Uploads</p>
              <h3 className="text-2xl font-bold text-slate-900">8</h3>
            </CardContent>
          </Card>
        </div>

        <Card className="border-none shadow-sm">
          <CardHeader className="flex flex-row items-center justify-between">
            <div className="relative w-72">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <Input placeholder="Search files..." className="pl-10 bg-slate-50 border-none" />
            </div>
            <div className="flex gap-2">
              <Button variant="outline" size="sm" className="border-slate-200 gap-2">
                <Filter className="w-3.5 h-3.5" /> Filter
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow className="hover:bg-transparent border-slate-100">
                  <TableHead className="font-bold text-slate-900">Name</TableHead>
                  <TableHead className="font-bold text-slate-900">Project</TableHead>
                  <TableHead className="font-bold text-slate-900">Size</TableHead>
                  <TableHead className="font-bold text-slate-900">Date</TableHead>
                  <TableHead className="font-bold text-slate-900">Owner</TableHead>
                  <TableHead className="text-right"></TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {files.map((file) => (
                  <TableRow key={file.id} className="border-slate-50 hover:bg-slate-50/50 transition-colors">
                    <TableCell>
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-lg bg-slate-100 flex items-center justify-center">
                          {getFileIcon(file.type)}
                        </div>
                        <span className="font-medium text-slate-900 text-sm">{file.name}</span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge variant="secondary" className="bg-indigo-50 text-indigo-700 border-none text-[10px]">
                        {file.project}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-sm text-slate-500">{file.size}</TableCell>
                    <TableCell className="text-sm text-slate-500">{file.date}</TableCell>
                    <TableCell className="text-sm text-slate-500">{file.owner}</TableCell>
                    <TableCell className="text-right">
                      <div className="flex items-center justify-end gap-2">
                        <Button variant="ghost" size="icon" className="text-slate-400 h-8 w-8">
                          <Download className="w-4 h-4" />
                        </Button>
                        <Button variant="ghost" size="icon" className="text-slate-400 h-8 w-8">
                          <Share2 className="w-4 h-4" />
                        </Button>
                        <Button variant="ghost" size="icon" className="text-slate-400 h-8 w-8">
                          <MoreVertical className="w-4 h-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
};

export default Files;