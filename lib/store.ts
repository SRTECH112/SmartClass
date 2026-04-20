import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { AppState, Slide, LessonInputs, LessonPlan } from "@/types";
import { generateId } from "./utils";
import { saveDraft, loadDraft, clearDraft } from "./draft-storage";

export const useAppStore = create<AppState>()(
  persist(
    (set) => ({
      inputs: null,
      slides: [],
      lessonPlan: null,
      isGenerating: false,
      error: null,
      currentStep: "input",

      setInputs: (inputs: LessonInputs) => {
        set({ inputs });
        const state = useAppStore.getState();
        saveDraft(inputs, state.slides);
      },

      setSlides: (slides: Slide[]) => {
        set({ slides });
        const state = useAppStore.getState();
        saveDraft(state.inputs, slides);
      },

      updateSlide: (id: string, updates: Partial<Slide>) => {
        set((state) => ({
          slides: state.slides.map((slide) =>
            slide.id === id ? { ...slide, ...updates } : slide
          ),
        }));
        const state = useAppStore.getState();
        saveDraft(state.inputs, state.slides);
      },

      deleteSlide: (id: string) => {
        set((state) => ({
          slides: state.slides.filter((slide) => slide.id !== id),
        }));
        const state = useAppStore.getState();
        saveDraft(state.inputs, state.slides);
      },

      duplicateSlide: (id: string) => {
        set((state) => {
          const slideIndex = state.slides.findIndex((s) => s.id === id);
          if (slideIndex === -1) return state;

          const slideToDuplicate = state.slides[slideIndex];
          const newSlide: Slide = {
            ...slideToDuplicate,
            id: generateId(),
            title: `${slideToDuplicate.title} (Copy)`,
          };

          const newSlides = [...state.slides];
          newSlides.splice(slideIndex + 1, 0, newSlide);

          return { slides: newSlides };
        });
        const state = useAppStore.getState();
        saveDraft(state.inputs, state.slides);
      },

      moveSlide: (id: string, direction: "up" | "down") => {
        set((state) => {
          const currentIndex = state.slides.findIndex((s) => s.id === id);
          if (currentIndex === -1) return state;

          const newIndex = direction === "up" ? currentIndex - 1 : currentIndex + 1;
          if (newIndex < 0 || newIndex >= state.slides.length) return state;

          const newSlides = [...state.slides];
          const [movedSlide] = newSlides.splice(currentIndex, 1);
          newSlides.splice(newIndex, 0, movedSlide);

          return { slides: newSlides };
        });
        const state = useAppStore.getState();
        saveDraft(state.inputs, state.slides);
      },

      reorderSlides: (slides: Slide[]) => {
        set({ slides });
        const state = useAppStore.getState();
        saveDraft(state.inputs, slides);
      },

      regenerateSlide: async (id: string) => {
        const state = useAppStore.getState();
        const slideToRegenerate = state.slides.find(s => s.id === id);
        const { inputs } = state;

        if (!slideToRegenerate || !inputs) {
          set({ error: "Cannot regenerate slide: missing data" });
          return;
        }

        set({ isGenerating: true, error: null });

        try {
          const response = await fetch('/api/regenerate-slide', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              gradeLevel: inputs.gradeLevel,
              subject: inputs.subject,
              topic: inputs.topic,
              currentSlide: {
                title: slideToRegenerate.title,
                bullets: slideToRegenerate.bullets,
              },
              lessonContext: inputs.content,
            }),
          });

          if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.error || 'Failed to regenerate slide');
          }

          const { slide } = await response.json();

          // Update the slide while keeping its ID and position
          set((state) => ({
            slides: state.slides.map((s) =>
              s.id === id
                ? {
                    ...s,
                    title: slide.title,
                    bullets: slide.bullets,
                    layout: slide.layout,
                  }
                : s
            ),
            isGenerating: false,
          }));
        } catch (error) {
          set({
            error: error instanceof Error ? error.message : "Failed to regenerate slide",
            isGenerating: false,
          });
        }
      },

      setLessonPlan: (plan: LessonPlan | null) => {
        set({ lessonPlan: plan });
      },

      setIsGenerating: (isGenerating: boolean) => {
        set({ isGenerating });
      },

      setError: (error: string | null) => {
        set({ error });
      },

      setCurrentStep: (step: "input" | "editing" | "complete") => {
        set({ currentStep: step });
      },

      loadDraftData: () => {
        const draft = loadDraft();
        if (draft) {
          set({
            inputs: draft.inputs,
            slides: draft.slides,
            currentStep: draft.slides.length > 0 ? "editing" : "input",
          });
          return true;
        }
        return false;
      },

      clearDraftData: () => {
        clearDraft();
      },

      reset: () => {
        set({
          inputs: null,
          slides: [],
          lessonPlan: null,
          isGenerating: false,
          error: null,
          currentStep: "input",
        });
        clearDraft();
      },
    }),
    {
      name: "lessonforge-storage",
      partialize: () => ({}),
    }
  )
);
