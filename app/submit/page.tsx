'use client';

import { useState } from 'react';
import { useRASStore } from '@/lib/store';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Send,
  CheckCircle2,
  Train,
  Calendar,
  Tag,
  MessageSquare,
  Image as ImageIcon,
  Shield,
} from 'lucide-react';

export default function SubmitPage() {
  const { submitPassengerComplaint } = useRASStore();
  const [submitted, setSubmitted] = useState(false);
  const [ticketId, setTicketId] = useState('');
  const [form, setForm] = useState({
    trainNumber: '',
    coachLabel: '',
    travelDate: '',
    category: '',
    description: '',
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const id = submitPassengerComplaint(form);
    setTicketId(id);
    setSubmitted(true);
  };

  const handleReset = () => {
    setSubmitted(false);
    setTicketId('');
    setForm({
      trainNumber: '',
      coachLabel: '',
      travelDate: '',
      category: '',
      description: '',
    });
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-gradient-to-br from-background via-background to-amber-950/10">
      <div className="w-full max-w-lg">
        <AnimatePresence mode="wait">
          {!submitted ? (
            <motion.div
              key="form"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
            >
              {/* Header */}
              <div className="text-center mb-6">
                <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-gradient-to-br from-amber-500 to-orange-600 shadow-lg shadow-amber-500/20 mb-4">
                  <Shield className="w-7 h-7 text-white" />
                </div>
                <h1 className="text-2xl font-bold text-foreground">
                  Report a Grievance
                </h1>
                <p className="text-sm text-muted-foreground mt-1">
                  Rail-Asset Sentinel — Your complaint matters
                </p>
              </div>

              <Card className="border-border/50 bg-card/80 backdrop-blur-sm shadow-xl">
                <CardContent className="p-6">
                  <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="text-xs font-medium text-muted-foreground flex items-center gap-1.5 mb-1.5">
                          <Train className="w-3 h-3" />
                          Train Number
                        </label>
                        <Input
                          placeholder="e.g. 12843"
                          value={form.trainNumber}
                          onChange={(e) =>
                            setForm({ ...form, trainNumber: e.target.value })
                          }
                          required
                        />
                      </div>
                      <div>
                        <label className="text-xs font-medium text-muted-foreground flex items-center gap-1.5 mb-1.5">
                          <Tag className="w-3 h-3" />
                          Coach Label
                        </label>
                        <Input
                          placeholder="e.g. B4"
                          value={form.coachLabel}
                          onChange={(e) =>
                            setForm({ ...form, coachLabel: e.target.value })
                          }
                          required
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="text-xs font-medium text-muted-foreground flex items-center gap-1.5 mb-1.5">
                          <Calendar className="w-3 h-3" />
                          Travel Date
                        </label>
                        <Input
                          type="date"
                          value={form.travelDate}
                          onChange={(e) =>
                            setForm({ ...form, travelDate: e.target.value })
                          }
                          required
                        />
                      </div>
                      <div>
                        <label className="text-xs font-medium text-muted-foreground flex items-center gap-1.5 mb-1.5">
                          <Tag className="w-3 h-3" />
                          Category
                        </label>
                        <Select
                          value={form.category || undefined}
                          onValueChange={(v: string | null) =>
                            setForm({ ...form, category: v ?? '' })
                          }
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Select..." />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="AC">AC / Cooling</SelectItem>
                            <SelectItem value="Cleanliness">
                              Cleanliness
                            </SelectItem>
                            <SelectItem value="Staff Behaviour">
                              Staff Behaviour
                            </SelectItem>
                            <SelectItem value="Safety">Safety</SelectItem>
                            <SelectItem value="Other">Other</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>

                    <div>
                      <label className="text-xs font-medium text-muted-foreground flex items-center gap-1.5 mb-1.5">
                        <MessageSquare className="w-3 h-3" />
                        Description
                      </label>
                      <Textarea
                        placeholder="Describe the issue in detail..."
                        rows={4}
                        value={form.description}
                        onChange={(e) =>
                          setForm({ ...form, description: e.target.value })
                        }
                        required
                      />
                    </div>

                    <div>
                      <label className="text-xs font-medium text-muted-foreground flex items-center gap-1.5 mb-1.5">
                        <ImageIcon className="w-3 h-3" />
                        Photo / Video (optional)
                      </label>
                      <div className="border border-dashed border-border/50 rounded-lg p-6 text-center cursor-pointer hover:bg-muted/30 transition-colors">
                        <ImageIcon className="w-8 h-8 text-muted-foreground/30 mx-auto mb-2" />
                        <p className="text-xs text-muted-foreground">
                          Tap to upload photo or video
                        </p>
                      </div>
                    </div>

                    <Button
                      type="submit"
                      className="w-full bg-gradient-to-r from-amber-500 to-orange-600 hover:from-amber-400 hover:to-orange-500 text-white font-semibold shadow-lg shadow-amber-500/20"
                      size="lg"
                    >
                      <Send className="w-4 h-4 mr-2" />
                      Submit Complaint
                    </Button>
                  </form>
                </CardContent>
              </Card>
            </motion.div>
          ) : (
            <motion.div
              key="success"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className="text-center"
            >
              <Card className="border-emerald-500/30 bg-card/80 backdrop-blur-sm shadow-xl">
                <CardContent className="p-8">
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{
                      type: 'spring',
                      stiffness: 200,
                      delay: 0.1,
                    }}
                  >
                    <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-emerald-500/20 mb-4">
                      <CheckCircle2 className="w-8 h-8 text-emerald-400" />
                    </div>
                  </motion.div>

                  <h2 className="text-xl font-bold text-foreground mb-1">
                    Complaint Registered
                  </h2>
                  <p className="text-sm text-muted-foreground mb-4">
                    Your grievance has been logged and is being processed
                    by our AI system.
                  </p>

                  <div className="bg-muted/30 rounded-xl p-4 mb-4">
                    <p className="text-[10px] uppercase tracking-wider text-muted-foreground mb-1">
                      Ticket ID
                    </p>
                    <p className="text-2xl font-mono font-bold text-amber-400">
                      {ticketId}
                    </p>
                  </div>

                  <div className="flex flex-col gap-2 text-left bg-muted/20 rounded-xl p-4 mb-6">
                    <div className="flex items-center gap-2 text-xs text-muted-foreground">
                      <div className="w-5 h-5 rounded-full bg-emerald-500/20 flex items-center justify-center">
                        <CheckCircle2 className="w-3 h-3 text-emerald-400" />
                      </div>
                      AI categorization complete
                    </div>
                    <div className="flex items-center gap-2 text-xs text-muted-foreground">
                      <div className="w-5 h-5 rounded-full bg-emerald-500/20 flex items-center justify-center">
                        <CheckCircle2 className="w-3 h-3 text-emerald-400" />
                      </div>
                      Coach asset ID resolved
                    </div>
                    <div className="flex items-center gap-2 text-xs text-muted-foreground">
                      <div className="w-5 h-5 rounded-full bg-emerald-500/20 flex items-center justify-center">
                        <CheckCircle2 className="w-3 h-3 text-emerald-400" />
                      </div>
                      Duplicate check in progress
                    </div>
                  </div>

                  <Button variant="outline" onClick={handleReset}>
                    Submit Another Complaint
                  </Button>
                </CardContent>
              </Card>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
