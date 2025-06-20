"use client";

import { useState } from 'react';
import { motion } from 'framer-motion';
import { ChevronLeft, ChevronRight } from 'lucide-react';

interface FilterPanelProps {
  onFilterChange: (filters: FilterState) => void;
  className?: string;
}

export interface FilterState {
  genres: string[];
  languages: string[];
  minRating: number;
  maxRating: number;
  censorRatings: string[];
}

const genres = ['Action', 'Comedy', 'Drama', 'Horror', 'Sci-Fi', 'Crime', 'Thriller'];
const languages = ['English', 'Spanish', 'Hindi', 'French', 'Japanese'];
const censorRatings = ['U', 'U/A', 'A'];

export const FilterPanel = ({ onFilterChange, className = '' }: FilterPanelProps) => {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [filters, setFilters] = useState<FilterState>({
    genres: [],
    languages: [],
    minRating: 0,
    maxRating: 5,
    censorRatings: [],
  });

  const handleFilterChange = (newFilters: Partial<FilterState>) => {
    const updatedFilters = { ...filters, ...newFilters };
    setFilters(updatedFilters);
    onFilterChange(updatedFilters);
  };

  return (
    <motion.div
      initial={{ x: 0 }}
      animate={{ x: isCollapsed ? '-90%' : 0 }}
      transition={{ duration: 0.3 }}
      className={`fixed left-0 top-20 h-[calc(100vh-5rem)] bg-gray-900/95 backdrop-blur-sm border-r border-gray-800 
      w-64 p-4 overflow-y-auto z-40 md:relative md:top-0 md:h-auto md:translate-x-0 ${className}`}
    >
      {/* Collapse toggle for mobile */}
      <button
        onClick={() => setIsCollapsed(!isCollapsed)}
        className="absolute -right-12 top-4 bg-gray-900 p-2 rounded-r-lg border border-gray-800 md:hidden"
      >
        {isCollapsed ? <ChevronRight /> : <ChevronLeft />}
      </button>

      <div className="space-y-6">
        <div>
          <h3 className="text-lg font-semibold mb-3 text-white">Genres</h3>
          <div className="flex flex-wrap gap-2">
            {genres.map((genre) => (
              <button
                key={genre}
                onClick={() => {
                  const newGenres = filters.genres.includes(genre)
                    ? filters.genres.filter(g => g !== genre)
                    : [...filters.genres, genre];
                  handleFilterChange({ genres: newGenres });
                }}
                className={`px-3 py-1 rounded-full text-sm transition-colors
                  ${filters.genres.includes(genre)
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-800 text-gray-300 hover:bg-gray-700'}`}
              >
                {genre}
              </button>
            ))}
          </div>
        </div>

        <div>
          <h3 className="text-lg font-semibold mb-3 text-white">Rating Range</h3>
          <div className="flex items-center space-x-4">
            <input
              type="range"
              min="0"
              max="5"
              step="0.5"
              value={filters.minRating}
              onChange={(e) => handleFilterChange({ minRating: parseFloat(e.target.value) })}
              className="w-full accent-blue-600"
            />
            <span className="text-gray-300 min-w-[4ch]">{filters.minRating}</span>
          </div>
          <div className="flex items-center space-x-4 mt-2">
            <input
              type="range"
              min="0"
              max="5"
              step="0.5"
              value={filters.maxRating}
              onChange={(e) => handleFilterChange({ maxRating: parseFloat(e.target.value) })}
              className="w-full accent-blue-600"
            />
            <span className="text-gray-300 min-w-[4ch]">{filters.maxRating}</span>
          </div>
        </div>

        <div>
          <h3 className="text-lg font-semibold mb-3 text-white">Censor Rating</h3>
          <div className="flex flex-wrap gap-2">
            {censorRatings.map((rating) => (
              <button
                key={rating}
                onClick={() => {
                  const newRatings = filters.censorRatings.includes(rating)
                    ? filters.censorRatings.filter(r => r !== rating)
                    : [...filters.censorRatings, rating];
                  handleFilterChange({ censorRatings: newRatings });
                }}
                className={`px-3 py-1 rounded-full text-sm transition-colors
                  ${filters.censorRatings.includes(rating)
                    ? 'bg-red-600 text-white'
                    : 'bg-gray-800 text-gray-300 hover:bg-gray-700'}`}
              >
                {rating}
              </button>
            ))}
          </div>
        </div>

        <div>
          <h3 className="text-lg font-semibold mb-3 text-white">Languages</h3>
          <div className="flex flex-wrap gap-2">
            {languages.map((language) => (
              <button
                key={language}
                onClick={() => {
                  const newLanguages = filters.languages.includes(language)
                    ? filters.languages.filter(l => l !== language)
                    : [...filters.languages, language];
                  handleFilterChange({ languages: newLanguages });
                }}
                className={`px-3 py-1 rounded-full text-sm transition-colors
                  ${filters.languages.includes(language)
                    ? 'bg-green-600 text-white'
                    : 'bg-gray-800 text-gray-300 hover:bg-gray-700'}`}
              >
                {language}
              </button>
            ))}
          </div>
        </div>

        <button
          onClick={() => handleFilterChange({
            genres: [],
            languages: [],
            minRating: 0,
            maxRating: 5,
            censorRatings: [],
          })}
          className="w-full py-2 text-sm text-gray-300 hover:text-white transition-colors"
        >
          Clear All Filters
        </button>
      </div>
    </motion.div>
  );
};

export default FilterPanel;