"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import Head from "next/head";
import Link from "next/link";
import { motion } from "framer-motion";
import { Star, Globe, Tag, Shield, Home } from "lucide-react";
import { getMovie } from "@/lib/movieService";
import type { Movie } from "@/types/movie";

const MovieDetailSkeleton = () => (
  <div className="min-h-screen bg-[#0a0d14] py-20">
    <div className="container mx-auto px-4">
      <div className="max-w-6xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="relative aspect-[2/3] rounded-lg overflow-hidden animate-pulse bg-gray-700" />
          <div className="md:col-span-2 space-y-6">
            <div className="h-8 bg-gray-700 rounded w-3/4 animate-pulse" />
            <div className="flex gap-4">
              <div className="h-6 bg-gray-700 rounded w-24 animate-pulse" />
              <div className="h-6 bg-gray-700 rounded w-24 animate-pulse" />
            </div>
            <div className="space-y-4">
              <div className="h-20 bg-gray-700 rounded animate-pulse" />
              <div className="h-40 bg-gray-700 rounded animate-pulse" />
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
);

const NotFound = () => (
  <div className="min-h-screen bg-[#0a0d14] flex items-center justify-center">
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="text-center"
    >
      <h1 className="text-4xl font-bold text-white mb-4">
        404 - Movie Not Found
      </h1>
      <p className="text-gray-400 mb-8">
        The movie you&apos;re looking for doesn&apos;t exist or has been
        removed.
      </p>
      <Link
        href="/"
        className="inline-flex items-center px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
      >
        <Home className="w-5 h-5 mr-2" />
        Back to Home
      </Link>
    </motion.div>
  </div>
);

export default function MoviePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const router = useRouter();
  const [movie, setMovie] = useState<Movie | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    const loadMovie = async () => {
      try {
        // Await the params promise to get the actual id
        const resolvedParams = await params;
        const data = await getMovie(resolvedParams.id);
        setMovie(data);
      } catch (error) {
        console.error("Error loading movie:", error);
        setError(true);
      } finally {
        setIsLoading(false);
      }
    };

    loadMovie();
  }, [params]);

  if (isLoading) {
    return <MovieDetailSkeleton />;
  }

  if (error || !movie) {
    return <NotFound />;
  }

  return (
    <>
      <Head>
        <title>{`${movie.title} - CineCritic Review`}</title>
        <meta
          name="description"
          content={`Read our review of ${movie.title}. Rating: ${
            movie.rating
          }/5. ${movie.review.slice(0, 150)}...`}
        />
        <meta
          property="og:title"
          content={`${movie.title} - CineCritic Review`}
        />
        <meta
          property="og:description"
          content={`Read our review of ${movie.title}. Rating: ${movie.rating}/5`}
        />
        <meta
          property="og:image"
          content={movie.posterUrl || "/placeholder-poster.jpg"}
        />
      </Head>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="min-h-screen bg-[#0a0d14] py-20 px-4 md:px-6 overflow-x-hidden"
      >
        <div className="container mx-auto">
          <div className="max-w-6xl mx-auto">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {/* Movie Poster */}
              <motion.div
                initial={{ x: -50, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ delay: 0.2 }}
                className="relative aspect-[2/3] rounded-lg overflow-hidden shadow-2xl"
              >
                <Image
                  src={movie.posterUrl || "/placeholder-poster.jpg"}
                  alt={movie.title}
                  fill
                  className="object-cover"
                  priority
                />
              </motion.div>

              {/* Movie Details */}
              <motion.div
                initial={{ x: 50, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ delay: 0.3 }}
                className="md:col-span-2 space-y-6"
              >
                <h1 className="text-3xl md:text-4xl font-bold text-white">
                  {movie.title}
                </h1>

                <div className="flex flex-wrap gap-4 text-gray-300">
                  <motion.div
                    className="flex items-center"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.4 }}
                  >
                    <Star className="w-5 h-5 text-yellow-400 fill-current" />
                    <span className="ml-2">
                      {movie.rating.toFixed(1)} Rating
                    </span>
                  </motion.div>
                  <motion.div
                    className="flex items-center"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.5 }}
                  >
                    <Shield className="w-5 h-5 text-blue-400" />
                    <span className="ml-2">{movie.censor} Rated</span>
                  </motion.div>
                </div>

                <motion.div
                  className="space-y-4"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.6 }}
                >
                  <div className="flex items-start gap-2">
                    <Globe className="w-5 h-5 text-gray-400 mt-1 flex-shrink-0" />
                    <div>
                      <div className="text-gray-400 mb-1">Languages</div>
                      <div className="flex flex-wrap gap-2">
                        {movie.languages.map((lang) => (
                          <span
                            key={lang}
                            className="px-3 py-1 bg-gray-800 rounded-full text-sm text-gray-300"
                          >
                            {lang}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>

                  <div className="flex items-start gap-2">
                    <Tag className="w-5 h-5 text-gray-400 mt-1 flex-shrink-0" />
                    <div>
                      <div className="text-gray-400 mb-1">Genres</div>
                      <div className="flex flex-wrap gap-2">
                        {movie.genres.map((genre) => (
                          <span
                            key={genre}
                            className="px-3 py-1 bg-blue-600/30 rounded-full text-sm text-blue-200"
                          >
                            {genre}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                </motion.div>

                <motion.div
                  className="pt-6"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.7 }}
                >
                  <h2 className="text-xl font-semibold text-white mb-4">
                    Review
                  </h2>
                  <p className="text-gray-300 leading-relaxed whitespace-pre-wrap">
                    {movie.review}
                  </p>
                </motion.div>

                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => router.back()}
                  className="inline-flex items-center px-4 py-2 bg-gray-800 text-white rounded-lg hover:bg-gray-700 transition-colors"
                >
                  Back to Movies
                </motion.button>
              </motion.div>
            </div>
          </div>
        </div>
      </motion.div>
    </>
  );
}
