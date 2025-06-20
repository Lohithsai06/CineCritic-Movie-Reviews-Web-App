"use client";

import { useState, useEffect } from "react";
import MovieCard from "@/components/MovieCard";
import { useMovieContext } from "@/context/MovieContext";
import { subscribeToMovies } from "@/lib/movieService";
import type { Movie } from "@/types/movie";
import { Film } from "lucide-react";
import { motion } from "framer-motion";

const MovieCardSkeleton = () => (
  <div className="bg-gray-800/50 rounded-lg overflow-hidden shadow-lg">
    <div className="aspect-[2/3] relative animate-pulse bg-gray-700">
      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent" />
      <div className="absolute bottom-0 left-0 right-0 p-3 space-y-2">
        <div className="h-4 bg-gray-600 rounded w-3/4"></div>
        <div className="flex items-center justify-between">
          <div className="h-3 bg-gray-600 rounded w-1/4"></div>
          <div className="h-3 bg-gray-600 rounded w-1/6"></div>
        </div>
      </div>
    </div>
  </div>
);

export default function Home() {
  const { searchQuery, filters } = useMovieContext();
  const [movies, setMovies] = useState<Movie[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = subscribeToMovies((updatedMovies) => {
      setMovies(updatedMovies);
      setIsLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const filteredMovies = movies.filter((movie) => {
    const matchesSearch = movie.title
      .toLowerCase()
      .includes(searchQuery.toLowerCase());
    const matchesGenre =
      filters.genres.length === 0 ||
      movie.genres.some((g) => filters.genres.includes(g));
    const matchesLanguage =
      filters.languages.length === 0 ||
      movie.languages.some((l) => filters.languages.includes(l));
    const matchesRating =
      movie.rating >= filters.minRating && movie.rating <= filters.maxRating;
    const matchesCensor =
      filters.censorRatings.length === 0 ||
      filters.censorRatings.includes(movie.censor);

    return (
      matchesSearch &&
      matchesGenre &&
      matchesLanguage &&
      matchesRating &&
      matchesCensor
    );
  });

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="min-h-[calc(100vh-4rem)] p-4 sm:p-6 mt-16"
    >
      {isLoading ? (
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3 sm:gap-4">
            {[...Array(10)].map((_, i) => (
              <MovieCardSkeleton key={i} />
            ))}
          </div>
        </div>
      ) : filteredMovies.length === 0 ? (
        <div className="flex items-center justify-center h-64">
          <div className="flex flex-col items-center text-center">
            <Film className="w-12 h-12 text-gray-400 mb-4" />
            <div className="text-xl text-gray-400">
              {movies.length === 0 ? "No movies found" : "No movies match your filters"}
            </div>
          </div>
        </div>
      ) : (
        <motion.div
          initial="hidden"
          animate="visible"
          variants={{
            hidden: { opacity: 0 },
            visible: {
              opacity: 1,
              transition: {
                staggerChildren: 0.05
              }
            }
          }}
          className="max-w-7xl mx-auto"
        >
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3 sm:gap-4">
            {filteredMovies.map((movie, index) => (
              <MovieCard 
                key={movie.id} 
                movie={movie}
                index={index}
              />
            ))}
          </div>
        </motion.div>
      )}
    </motion.div>
  );
}
