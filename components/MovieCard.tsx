"use client";

import Image from 'next/image';
import Link from 'next/link';
import { Star } from 'lucide-react';
import { motion } from 'framer-motion';
import type { Movie } from '@/types/movie';

interface MovieCardProps {
  movie: Movie;
  index?: number;
}

const MovieCard = ({ movie, index = 0 }: MovieCardProps) => {
  const posterUrl = movie?.posterUrl || '/placeholder-poster.jpg';

  if (!movie) return null;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{
        duration: 0.3,
        delay: index * 0.05,
        ease: "easeOut"
      }}
      whileHover={{ y: -5 }}
      className="group"
    >
      <Link href={`/movie/${movie.id}`}>
        <div className="relative aspect-[2/3] rounded-lg overflow-hidden bg-gray-800 shadow-lg">
          <Image
            src={posterUrl}
            alt={movie.title}
            fill
            className="object-cover transition-transform duration-300 group-hover:scale-105"
            sizes="(max-width: 640px) 45vw, (max-width: 1024px) 30vw, 20vw"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/50 to-transparent opacity-100" />
          
          <div className="absolute bottom-0 left-0 right-0 p-3">
            <h3 className="text-sm font-semibold text-white truncate mb-1">
              {movie.title}
            </h3>
            
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <Star className="w-3 h-3 text-yellow-400 fill-yellow-400" />
                <span className="ml-1 text-xs text-white">{movie.rating.toFixed(1)}</span>
              </div>
              <span className="text-xs text-gray-300">{movie.censor}</span>
            </div>

            <div className="flex flex-wrap gap-1 mt-1">
              {movie.genres.slice(0, 2).map((genre) => (
                <span
                  key={genre}
                  className="px-1.5 py-0.5 text-[10px] rounded-full bg-blue-600/30 text-blue-200"
                >
                  {genre}
                </span>
              ))}
            </div>
          </div>
        </div>
      </Link>
    </motion.div>
  );
};

export default MovieCard;