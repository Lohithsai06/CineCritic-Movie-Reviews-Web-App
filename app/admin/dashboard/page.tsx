"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import { Trash2, Edit, Star, Film, PlusCircle } from "lucide-react";
import { getAllMovies, deleteMovie } from "@/lib/movieService";
import type { Movie } from "@/types/movie";
import { useAuth } from "@/lib/useAuth";
import { useRouter } from "next/navigation";

export default function AdminDashboard() {
  const { user, loading } = useAuth();
  const router = useRouter();
  const [movies, setMovies] = useState<Movie[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const loadMovies = async () => {
    try {
      const data = await getAllMovies();
      setMovies(data);
    } catch (error) {
      console.error("Error loading movies:", error);
      alert("Failed to load movies");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (!loading && !user) {
      router.push("/admin/login");
      return;
    }
    loadMovies();
  }, [loading, user, router]);

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this movie?")) return;

    try {
      setDeletingId(id);
      await deleteMovie(id);
      setMovies(movies.filter((movie) => movie.id !== id));
    } catch (error) {
      console.error("Error deleting movie:", error);
      alert("Failed to delete movie");
    } finally {
      setDeletingId(null);
    }
  };

  if (loading || !user) {
    return (
      <div className="min-h-[calc(100vh-5rem)] flex flex-col items-center justify-center bg-[#0a0d14]">
        <Film className="w-12 h-12 text-blue-500 animate-spin" />
        <p className="mt-4 text-gray-400">Loading...</p>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="min-h-[calc(100vh-5rem)] flex flex-col items-center justify-center bg-[#0a0d14]">
        <Film className="w-12 h-12 text-blue-500 animate-spin" />
        <p className="mt-4 text-gray-400">Loading movies...</p>
      </div>
    );
  }

  if (movies.length === 0) {
    return (
      <div className="min-h-[calc(100vh-5rem)] flex flex-col items-center justify-center bg-[#0a0d14]">
        <div className="text-center">
          <Film className="w-16 h-16 text-gray-600 mx-auto mb-4" />
          <h2 className="text-xl font-semibold text-gray-200 mb-2">
            No Movies Yet
          </h2>
          <p className="text-gray-400 mb-6">
            Start by adding your first movie review
          </p>
          <Link
            href="/admin/add-movie"
            className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            <PlusCircle className="w-5 h-5 mr-2" />
            Add Movie
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full min-h-[calc(100vh-5rem)] bg-[#0a0d14]">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-2xl font-bold text-white">Movie Dashboard</h1>
        <Link
          href="/admin/add-movie"
          className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
        >
          <PlusCircle className="w-5 h-5 mr-2" />
          Add Movie
        </Link>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {movies.map((movie) => (
          <motion.div
            key={movie.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            className="bg-gray-800/50 backdrop-blur-sm rounded-lg overflow-hidden shadow-lg group"
          >
            {/* Movie Poster */}
            <div className="relative aspect-[2/3]">
              <Image
                src={movie.posterUrl}
                alt={movie.title}
                fill
                className="object-cover"
                sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, (max-width: 1280px) 33vw, 25vw"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity">
                <div className="absolute bottom-0 left-0 right-0 p-4 flex justify-between items-center">
                  <Link
                    href={`/admin/edit/${movie.id}`}
                    className="p-2 text-white bg-blue-600/80 rounded-full hover:bg-blue-600 transition-colors"
                  >
                    <Edit className="w-4 h-4" />
                  </Link>
                  <button
                    onClick={() => movie.id && handleDelete(movie.id)}
                    disabled={deletingId === movie.id}
                    className={`p-2 text-white bg-red-600/80 rounded-full hover:bg-red-600 transition-colors ${
                      deletingId === movie.id
                        ? "opacity-50 cursor-not-allowed"
                        : ""
                    }`}
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>

            {/* Movie Info */}
            <div className="p-4">
              <h3
                className="font-semibold text-lg mb-2 line-clamp-1"
                title={movie.title}
              >
                {movie.title}
              </h3>

              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center">
                  <Star className="w-4 h-4 text-yellow-400 fill-current" />
                  <span className="ml-1 text-sm text-white">
                    {movie.rating.toFixed(1)}
                  </span>
                </div>
                <span className="text-sm text-gray-300">{movie.censor}</span>
              </div>

              <div className="flex flex-wrap gap-1">
                {movie.genres.slice(0, 2).map((genre) => (
                  <span
                    key={genre}
                    className="px-2 py-0.5 text-xs rounded-full bg-blue-600/30 text-blue-200"
                  >
                    {genre}
                  </span>
                ))}
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
