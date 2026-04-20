export type SlideLayout = 
  | "title_content" 
  | "two_column" 
  | "title_only" 
  | "content_only"
  | "activity"
  | "assessment";

export type PresentationStyle = 
  | "clean_professional" 
  | "colorful_engaging" 
  | "minimalist";

export type Language = "english" | "filipino" | "bilingual";

export interface Slide {
  id: string;
  title: string;
  bullets: string[];
  layout: SlideLayout;
  notes?: string;
}

export interface LessonInputs {
  gradeLevel: string;
  subject: string;
  topic: string;
  content: string;
}

export interface LessonPlan {
  topic: string;
  gradeLevel: string;
  subject: string;
  objectives: string[];
  materials: string[];
  procedure: {
    introduction: string;
    development: string;
    practice: string;
    assessment: string;
    closure: string;
  };
  evaluation: string;
  assignment?: string;
}

export interface AppState {
  inputs: LessonInputs | null;
  slides: Slide[];
  lessonPlan: LessonPlan | null;
  isGenerating: boolean;
  error: string | null;
  currentStep: "input" | "editing" | "complete";
  setInputs: (inputs: LessonInputs) => void;
  setSlides: (slides: Slide[]) => void;
  updateSlide: (id: string, updates: Partial<Slide>) => void;
  deleteSlide: (id: string) => void;
  duplicateSlide: (id: string) => void;
  moveSlide: (id: string, direction: "up" | "down") => void;
  reorderSlides: (slides: Slide[]) => void;
  regenerateSlide: (id: string) => Promise<void>;
  setLessonPlan: (plan: LessonPlan | null) => void;
  setIsGenerating: (isGenerating: boolean) => void;
  setError: (error: string | null) => void;
  setCurrentStep: (step: "input" | "editing" | "complete") => void;
  loadDraftData: () => boolean;
  clearDraftData: () => void;
  reset: () => void;
}
