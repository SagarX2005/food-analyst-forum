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
      <div className="space-y-6 rounded-3xl bg-[#0a2a4a] p-8 text-white shadow-xl sm:p-12">
        <Badge variant="green" className="text-xs">
          ACCEDITED LAB MANAGEMENT
        </Badge>
        <h1 className="text-3xl font-extrabold text-white sm:text-4xl">
          FLIMS - Laboratory Management Platform
        </h1>
        <p className="max-w-3xl text-base leading-relaxed text-gray-300 sm:text-lg">
          Cloud-native Food Analyst Laboratory Information Management System built specifically for
          NABL accredited and FSSAI notified food testing laboratories across India.
        </p>
        <Button
          variant="green"
          size="lg"
          onClick={() => setDemoOpen(true)}
          className="gap-2 shadow-lg"
        >
          <FlaskConical className="h-5 w-5" />
          Request Demo
        </Button>
      </div>

      {/* GRID 2 CARDS MATCHING PROTOTYPE */}
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
        <Card className="transition-all hover:border-[#4a9d23]">
          <CardHeader>
            <div className="mb-2 flex h-10 w-10 items-center justify-center rounded-xl bg-[#4a9d23]/10 text-[#4a9d23]">
              <Layers className="h-5 w-5" />
            </div>
            <CardTitle className="text-xl">Sample Tracking</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground text-sm leading-relaxed">
              Track samples seamlessly from sample accessioning and login to parameter allocation,
              test execution, and final report dispatch with full audit logs.
            </p>
          </CardContent>
        </Card>

        <Card className="dark:hover:border-primary transition-all hover:border-[#0a2a4a]">
          <CardHeader>
            <div className="dark:bg-primary/10 dark:text-primary mb-2 flex h-10 w-10 items-center justify-center rounded-xl bg-[#0a2a4a]/10 text-[#0a2a4a]">
              <FileCheck2 className="h-5 w-5" />
            </div>
            <CardTitle className="text-xl">Report Generation</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground text-sm leading-relaxed">
              Auto-generate NABL (ISO/IEC 17025) and FSSAI compliant Certificate of Analysis (CoA)
              reports with QR code verification and electronic signatures.
            </p>
          </CardContent>
        </Card>

        <Card className="dark:hover:border-primary transition-all hover:border-[#0a2a4a]">
          <CardHeader>
            <div className="dark:bg-primary/10 dark:text-primary mb-2 flex h-10 w-10 items-center justify-center rounded-xl bg-[#0a2a4a]/10 text-[#0a2a4a]">
              <Cpu className="h-5 w-5" />
            </div>
            <CardTitle className="text-xl">Instrument Management</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground text-sm leading-relaxed">
              Manage equipment calibration schedules, preventive maintenance (AMC), intermediate
              checks, and electronic instrument logbooks in real-time.
            </p>
          </CardContent>
        </Card>

        <Card className="transition-all hover:border-[#4a9d23]">
          <CardHeader>
            <div className="mb-2 flex h-10 w-10 items-center justify-center rounded-xl bg-[#4a9d23]/10 text-[#4a9d23]">
              <Cloud className="h-5 w-5" />
            </div>
            <CardTitle className="text-xl">Cloud Access</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground text-sm leading-relaxed">
              Access your lab data securely from anywhere, Pan India, with encrypted cloud backups,
              role-based access control, and 99.9% uptime SLA.
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
            <label className="text-muted-foreground mb-1 block text-xs font-medium">
              Laboratory / Organization Name
            </label>
            <Input placeholder="Eurofins Food Testing Lab" required />
          </div>
          <div>
            <label className="text-muted-foreground mb-1 block text-xs font-medium">
              Contact Email
            </label>
            <Input type="email" placeholder="labmanager@eurofins.com" required />
          </div>
          <div>
            <label className="text-muted-foreground mb-1 block text-xs font-medium">
              Phone Number
            </label>
            <Input placeholder="+91 98765 43210" required />
          </div>
          <Button type="submit" variant="green" size="lg" className="mt-2 w-full justify-center">
            Submit Demo Request
          </Button>
        </form>
      </Dialog>
    </div>
  );
}
