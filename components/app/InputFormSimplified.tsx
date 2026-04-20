"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Sparkles, Loader2 } from "lucide-react";
import { useAppStore } from "@/lib/store";
import type { LessonInputs } from "@/types";


export function InputFormSimplified() {
  const { setInputs, setSlides, setIsGenerating, setError, setCurrentStep, isGenerating } = useAppStore();
  
  const [formData, setFormData] = useState<LessonInputs>({
    gradeLevel: "",
    subject: "",
    topic: "",
    content: "",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.gradeLevel.trim() || !formData.subject.trim() || !formData.topic.trim() || !formData.content.trim()) {
      setError("Please fill in all required fields");
      return;
    }

    if (formData.content.trim().length < 50) {
      setError("Please paste more textbook content (at least 50 characters)");
      return;
    }

    setIsGenerating(true);
    setError(null);
    setInputs(formData);

    try {
      const response = await fetch('/api/generate-slides', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to generate slides');
      }

      const { slides } = await response.json();
      setSlides(slides);
      setCurrentStep("editing");
    } catch (error) {
      setError("Something went wrong. Please try again.");
    } finally {
      setIsGenerating(false);
    }
  };

  const updateField = <K extends keyof LessonInputs>(field: K, value: LessonInputs[K]) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  return (
    <form onSubmit={handleSubmit} className="max-w-4xl mx-auto space-y-8">
      <div className="text-center space-y-3 mb-8">
        <h1 className="text-4xl font-bold tracking-tight">Create Your Lesson Slides</h1>
        <p className="text-xl text-muted-foreground">
          Just paste your textbook content and click one button
        </p>
      </div>

      <Card className="border-2">
        <CardHeader>
          <CardTitle className="text-2xl">Basic Information</CardTitle>
          <CardDescription className="text-base">
            Tell us about your lesson
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-3">
              <Label htmlFor="gradeLevel" className="text-lg font-semibold">Grade Level</Label>
              <Input
                id="gradeLevel"
                placeholder="e.g., Grade 7, Year 10, Senior High"
                value={formData.gradeLevel}
                onChange={(e) => updateField("gradeLevel", e.target.value)}
                className="h-12 text-base"
                required
              />
            </div>

            <div className="space-y-3">
              <Label htmlFor="subject" className="text-lg font-semibold">Subject</Label>
              <Input
                id="subject"
                placeholder="e.g., Science, Mathematics, English"
                value={formData.subject}
                onChange={(e) => updateField("subject", e.target.value)}
                className="h-12 text-base"
                required
              />
            </div>
          </div>

          <div className="space-y-3">
            <Label htmlFor="topic" className="text-lg font-semibold">Lesson Topic</Label>
            <Input
              id="topic"
              placeholder="e.g., Photosynthesis, The Philippine Revolution, Quadratic Equations"
              value={formData.topic}
              onChange={(e) => updateField("topic", e.target.value)}
              className="h-12 text-base"
              required
            />
          </div>

        </CardContent>
      </Card>

      <Card className="border-2 border-primary/20 bg-primary/5">
        <CardHeader>
          <CardTitle className="text-2xl">📚 Textbook Content</CardTitle>
          <CardDescription className="text-base">
            Paste your textbook or module content here - this is the most important part!
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Textarea
            id="content"
            placeholder="Paste your textbook lesson here (including examples, activities, etc.)"
            value={formData.content}
            onChange={(e) => updateField("content", e.target.value)}
            className="text-base font-mono resize-none min-h-[300px]"
            required
          />
          <p className="mt-3 text-sm text-muted-foreground">
            💡 Tip: Paste at least 500-1000 words. AI will automatically determine the optimal number of slides based on your content.
          </p>
        </CardContent>
      </Card>

      <Button
        type="submit"
        size="lg"
        className="w-full text-xl py-8 font-semibold"
        disabled={isGenerating || !formData.gradeLevel.trim() || !formData.subject.trim() || !formData.topic.trim() || !formData.content.trim()}
      >
        {isGenerating ? (
          <>
            <Loader2 className="w-6 h-6 mr-3 animate-spin" />
            Generating Your Slides...
          </>
        ) : (
          <>
            <Sparkles className="w-6 h-6 mr-3" />
            Generate My Slides
          </>
        )}
      </Button>

      {!isGenerating && (
        <p className="text-center text-muted-foreground">
          Click the button above and wait 10-30 seconds while AI analyzes your content and creates the perfect number of slides
        </p>
      )}
    </form>
  );
}
