"use client";

import { BookOpen, Edit3, Download, Zap, Shield, Globe } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

const features = [
  {
    icon: Zap,
    title: "AI-Assisted, Not AI-Generated",
    description:
      "Claude 3.5 Sonnet suggests the structure, but you have full control. Edit, reorder, add, or remove slides as you see fit.",
    color: "text-yellow-600 dark:text-yellow-400",
  },
  {
    icon: BookOpen,
    title: "Built for Philippine Teachers",
    description:
      "Supports English, Filipino, and bilingual content. Aligned with DepEd standards and private school curricula.",
    color: "text-blue-600 dark:text-blue-400",
  },
  {
    icon: Edit3,
    title: "Inline Editing & Drag-and-Drop",
    description:
      "Click any slide to edit. Drag to reorder. Add bullets, duplicate slides, or ask AI to improve specific sections.",
    color: "text-green-600 dark:text-green-400",
  },
  {
    icon: Download,
    title: "Export to Real PowerPoint",
    description:
      "Download fully editable .pptx files with professional formatting, speaker notes, and your chosen style.",
    color: "text-purple-600 dark:text-purple-400",
  },
  {
    icon: Shield,
    title: "Privacy-First",
    description:
      "Your content stays private. API key stored locally. No data collection. No sign-up required to start.",
    color: "text-red-600 dark:text-red-400",
  },
  {
    icon: Globe,
    title: "Lesson Plans Included",
    description:
      "Optionally generate a simple lesson plan alongside your slides. Export as markdown or copy to Word.",
    color: "text-indigo-600 dark:text-indigo-400",
  },
];

export function Features() {
  return (
    <section className="py-20 bg-white dark:bg-gray-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 dark:text-white mb-4">
            Everything you need to teach better, faster
          </h2>
          <p className="text-lg text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
            Designed specifically for busy teachers who want professional results without the formatting headaches.
          </p>
        </div>
        
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <Card key={index} className="border-2 hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className={`w-12 h-12 rounded-lg bg-gray-100 dark:bg-gray-800 flex items-center justify-center mb-4`}>
                  <feature.icon className={`w-6 h-6 ${feature.color}`} />
                </div>
                <CardTitle className="text-xl">{feature.title}</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-base">
                  {feature.description}
                </CardDescription>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}
