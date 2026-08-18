"use client";

import * as React from "react";
import { Mail, Phone, MapPin, Send, MessageSquare } from "lucide-react";
import { Card, CardHeader, CardTitle, CardContent } from "@components/ui/card";
import { Button } from "@components/ui/button";
import { Input } from "@components/ui/input";
import { Textarea } from "@components/ui/textarea";

export default function ContactPage() {
  const [name, setName] = React.useState("");
  const [email, setEmail] = React.useState("");
  const [message, setMessage] = React.useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !email || !message) {
      alert("Please fill out your name, email, and message.");
      return;
    }

    alert(`Thank you, ${name}! Your message has been sent to support@foodanalystforum.in.`);
    setName("");
    setEmail("");
    setMessage("");
  };

  return (
    <div className="space-y-8 py-4">
      <div className="space-y-2">
        <h1 className="dark:text-foreground text-3xl font-extrabold text-[#0a2a4a]">
          Get In Touch
        </h1>
        <p className="text-muted-foreground text-sm">
          Have questions about lab accreditation, training courses, or technical SOP access? Our
          support team is here to assist.
        </p>
      </div>

      {/* GRID 2 MATCHING PROTOTYPE */}
      <div className="grid grid-cols-1 items-start gap-8 md:grid-cols-2">
        {/* LEFT COLUMN DETAILS */}
        <div className="bg-card border-border/60 space-y-6 rounded-2xl border p-6 shadow-sm sm:p-8">
          <h2 className="dark:text-foreground border-border border-b pb-3 text-xl font-bold text-[#0a2a4a]">
            Contact Information
          </h2>
          <div className="space-y-4 text-sm">
            <div className="flex items-start gap-3">
              <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-[#4a9d23]/10 text-[#4a9d23]">
                <Mail className="h-5 w-5" />
              </div>
              <div>
                <p className="dark:text-foreground font-semibold text-[#0a2a4a]">Email</p>
                <p className="text-muted-foreground">support@foodanalystforum.in</p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <div className="dark:bg-primary/10 dark:text-primary flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-[#0a2a4a]/10 text-[#0a2a4a]">
                <Phone className="h-5 w-5" />
              </div>
              <div>
                <p className="dark:text-foreground font-semibold text-[#0a2a4a]">Phone</p>
                <p className="text-muted-foreground">+91 98765 43210</p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-[#4a9d23]/10 text-[#4a9d23]">
                <MapPin className="h-5 w-5" />
              </div>
              <div>
                <p className="dark:text-foreground font-semibold text-[#0a2a4a]">Address</p>
                <p className="text-muted-foreground">Mumbai, Maharashtra, India</p>
              </div>
            </div>
          </div>
        </div>

        {/* RIGHT COLUMN CONTACT FORM CARD */}
        <Card className="shadow-md">
          <CardHeader>
            <CardTitle className="dark:text-foreground flex items-center gap-2 text-xl text-[#0a2a4a]">
              <MessageSquare className="h-5 w-5 text-[#4a9d23]" />
              Send Us a Message
            </CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="text-muted-foreground mb-1 block text-xs font-medium">
                  Your Name
                </label>
                <Input
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Your Name"
                  required
                />
              </div>

              <div>
                <label className="text-muted-foreground mb-1 block text-xs font-medium">
                  Your Email
                </label>
                <Input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Your Email"
                  required
                />
              </div>

              <div>
                <label className="text-muted-foreground mb-1 block text-xs font-medium">
                  Message
                </label>
                <Textarea
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder="Message"
                  rows={4}
                  required
                />
              </div>

              <Button
                type="submit"
                variant="navy"
                size="lg"
                className="w-full justify-center gap-2"
              >
                <Send className="h-4 w-4" /> Submit
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
