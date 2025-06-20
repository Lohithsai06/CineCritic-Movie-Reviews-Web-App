"use client";

import React, { createContext, useContext, useState, ReactNode } from 'react';

export interface MovieFilters {
  genres: string[];
  languages: string[];
  minRating: number;
  maxRating: number;
  censorRatings: string[];
}

interface MovieContextType {
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  filters: MovieFilters;
  setFilters: (filters: MovieFilters) => void;
}

const MovieContext = createContext<MovieContextType | undefined>(undefined);

export function MovieProvider({ children }: { children: ReactNode }) {
  const [searchQuery, setSearchQuery] = useState("");
  const [filters, setFilters] = useState<MovieFilters>({
    genres: [],
    languages: [],
    minRating: 0,
    maxRating: 5,
    censorRatings: [],
  });

  return (
    <MovieContext.Provider value={{ searchQuery, setSearchQuery, filters, setFilters }}>
      {children}
    </MovieContext.Provider>
  );
}

export function useMovieContext() {
  const context = useContext(MovieContext);
  if (context === undefined) {
    throw new Error('useMovieContext must be used within a MovieProvider');
  }
  return context;
}