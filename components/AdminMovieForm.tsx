"use client";

import { useState, useRef } from "react";
import { useRouter } from "next/navigation";
import { Upload, X } from "lucide-react";
import type { Movie } from "@/types/movie";
import { addMovie, updateMovie } from "@/lib/movieService";
import Image from "next/image";

interface AdminMovieFormProps {
  initialData?: Movie;
  isEdit?: boolean;
}

const genres = [
  "Action",
  "Comedy",
  "Drama",
  "Horror",
  "Sci-Fi",
  "Crime",
  "Thriller",
];
const languages = [
  "English",
  "Hindi",
  "Telugu",
  "Tamil",
  "Malayalam",
  "Kannada",
];
const censorRatings = ["U", "U/A", "A"] as const;

export default function AdminMovieForm({
  initialData,
  isEdit = false,
}: AdminMovieFormProps) {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string>(
    initialData?.posterUrl || ""
  );

  const [formData, setFormData] = useState({
    title: initialData?.title || "",
    genres: initialData?.genres || [],
    languages: initialData?.languages || [],
    censor: (initialData?.censor || "U") as "U" | "U/A" | "A",
    rating: initialData?.rating || 0,
    review: initialData?.review || "",
  });

  const [errors, setErrors] = useState<
    Partial<Record<keyof typeof formData | "poster", string>>
  >({});

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        setErrors((prev) => ({
          ...prev,
          poster: "Image size should be less than 5MB",
        }));
        return;
      }
      setErrors((prev) => ({ ...prev, poster: undefined }));
      setSelectedImage(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        if (typeof reader.result === "string") {
          setImagePreview(reader.result);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const validate = () => {
    const newErrors: typeof errors = {};
    if (!formData.title) newErrors.title = "Title is required";
    if (!formData.genres.length) newErrors.genres = "Select at least one genre";
    if (!formData.languages.length)
      newErrors.languages = "Select at least one language";
    if (!imagePreview && !selectedImage)
      newErrors.poster = "Poster is required";
    if (!formData.review) newErrors.review = "Review is required";
    if (formData.rating < 1 || formData.rating > 5)
      newErrors.rating = "Rating must be between 1 and 5";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    setIsLoading(true);
    try {
      const posterUrl = imagePreview;

      if (isEdit && initialData?.id) {
        await updateMovie(initialData.id, { ...formData, posterUrl });
      } else {
        await addMovie({ ...formData, posterUrl });
      }
      router.push("/admin/dashboard");
      router.refresh();
    } catch (error) {
      console.error("Error saving movie:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const toggleSelection = (field: "genres" | "languages", value: string) => {
    const current = formData[field];
    const updated = current.includes(value)
      ? current.filter((item) => item !== value)
      : [...current, value];
    setFormData({ ...formData, [field]: updated });
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="space-y-8 max-w-4xl mx-auto bg-gray-800/50 backdrop-blur-sm rounded-xl shadow-xl p-6"
    >
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Left Column */}
        <div className="space-y-6">
          {/* Title */}
          <div>
            <label className="block text-sm font-medium text-gray-200 mb-2">
              Title
            </label>
            <input
              type="text"
              value={formData.title}
              onChange={(e) =>
                setFormData({ ...formData, title: e.target.value })
              }
              className="w-full px-4 py-2 bg-gray-700/50 text-white rounded-lg border border-gray-600 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none"
              placeholder="Enter movie title"
            />
            {errors.title && (
              <p className="mt-1 text-sm text-red-500">{errors.title}</p>
            )}
          </div>

          {/* Genres */}
          <div>
            <label className="block text-sm font-medium text-gray-200 mb-2">
              Genres
            </label>
            <div className="flex flex-wrap gap-2">
              {genres.map((genre) => (
                <button
                  key={genre}
                  type="button"
                  onClick={() => toggleSelection("genres", genre)}
                  className={`px-3 py-1 rounded-full text-sm transition-colors ${
                    formData.genres.includes(genre)
                      ? "bg-blue-600 text-white"
                      : "bg-gray-700/50 text-gray-300 hover:bg-gray-600"
                  }`}
                >
                  {genre}
                </button>
              ))}
            </div>
            {errors.genres && (
              <p className="mt-1 text-sm text-red-500">{errors.genres}</p>
            )}
          </div>

          {/* Languages */}
          <div>
            <label className="block text-sm font-medium text-gray-200 mb-2">
              Languages
            </label>
            <div className="flex flex-wrap gap-2">
              {languages.map((lang) => (
                <button
                  key={lang}
                  type="button"
                  onClick={() => toggleSelection("languages", lang)}
                  className={`px-3 py-1 rounded-full text-sm transition-colors ${
                    formData.languages.includes(lang)
                      ? "bg-green-600 text-white"
                      : "bg-gray-700/50 text-gray-300 hover:bg-gray-600"
                  }`}
                >
                  {lang}
                </button>
              ))}
            </div>
            {errors.languages && (
              <p className="mt-1 text-sm text-red-500">{errors.languages}</p>
            )}
          </div>

          {/* Rating and Censor Rating */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-200 mb-2">
                Rating
              </label>
              <input
                type="number"
                min="1"
                max="5"
                step="0.1"
                value={formData.rating}
                onChange={(e) => {
                  const value = parseFloat(e.target.value);
                  setFormData({
                    ...formData,
                    rating: isNaN(value) ? 0 : value,
                  });
                }}
                className="w-full px-4 py-2 bg-gray-700/50 text-white rounded-lg border border-gray-600 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none"
              />
              {errors.rating && (
                <p className="mt-1 text-sm text-red-500">{errors.rating}</p>
              )}
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-200 mb-2">
                Censor Rating
              </label>
              <select
                value={formData.censor}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    censor: e.target.value as "U" | "U/A" | "A",
                  })
                }
                className="w-full px-4 py-2 bg-gray-700/50 text-white rounded-lg border border-gray-600 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none"
              >
                {censorRatings.map((rating) => (
                  <option key={rating} value={rating}>
                    {rating}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* Right Column */}
        <div className="space-y-6">
          {/* Movie Poster */}
          <div>
            <label className="block text-sm font-medium text-gray-200 mb-2">
              Movie Poster
            </label>
            <div className="relative aspect-[2/3] rounded-lg overflow-hidden bg-gray-700/50 border-2 border-dashed border-gray-600 hover:border-blue-500 transition-colors">
              {imagePreview ? (
                <div className="relative w-full h-full group">
                  <Image
                    src={imagePreview}
                    alt="Movie poster preview"
                    fill
                    className="object-cover"
                  />
                  <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                    <button
                      type="button"
                      onClick={() => {
                        setImagePreview("");
                        setSelectedImage(null);
                        if (fileInputRef.current) {
                          fileInputRef.current.value = "";
                        }
                      }}
                      className="p-2 bg-red-600 rounded-full hover:bg-red-700 transition-colors"
                    >
                      <X className="w-5 h-5 text-white" />
                    </button>
                  </div>
                </div>
              ) : (
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className="absolute inset-0 flex flex-col items-center justify-center text-gray-400 hover:text-blue-500 transition-colors"
                >
                  <Upload className="w-8 h-8 mb-2" />
                  <span className="text-sm">Click to upload poster</span>
                  <span className="text-xs mt-1">Max size: 5MB</span>
                </button>
              )}
            </div>
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              onChange={handleImageChange}
              className="hidden"
            />
            {errors.poster && (
              <p className="mt-1 text-sm text-red-500">{errors.poster}</p>
            )}
          </div>

          {/* Review */}
          <div>
            <label className="block text-sm font-medium text-gray-200 mb-2">
              Review
            </label>
            <textarea
              value={formData.review}
              onChange={(e) =>
                setFormData({ ...formData, review: e.target.value })
              }
              rows={8}
              className="w-full px-4 py-2 bg-gray-700/50 text-white rounded-lg border border-gray-600 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none resize-none"
              placeholder="Write your review..."
            />
            {errors.review && (
              <p className="mt-1 text-sm text-red-500">{errors.review}</p>
            )}
          </div>
        </div>
      </div>

      {/* Submit Button */}
      <div className="flex justify-end">
        <button
          type="submit"
          disabled={isLoading}
          className="inline-flex items-center px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          {isLoading ? (
            <>
              <svg
                className="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
                fill="none"
                viewBox="0 0 24 24"
              >
                <circle
                  className="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="4"
                />
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                />
              </svg>
              Saving...
            </>
          ) : (
            "Save Movie"
          )}
        </button>
      </div>
    </form>
  );
}
