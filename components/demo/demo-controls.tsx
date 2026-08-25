'use client';

import { useState } from 'react';
import { useRASStore } from '@/lib/store';
import { Button } from '@/components/ui/button';
import {
  Play,
  RotateCcw,
  ImageOff,
  ImageIcon,
  Zap,
  ChevronUp,
  ChevronDown,
  Sparkles,
} from 'lucide-react';

export function DemoControls() {
  const [isOpen, setIsOpen] = useState(false);
  const {
    demoStep,
    triggerDemoBatch,
    submitResolutionPhoto,
    triggerThirdComplaint,
    resetDemo,
    isAuditing,
  } = useRASStore();

  return (
    <div className="fixed bottom-4 right-4 z-50">
      <div className="flex flex-col items-end gap-2">
        {isOpen && (
          <div className="bg-card/95 backdrop-blur-xl border border-border/50 rounded-xl shadow-2xl p-4 w-80 animate-in slide-in-from-bottom-2 duration-300">
            <div className="flex items-center gap-2 mb-3 pb-3 border-b border-border/50">
              <Sparkles className="w-4 h-4 text-amber-400" />
              <h3 className="text-sm font-semibold text-foreground">
                Demo Controls
              </h3>
              <span className="ml-auto text-[10px] font-mono text-muted-foreground bg-muted/50 px-2 py-0.5 rounded-full">
                Step {demoStep}/4
              </span>
            </div>

            <div className="space-y-2">
              {/* Step 1: Trigger batch complaints */}
              <Button
                variant="outline"
                size="sm"
                className="w-full justify-start gap-2 text-xs"
                onClick={triggerDemoBatch}
                disabled={demoStep >= 1}
              >
                <Play className="w-3.5 h-3.5 text-blue-400" />
                <span>1. Submit 3 Complaints (Staggered)</span>
              </Button>

              {/* Step 2: Wrong photo */}
              <Button
                variant="outline"
                size="sm"
                className="w-full justify-start gap-2 text-xs"
                onClick={() => submitResolutionPhoto('wrong')}
                disabled={demoStep < 1 || demoStep >= 3 || isAuditing}
              >
                <ImageOff className="w-3.5 h-3.5 text-red-400" />
                <span>2. Upload Wrong Fix Photo</span>
                {isAuditing && demoStep < 2 && (
                  <span className="ml-auto text-amber-400 animate-pulse text-[10px]">
                    Auditing...
                  </span>
                )}
              </Button>

              {/* Step 3: Correct photo */}
              <Button
                variant="outline"
                size="sm"
                className="w-full justify-start gap-2 text-xs"
                onClick={() => submitResolutionPhoto('correct')}
                disabled={demoStep < 2 || demoStep >= 4 || isAuditing}
              >
                <ImageIcon className="w-3.5 h-3.5 text-emerald-400" />
                <span>3. Upload Correct Fix Photo</span>
                {isAuditing && demoStep >= 2 && demoStep < 3 && (
                  <span className="ml-auto text-amber-400 animate-pulse text-[10px]">
                    Auditing...
                  </span>
                )}
              </Button>

              {/* Step 4: Cross-train recurrence */}
              <Button
                variant="outline"
                size="sm"
                className="w-full justify-start gap-2 text-xs"
                onClick={triggerThirdComplaint}
                disabled={demoStep < 3 || demoStep >= 4}
              >
                <Zap className="w-3.5 h-3.5 text-amber-400" />
                <span>4. Trigger Cross-Train Recurrence</span>
              </Button>

              <div className="pt-2 border-t border-border/50">
                <Button
                  variant="ghost"
                  size="sm"
                  className="w-full justify-start gap-2 text-xs text-muted-foreground hover:text-foreground"
                  onClick={resetDemo}
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                  <span>Reset Demo</span>
                </Button>
              </div>
            </div>
          </div>
        )}

        <Button
          onClick={() => setIsOpen(!isOpen)}
          className="rounded-full w-12 h-12 bg-gradient-to-br from-amber-500 to-orange-600 hover:from-amber-400 hover:to-orange-500 shadow-lg shadow-amber-500/30 hover:shadow-amber-500/50 transition-all duration-300"
          size="icon"
        >
          {isOpen ? (
            <ChevronDown className="w-5 h-5 text-white" />
          ) : (
            <ChevronUp className="w-5 h-5 text-white" />
          )}
        </Button>
      </div>
    </div>
  );
}
