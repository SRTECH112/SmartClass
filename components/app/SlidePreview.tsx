"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Download, FileText, Info, ArrowLeft } from "lucide-react";
import { useAppStore } from "@/lib/store";
import { generatePowerPoint } from "@/lib/pptx-generator";
import { generateLessonPlanMarkdown, downloadLessonPlan } from "@/lib/lesson-plan";

export function SlidePreview() {
  const { inputs, slides, lessonPlan, setError, setCurrentStep } = useAppStore();

  const handleDownloadPPTX = async () => {
    if (!inputs || slides.length === 0) {
      setError("No slides to download");
      return;
    }

    try {
      await generatePowerPoint(slides, inputs);
    } catch (error) {
      setError("Something went wrong. Please try again.");
    }
  };

  const handleDownloadLessonPlan = () => {
    if (!inputs || !lessonPlan) {
      setError("No lesson plan available");
      return;
    }

    try {
      const markdown = generateLessonPlanMarkdown(lessonPlan);
      downloadLessonPlan(inputs.topic, markdown);
    } catch (error) {
      setError("Something went wrong. Please try again.");
    }
  };

  const handleBack = () => {
    setCurrentStep("input");
  };

  if (!inputs) return null;

  return (
    <div className="min-h-screen bg-muted/30">
      {/* Header */}
      <div className="sticky top-0 z-20 bg-background border-b shadow-sm">
        <div className="max-w-6xl mx-auto px-6 py-6">
          <div className="mb-4">
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={handleBack}
              className="text-muted-foreground hover:text-foreground"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Generator
            </Button>
          </div>
          
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
            <div>
              <h1 className="text-3xl font-bold">{inputs.topic}</h1>
              <p className="text-lg text-muted-foreground mt-1">
                {inputs.gradeLevel} • {inputs.subject} • {slides.length} slides
              </p>
            </div>

            <div className="flex flex-wrap gap-3">
              {lessonPlan && (
                <Button variant="outline" size="lg" onClick={handleDownloadLessonPlan}>
                  <FileText className="w-5 h-5 mr-2" />
                  Lesson Plan
                </Button>
              )}

              <Button size="lg" onClick={handleDownloadPPTX} className="text-lg px-6">
                <Download className="w-5 h-5 mr-2" />
                Download PowerPoint
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Info Banner */}
      <div className="max-w-6xl mx-auto px-6 py-6">
        <Card className="border-blue-200 bg-blue-50 dark:bg-blue-950 dark:border-blue-800">
          <CardContent className="pt-6">
            <div className="flex items-start gap-3">
              <Info className="w-5 h-5 text-blue-600 dark:text-blue-400 flex-shrink-0 mt-0.5" />
              <div>
                <h3 className="font-semibold text-blue-700 dark:text-blue-300 mb-1">
                  Ready to Download
                </h3>
                <p className="text-sm text-blue-600 dark:text-blue-400">
                  Your slides are ready! Download the PowerPoint file and edit everything directly in PowerPoint - 
                  change text, add images, adjust colors, and customize to your needs.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Slide Preview Grid */}
      <div className="max-w-6xl mx-auto px-6 pb-12">
        <div className="mb-6">
          <h2 className="text-2xl font-bold">Slide Preview</h2>
          <p className="text-muted-foreground">
            Preview of your {slides.length} generated slides
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {slides.map((slide, index) => (
            <Card 
              key={slide.id} 
              className="hover:shadow-lg transition-shadow duration-200"
            >
              <CardHeader className="pb-3">
                <div className="flex items-start gap-3">
                  <div className="flex-shrink-0 w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-sm font-bold text-primary">
                    {index + 1}
                  </div>
                  <CardTitle className="text-lg leading-tight flex-1">
                    {slide.title}
                  </CardTitle>
                </div>
              </CardHeader>
              <CardContent>
                {slide.bullets.length > 0 ? (
                  <ul className="space-y-2 text-sm text-muted-foreground">
                    {slide.bullets.slice(0, 4).map((bullet, bulletIndex) => (
                      <li key={bulletIndex} className="flex items-start gap-2">
                        <span className="text-primary mt-1">•</span>
                        <span className="flex-1 line-clamp-2">{bullet}</span>
                      </li>
                    ))}
                    {slide.bullets.length > 4 && (
                      <li className="text-xs italic">
                        +{slide.bullets.length - 4} more points
                      </li>
                    )}
                  </ul>
                ) : (
                  <p className="text-sm text-muted-foreground italic">
                    Title slide
                  </p>
                )}
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Bottom Download Button */}
        <div className="mt-12 text-center">
          <Button 
            size="lg" 
            onClick={handleDownloadPPTX}
            className="text-xl px-12 py-8"
          >
            <Download className="w-6 h-6 mr-3" />
            Download PowerPoint ({slides.length} slides)
          </Button>
          <p className="mt-4 text-muted-foreground">
            Edit everything in PowerPoint after download
          </p>
        </div>
      </div>
    </div>
  );
}
