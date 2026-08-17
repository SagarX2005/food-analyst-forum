"use client";

import * as React from "react";
import { FlaskConical, Layers, FileCheck2, Cpu, Cloud } from "lucide-react";
import { Card, CardHeader, CardTitle, CardContent } from "@components/ui/card";
import { Button } from "@components/ui/button";
import { Badge } from "@components/ui/badge";
import { Dialog } from "@components/ui/dialog";
import { Input } from "@components/ui/input";

export default function FlimsPage() {
  const [demoOpen, setDemoOpen] = React.useState(false);

  return (
    <div className="space-y-12 py-4">
      {/* HERO BANNER */}
      <div className="rounded-3xl bg-[#0a2a4a] text-white p-8 sm:p-12 shadow-xl space-y-6">
        <Badge variant="green" className="text-xs">ACCEDITED LAB MANAGEMENT</Badge>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-white">
          FLIMS - Laboratory Management Platform
        </h1>
        <p className="text-base sm:text-lg text-gray-300 max-w-3xl leading-relaxed">
          Cloud-native Food Analyst Laboratory Information Management System built specifically for NABL accredited and FSSAI notified food testing laboratories across India.
        </p>
        <Button variant="green" size="lg" onClick={() => setDemoOpen(true)} className="gap-2 shadow-lg">
          <FlaskConical className="h-5 w-5" />
          Request Demo
        </Button>
      </div>

      {/* GRID 2 CARDS MATCHING PROTOTYPE */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card className="hover:border-[#4a9d23] transition-all">
          <CardHeader>
            <div className="h-10 w-10 rounded-xl bg-[#4a9d23]/10 text-[#4a9d23] flex items-center justify-center mb-2">
              <Layers className="h-5 w-5" />
            </div>
            <CardTitle className="text-xl">Sample Tracking</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground leading-relaxed">
              Track samples seamlessly from sample accessioning and login to parameter allocation, test execution, and final report dispatch with full audit logs.
            </p>
          </CardContent>
        </Card>

        <Card className="hover:border-[#0a2a4a] dark:hover:border-primary transition-all">
          <CardHeader>
            <div className="h-10 w-10 rounded-xl bg-[#0a2a4a]/10 dark:bg-primary/10 text-[#0a2a4a] dark:text-primary flex items-center justify-center mb-2">
              <FileCheck2 className="h-5 w-5" />
            </div>
            <CardTitle className="text-xl">Report Generation</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground leading-relaxed">
              Auto-generate NABL (ISO/IEC 17025) and FSSAI compliant Certificate of Analysis (CoA) reports with QR code verification and electronic signatures.
            </p>
          </CardContent>
        </Card>

        <Card className="hover:border-[#0a2a4a] dark:hover:border-primary transition-all">
          <CardHeader>
            <div className="h-10 w-10 rounded-xl bg-[#0a2a4a]/10 dark:bg-primary/10 text-[#0a2a4a] dark:text-primary flex items-center justify-center mb-2">
              <Cpu className="h-5 w-5" />
            </div>
            <CardTitle className="text-xl">Instrument Management</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground leading-relaxed">
              Manage equipment calibration schedules, preventive maintenance (AMC), intermediate checks, and electronic instrument logbooks in real-time.
            </p>
          </CardContent>
        </Card>

        <Card className="hover:border-[#4a9d23] transition-all">
          <CardHeader>
            <div className="h-10 w-10 rounded-xl bg-[#4a9d23]/10 text-[#4a9d23] flex items-center justify-center mb-2">
              <Cloud className="h-5 w-5" />
            </div>
            <CardTitle className="text-xl">Cloud Access</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground leading-relaxed">
              Access your lab data securely from anywhere, Pan India, with encrypted cloud backups, role-based access control, and 99.9% uptime SLA.
            </p>
          </CardContent>
        </Card>
      </div>

      {/* DEMO REQUEST MODAL */}
      <Dialog
        isOpen={demoOpen}
        onClose={() => setDemoOpen(false)}
        title="Request FLIMS Live Demo"
        description="Fill in your laboratory details to schedule a live demonstration of the FLIMS platform."
      >
        <form
          onSubmit={(e) => {
            e.preventDefault();
            alert("Demo Request Submitted! Our FLIMS specialist will contact you shortly.");
            setDemoOpen(false);
          }}
          className="space-y-3 pt-2"
        >
          <div>
            <label className="text-xs font-medium text-muted-foreground mb-1 block">Laboratory / Organization Name</label>
            <Input placeholder="Eurofins Food Testing Lab" required />
          </div>
          <div>
            <label className="text-xs font-medium text-muted-foreground mb-1 block">Contact Email</label>
            <Input type="email" placeholder="labmanager@eurofins.com" required />
          </div>
          <div>
            <label className="text-xs font-medium text-muted-foreground mb-1 block">Phone Number</label>
            <Input placeholder="+91 98765 43210" required />
          </div>
          <Button type="submit" variant="green" size="lg" className="w-full justify-center mt-2">
            Submit Demo Request
          </Button>
        </form>
      </Dialog>
    </div>
  );
}
