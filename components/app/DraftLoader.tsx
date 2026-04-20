"use client";

import { useEffect, useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { FileText, X } from "lucide-react";
import { useAppStore } from "@/lib/store";
import { hasDraft, getDraftAge, formatDraftAge } from "@/lib/draft-storage";

export function DraftLoader() {
  const { loadDraftData, clearDraftData } = useAppStore();
  const [showPrompt, setShowPrompt] = useState(false);
  const [draftAge, setDraftAge] = useState<string>("");

  useEffect(() => {
    // Check for draft on mount
    if (hasDraft()) {
      const age = getDraftAge();
      if (age !== null) {
        setDraftAge(formatDraftAge(age));
        setShowPrompt(true);
      }
    }
  }, []);

  const handleLoadDraft = () => {
    const loaded = loadDraftData();
    if (loaded) {
      setShowPrompt(false);
    }
  };

  const handleDismiss = () => {
    setShowPrompt(false);
  };

  const handleClearDraft = () => {
    clearDraftData();
    setShowPrompt(false);
  };

  if (!showPrompt) return null;

  return (
    <Card className="border-blue-200 bg-blue-50 dark:bg-blue-950 dark:border-blue-800 mb-6">
      <CardContent className="pt-6">
        <div className="flex items-start gap-4">
          <FileText className="w-6 h-6 text-blue-600 dark:text-blue-400 flex-shrink-0 mt-1" />
          <div className="flex-1">
            <h3 className="font-semibold text-blue-700 dark:text-blue-300 mb-1">
              Draft Found
            </h3>
            <p className="text-sm text-blue-600 dark:text-blue-400 mb-4">
              You have an unsaved draft from {draftAge}. Would you like to continue where you left off?
            </p>
            <div className="flex gap-3">
              <Button onClick={handleLoadDraft} size="sm">
                Load Draft
              </Button>
              <Button onClick={handleDismiss} variant="outline" size="sm">
                Start Fresh
              </Button>
              <Button 
                onClick={handleClearDraft} 
                variant="ghost" 
                size="sm"
                className="text-destructive hover:text-destructive"
              >
                <X className="w-4 h-4 mr-1" />
                Delete Draft
              </Button>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
