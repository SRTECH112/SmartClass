"use client";

import { useAppStore } from "@/lib/store";
import { InputFormSimplified } from "@/components/app/InputFormSimplified";
import { SlidePreview } from "@/components/app/SlidePreview";
import { DraftLoader } from "@/components/app/DraftLoader";
import { Card, CardContent } from "@/components/ui/card";
import { Loader2, AlertCircle } from "lucide-react";
import Link from "next/link";

export default function AppPage() {
  const { currentStep, isGenerating, error } = useAppStore();

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white dark:from-gray-900 dark:to-gray-800">
      <header className="border-b bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm sticky top-0 z-50">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <Link href="/" className="flex items-center gap-2">
              <div className="w-8 h-8 bg-gradient-to-br from-blue-600 to-green-600 rounded-lg" />
              <span className="font-bold text-xl">SmartClass</span>
            </Link>
            <p className="text-sm text-muted-foreground hidden sm:block">
               
            </p>
          </div>
        </div>
      </header>

      <main className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {currentStep === "input" && <DraftLoader />}

        {error && (
          <Card className="mb-6 border-destructive bg-destructive/10">
            <CardContent className="pt-6">
              <div className="flex items-start gap-3">
                <AlertCircle className="w-5 h-5 text-destructive mt-0.5" />
                <div>
                  <h3 className="font-semibold text-destructive">Error</h3>
                  <p className="text-sm text-destructive/90 mt-1">{error}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {isGenerating && (
          <Card className="mb-6 border-blue-200 bg-blue-50 dark:bg-blue-950 dark:border-blue-800">
            <CardContent className="pt-6">
              <div className="flex items-center gap-3">
                <Loader2 className="w-5 h-5 text-blue-600 dark:text-blue-400 animate-spin" />
                <div>
                  <h3 className="font-semibold text-blue-700 dark:text-blue-300">
                    AI is working...
                  </h3>
                  <p className="text-sm text-blue-600 dark:text-blue-400 mt-1">
                    AI is analyzing your content and organizing it into slides. This may take 10-30 seconds.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {currentStep === "input" && <InputFormSimplified />}

        {currentStep === "editing" && <SlidePreview />}
      </main>

      <footer className="border-t mt-16 py-8">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center text-sm text-muted-foreground">
          <p>Your content stays private. API key stored locally. No data collection.</p>
        </div>
      </footer>
    </div>
  );
}
