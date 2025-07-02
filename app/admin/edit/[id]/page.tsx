"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import AdminMovieForm from "@/components/AdminMovieForm";
import { getMovie } from "@/lib/movieService";
import type { Movie } from "@/types/movie";

export default function EditMoviePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const router = useRouter();
  const [movie, setMovie] = useState<Movie | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadMovie = async () => {
      try {
        // Await the params promise to get the actual id
        const resolvedParams = await params;
        const id = resolvedParams.id;

        const movieData = await getMovie(id);
        setMovie(movieData);
      } catch (error) {
        console.error("Error loading movie:", error);
        router.push("/admin/dashboard");
      } finally {
        setIsLoading(false);
      }
    };

    loadMovie();
  }, [params, router]);

  if (isLoading || !movie) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        Loading...
      </div>
    );
  }

  return (
    <div className="py-8">
      <h1 className="text-2xl font-bold mb-6 text-center">
        Edit Movie: {movie.title}
      </h1>
      <AdminMovieForm initialData={movie} isEdit />
    </div>
  );
}
