import type { LessonInputs, Slide } from "@/types";

const DRAFT_KEY = "lessonforge_draft";
const DEBOUNCE_DELAY = 500; // 500ms

export interface DraftData {
  inputs: LessonInputs | null;
  slides: Slide[];
  savedAt: number;
}

let saveTimeout: NodeJS.Timeout | null = null;

/**
 * Save draft to localStorage with debouncing
 */
export function saveDraft(inputs: LessonInputs | null, slides: Slide[]): void {
  // Clear existing timeout
  if (saveTimeout) {
    clearTimeout(saveTimeout);
  }

  // Set new timeout for debounced save
  saveTimeout = setTimeout(() => {
    try {
      const draft: DraftData = {
        inputs,
        slides,
        savedAt: Date.now(),
      };

      localStorage.setItem(DRAFT_KEY, JSON.stringify(draft));
    } catch (error) {
      console.error("Failed to save draft:", error);
    }
  }, DEBOUNCE_DELAY);
}

/**
 * Load draft from localStorage
 */
export function loadDraft(): DraftData | null {
  try {
    const stored = localStorage.getItem(DRAFT_KEY);
    if (!stored) {
      return null;
    }

    const draft: DraftData = JSON.parse(stored);
    
    // Validate draft structure
    if (!draft.savedAt) {
      console.warn("Invalid draft structure, ignoring");
      return null;
    }

    return draft;
  } catch (error) {
    console.error("Failed to load draft:", error);
    return null;
  }
}

/**
 * Clear saved draft from localStorage
 */
export function clearDraft(): void {
  try {
    localStorage.removeItem(DRAFT_KEY);
  } catch (error) {
    console.error("Failed to clear draft:", error);
  }
}

/**
 * Check if a draft exists
 */
export function hasDraft(): boolean {
  try {
    return localStorage.getItem(DRAFT_KEY) !== null;
  } catch (error) {
    return false;
  }
}

/**
 * Get draft age in milliseconds
 */
export function getDraftAge(): number | null {
  const draft = loadDraft();
  if (!draft) return null;
  
  return Date.now() - draft.savedAt;
}

/**
 * Format draft age for display
 */
export function formatDraftAge(ageMs: number): string {
  const seconds = Math.floor(ageMs / 1000);
  const minutes = Math.floor(seconds / 60);
  const hours = Math.floor(minutes / 60);
  const days = Math.floor(hours / 24);

  if (days > 0) return `${days} day${days > 1 ? 's' : ''} ago`;
  if (hours > 0) return `${hours} hour${hours > 1 ? 's' : ''} ago`;
  if (minutes > 0) return `${minutes} minute${minutes > 1 ? 's' : ''} ago`;
  return `${seconds} second${seconds !== 1 ? 's' : ''} ago`;
}
