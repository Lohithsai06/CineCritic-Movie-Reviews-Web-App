"use client";

import { useState } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, Filter, UserCog, Menu, X as XIcon, LayoutGrid, PlusCircle, LogOut } from 'lucide-react';
import { useMovieContext } from '@/context/MovieContext';
import { useAuth } from '@/lib/useAuth';
import { usePathname } from 'next/navigation';

const navVariants = {
  hidden: { y: -20, opacity: 0 },
  visible: { y: 0, opacity: 1 }
};

const linkVariants = {
  hover: { scale: 1.05 }
};

const genres: string[] = [
  "Action",
  "Comedy",
  "Drama",
  "Horror",
  "Thriller",
  "Romance",
  "Sci-Fi",
  "Documentary"
];

const languages: string[] = [
  "English",
  "Spanish",
  "French",
  "German",
  "Hindi",
  "Japanese",
  "Korean",
  "Chinese"
];

const Navbar = () => {
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { searchQuery, setSearchQuery, filters, setFilters } = useMovieContext();
  const { user, logout } = useAuth();
  const pathname = usePathname();

  const navigationItems = [
    { href: "/", label: "Home" },
  ];

  const adminNavigationItems = [
    { href: "/admin/dashboard", label: "Dashboard", icon: LayoutGrid },
    { href: "/admin/add-movie", label: "Add Movie", icon: PlusCircle },
  ];

  const isActive = (path: string) => pathname === path;

  return (
    <>
      <motion.nav
        initial="hidden"
        animate="visible"
        variants={navVariants}
        transition={{ duration: 0.5 }}
        className="bg-[#0a0d14] border-b border-gray-800 fixed top-0 left-0 right-0 z-20"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            {/* Logo */}
            <div className="flex items-center">
              <Link href="/" className="flex items-center space-x-2">
                <span className="text-2xl">🎬</span>
                <motion.span 
                  whileHover="hover"
                  variants={linkVariants}
                  className="text-xl font-bold text-white"
                >
                  CineCritic
                </motion.span>
              </Link>
            </div>

            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center space-x-8">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type="text"
                  placeholder="Search movies..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-64 pl-10 pr-4 py-2 bg-gray-800 text-white rounded-lg border border-gray-700 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none"
                />
              </div>

              <button
                onClick={() => setIsFilterOpen(!isFilterOpen)}
                className={`p-2 text-white hover:text-gray-300 ${isFilterOpen ? 'text-blue-500' : ''}`}
              >
                <Filter className="w-5 h-5" />
              </button>

              {navigationItems.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`text-gray-300 hover:text-white transition-colors ${
                    isActive(item.href) ? 'text-white font-medium' : ''
                  }`}
                >
                  {item.label}
                </Link>
              ))}

              {user ? (
                <>
                  {adminNavigationItems.map((item) => (
                    <Link
                      key={item.href}
                      href={item.href}
                      className={`flex items-center space-x-2 ${
                        isActive(item.href)
                          ? 'text-white'
                          : 'text-gray-300 hover:text-white'
                      }`}
                    >
                      <item.icon className="w-5 h-5" />
                      <span>{item.label}</span>
                    </Link>
                  ))}
                  <button
                    onClick={logout}
                    className="flex items-center space-x-2 text-gray-300 hover:text-white"
                  >
                    <LogOut className="w-5 h-5" />
                    <span>Logout</span>
                  </button>
                </>
              ) : (
                <Link
                  href="/admin/login"
                  className="flex items-center space-x-2 text-gray-300 hover:text-white"
                >
                  <UserCog className="w-5 h-5" />
                  <span>Admin Login</span>
                </Link>
              )}
            </div>

            {/* Mobile Menu Button */}
            <div className="flex md:hidden items-center space-x-4">
              <button
                onClick={() => setIsFilterOpen(!isFilterOpen)}
                className={`p-2 text-white hover:text-gray-300 ${isFilterOpen ? 'text-blue-500' : ''}`}
              >
                <Filter className="w-5 h-5" />
              </button>
              <button
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                className="p-2 text-white"
              >
                {isMobileMenuOpen ? (
                  <XIcon className="w-6 h-6" />
                ) : (
                  <Menu className="w-6 h-6" />
                )}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Menu */}
        <AnimatePresence>
          {isMobileMenuOpen && (
            <>
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40"
                onClick={() => setIsMobileMenuOpen(false)}
              />
              <motion.div
                initial={{ x: "100%" }}
                animate={{ x: 0 }}
                exit={{ x: "100%" }}
                transition={{ type: "spring", damping: 20, stiffness: 300 }}
                className="fixed right-0 top-0 h-[100dvh] w-80 bg-[#0a0d14] border-l border-gray-800 shadow-xl z-50"
              >
                <div className="flex flex-col h-full">
                  <div className="flex justify-between items-center p-4 border-b border-gray-800">
                    <h2 className="text-xl font-semibold text-white">Menu</h2>
                    <button
                      onClick={() => setIsMobileMenuOpen(false)}
                      className="p-2 text-gray-400 hover:text-white"
                    >
                      <XIcon className="w-6 h-6" />
                    </button>
                  </div>

                  <div className="p-4 border-b border-gray-800">
                    <div className="relative">
                      <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
                      <input
                        type="text"
                        placeholder="Search movies..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="w-full pl-10 pr-4 py-2 bg-gray-800 text-white rounded-lg border border-gray-700 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none"
                      />
                    </div>
                  </div>

                  <div className="flex-1 overflow-y-auto p-4">
                    <nav className="space-y-2">
                      {navigationItems.map((item) => (
                        <Link
                          key={item.href}
                          href={item.href}
                          className={`block px-3 py-2 rounded-lg text-base font-medium transition-colors ${
                            isActive(item.href)
                              ? 'bg-blue-600 text-white'
                              : 'text-gray-300 hover:text-white hover:bg-gray-800/50'
                          }`}
                          onClick={() => setIsMobileMenuOpen(false)}
                        >
                          {item.label}
                        </Link>
                      ))}
                      
                      {user && (
                        <>
                          <div className="my-4 border-t border-gray-800" />
                          {adminNavigationItems.map((item) => (
                            <Link
                              key={item.href}
                              href={item.href}
                              className={`flex items-center px-3 py-2 rounded-lg text-base font-medium transition-colors ${
                                isActive(item.href)
                                  ? 'bg-blue-600 text-white'
                                  : 'text-gray-300 hover:text-white hover:bg-gray-800/50'
                              }`}
                              onClick={() => setIsMobileMenuOpen(false)}
                            >
                              <item.icon className="w-5 h-5 mr-3" />
                              <span>{item.label}</span>
                            </Link>
                          ))}
                        </>
                      )}
                    </nav>
                  </div>

                  <div className="p-4 border-t border-gray-800">
                    {user ? (
                      <button
                        onClick={() => {
                          logout();
                          setIsMobileMenuOpen(false);
                        }}
                        className="flex items-center w-full px-3 py-2 text-gray-300 hover:text-white hover:bg-gray-800/50 rounded-lg transition-colors"
                      >
                        <LogOut className="w-5 h-5 mr-3" />
                        <span>Logout</span>
                      </button>
                    ) : (
                      <Link
                        href="/admin/login"
                        className="flex items-center w-full px-3 py-2 text-gray-300 hover:text-white hover:bg-gray-800/50 rounded-lg transition-colors"
                        onClick={() => setIsMobileMenuOpen(false)}
                      >
                        <UserCog className="w-5 h-5 mr-3" />
                        <span>Admin Login</span>
                      </Link>
                    )}
                  </div>
                </div>
              </motion.div>
            </>
          )}
        </AnimatePresence>

        {/* Filter Dropdown */}
        <AnimatePresence>
          {isFilterOpen && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ type: "spring", stiffness: 300, damping: 30 }}
              className="absolute left-0 right-0 mt-1 bg-gray-800 border-b border-gray-700 shadow-xl z-30"
            >
              <div className="container mx-auto p-6 grid grid-cols-1 md:grid-cols-3 gap-6">
                {/* Genres */}
                <div>
                  <h3 className="font-semibold mb-3 text-white">Genres</h3>
                  <div className="flex flex-wrap gap-2">
                    {genres.map((genre) => (
                      <button
                        key={genre}
                        onClick={() => {
                          const newGenres = filters.genres.includes(genre)
                            ? filters.genres.filter(g => g !== genre)
                            : [...filters.genres, genre];
                          setFilters({ ...filters, genres: newGenres });
                        }}
                        className={`px-3 py-1 rounded-full text-sm ${
                          filters.genres.includes(genre)
                            ? 'bg-blue-600 text-white'
                            : 'bg-gray-700 text-white hover:bg-gray-600'
                        }`}
                      >
                        {genre}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Rating Range */}
                <div>
                  <h3 className="font-semibold mb-3 text-white">Rating Range</h3>
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm text-white mb-1">Min Rating</label>
                      <input
                        type="range"
                        min="0"
                        max="5"
                        step="0.5"
                        value={filters.minRating}
                        onChange={(e) => setFilters({
                          ...filters,
                          minRating: parseFloat(e.target.value)
                        })}
                        className="w-full accent-blue-600"
                      />
                      <span className="text-sm text-white">{filters.minRating}</span>
                    </div>
                    <div>
                      <label className="block text-sm text-white mb-1">Max Rating</label>
                      <input
                        type="range"
                        min="0"
                        max="5"
                        step="0.5"
                        value={filters.maxRating}
                        onChange={(e) => setFilters({
                          ...filters,
                          maxRating: parseFloat(e.target.value)
                        })}
                        className="w-full accent-blue-600"
                      />
                      <span className="text-sm text-white">{filters.maxRating}</span>
                    </div>
                  </div>
                </div>

                {/* Languages */}
                <div>
                  <h3 className="font-semibold mb-3 text-white">Languages</h3>
                  <div className="flex flex-wrap gap-2">
                    {languages.map((lang) => (
                      <button
                        key={lang}
                        onClick={() => {
                          const newLanguages = filters.languages.includes(lang)
                            ? filters.languages.filter(l => l !== lang)
                            : [...filters.languages, lang];
                          setFilters({ ...filters, languages: newLanguages });
                        }}
                        className={`px-3 py-1 rounded-full text-sm ${
                          filters.languages.includes(lang)
                            ? 'bg-green-600 text-white'
                            : 'bg-gray-700 text-white hover:bg-gray-600'
                        }`}
                      >
                        {lang}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.nav>

      {/* Mobile Menu Overlay */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40"
              onClick={() => setIsMobileMenuOpen(false)}
            />
            <motion.div
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "spring", damping: 20, stiffness: 300 }}
              className="fixed right-0 top-0 h-[100dvh] w-80 bg-[#0a0d14] border-l border-gray-800 shadow-xl z-50"
            >
              <div className="flex flex-col h-full">
                <div className="flex justify-between items-center p-4 border-b border-gray-800">
                  <h2 className="text-xl font-semibold text-white">Menu</h2>
                  <button
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="p-2 text-gray-400 hover:text-white transition-colors"
                  >
                    <XIcon className="w-6 h-6" />
                  </button>
                </div>

                <div className="p-4 border-b border-gray-800">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
                    <input
                      type="text"
                      placeholder="Search movies..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="w-full pl-10 pr-4 py-2 bg-gray-800 text-white rounded-lg border border-gray-700 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none"
                    />
                  </div>
                </div>

                <div className="flex-1 overflow-y-auto p-4">
                  <nav className="space-y-2">
                    {navigationItems.map((item) => (
                      <Link
                        key={item.href}
                        href={item.href}
                        className={`block px-3 py-2 rounded-lg text-base font-medium transition-colors ${
                          isActive(item.href)
                            ? 'bg-blue-600 text-white'
                            : 'text-gray-300 hover:text-white hover:bg-gray-800/50'
                        }`}
                        onClick={() => setIsMobileMenuOpen(false)}
                      >
                        {item.label}
                      </Link>
                    ))}
                    
                    {user && (
                      <>
                        <div className="my-4 border-t border-gray-800" />
                        {adminNavigationItems.map((item) => (
                          <Link
                            key={item.href}
                            href={item.href}
                            className={`flex items-center px-3 py-2 rounded-lg text-base font-medium transition-colors ${
                              isActive(item.href)
                                ? 'bg-blue-600 text-white'
                                : 'text-gray-300 hover:text-white hover:bg-gray-800/50'
                            }`}
                            onClick={() => setIsMobileMenuOpen(false)}
                          >
                            <item.icon className="w-5 h-5 mr-3" />
                            <span>{item.label}</span>
                          </Link>
                        ))}
                      </>
                    )}
                  </nav>
                </div>

                <div className="p-4 border-t border-gray-800">
                  {user ? (
                    <button
                      onClick={() => {
                        logout();
                        setIsMobileMenuOpen(false);
                      }}
                      className="flex items-center w-full px-3 py-2 text-gray-300 hover:text-white hover:bg-gray-800/50 rounded-lg transition-colors"
                    >
                      <LogOut className="w-5 h-5 mr-3" />
                      <span>Logout</span>
                    </button>
                  ) : (
                    <Link
                      href="/admin/login"
                      className="flex items-center w-full px-3 py-2 text-gray-300 hover:text-white hover:bg-gray-800/50 rounded-lg transition-colors"
                      onClick={() => setIsMobileMenuOpen(false)}
                    >
                      <UserCog className="w-5 h-5 mr-3" />
                      <span>Admin Login</span>
                    </Link>
                  )}
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      <style jsx>{`
        .tooltip-wrapper {
          position: relative;
        }
        .tooltip {
          position: absolute;
          top: 100%;
          right: 0;
          background: #1f2937;
          padding: 4px 8px;
          border-radius: 4px;
          font-size: 12px;
          white-space: nowrap;
          opacity: 0;
          visibility: hidden;
          transition: all 0.2s;
          margin-top: 8px;
          color: white;
        }
        .tooltip-wrapper:hover .tooltip {
          opacity: 1;
          visibility: visible;
        }
      `}</style>
    </>
  );
};

export default Navbar;