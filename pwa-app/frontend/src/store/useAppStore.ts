import { create } from 'zustand';
import type { AnalysisResult } from '../types';

interface AppState {
  // Selected items
  selectedTechniques: string[];
  selectedSoftware: string[];

  // Analysis
  threshold: number;
  analysisResults: AnalysisResult[] | null;
  isAnalyzing: boolean;
  potentialMatches: number;

  // UI state
  showResults: boolean;

  // Actions
  addTechnique: (technique: string) => void;
  removeTechnique: (technique: string) => void;
  addSoftware: (software: string) => void;
  removeSoftware: (software: string) => void;
  clearAll: () => void;

  setThreshold: (threshold: number) => void;
  setAnalysisResults: (results: AnalysisResult[]) => void;
  setIsAnalyzing: (isAnalyzing: boolean) => void;
  setPotentialMatches: (count: number) => void;
  setShowResults: (show: boolean) => void;

  reset: () => void;
}

export const useAppStore = create<AppState>((set) => ({
  // Initial state
  selectedTechniques: [],
  selectedSoftware: [],
  threshold: 50,
  analysisResults: null,
  isAnalyzing: false,
  potentialMatches: 0,
  showResults: false,

  // Actions
  addTechnique: (technique) =>
    set((state) => ({
      selectedTechniques: state.selectedTechniques.includes(technique)
        ? state.selectedTechniques
        : [...state.selectedTechniques, technique],
    })),

  removeTechnique: (technique) =>
    set((state) => ({
      selectedTechniques: state.selectedTechniques.filter((t) => t !== technique),
    })),

  addSoftware: (software) =>
    set((state) => ({
      selectedSoftware: state.selectedSoftware.includes(software)
        ? state.selectedSoftware
        : [...state.selectedSoftware, software],
    })),

  removeSoftware: (software) =>
    set((state) => ({
      selectedSoftware: state.selectedSoftware.filter((s) => s !== software),
    })),

  clearAll: () =>
    set({
      selectedTechniques: [],
      selectedSoftware: [],
      analysisResults: null,
      showResults: false,
      potentialMatches: 0,
    }),

  setThreshold: (threshold) => set({ threshold }),

  setAnalysisResults: (results) =>
    set({
      analysisResults: results,
      showResults: true,
      isAnalyzing: false,
    }),

  setIsAnalyzing: (isAnalyzing) => set({ isAnalyzing }),

  setPotentialMatches: (count) => set({ potentialMatches: count }),

  setShowResults: (show) => set({ showResults: show }),

  reset: () =>
    set({
      selectedTechniques: [],
      selectedSoftware: [],
      threshold: 50,
      analysisResults: null,
      isAnalyzing: false,
      potentialMatches: 0,
      showResults: false,
    }),
}));
