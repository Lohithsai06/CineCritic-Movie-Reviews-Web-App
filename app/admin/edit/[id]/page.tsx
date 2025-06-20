"use client";

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import AdminMovieForm from '@/components/AdminMovieForm';
import { getMovie } from '@/lib/movieService';
import type { Movie } from '@/types/movie';

export default function EditMoviePage({ params }: { params: { id: string } }) {
  const router = useRouter();
  const [movie, setMovie] = useState<Movie | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadMovie = async () => {
      try {
        const movieData = await getMovie(params.id);
        setMovie(movieData);
      } catch (error) {
        console.error('Error loading movie:', error);
        alert('Failed to load movie');
        router.push('/admin/dashboard');
      } finally {
        setIsLoading(false);
      }
    };

    loadMovie();
  }, [params.id, router]);

  if (isLoading || !movie) {
    return <div className="flex justify-center items-center min-h-screen">Loading...</div>;
  }

  return (
    <div className="py-8">
      <h1 className="text-2xl font-bold mb-6 text-center">Edit Movie: {movie.title}</h1>
      <AdminMovieForm initialData={movie} isEdit />
    </div>
  );
}