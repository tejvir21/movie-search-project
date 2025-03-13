import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Search, Film, Popcorn } from 'lucide-react';
import { searchMovies, getTrendingMovies } from './api';
import MovieCard from './components/MovieCard';
import MovieModal from './components/MovieModal';
import MovieDetails from './pages/MovieDetails';
import Loader from './components/Loader';

function HomePage() {
  const [query, setQuery] = useState('');
  const [movies, setMovies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const [selectedMovie, setSelectedMovie] = useState(null);

  const handleSearch = async (searchQuery, pageNum = 1) => {
    if (!searchQuery.trim()) {
      loadTrendingMovies(1);
      return;
    }

    setLoading(true);
    try {
      const data = await searchMovies(searchQuery, pageNum);
      if (pageNum === 1) {
        setMovies(data.results);
      } else {
        setMovies(prev => [...prev, ...data.results]);
      }
      setTotalPages(data.total_pages);
    } catch (error) {
      console.error('Error fetching movies:', error);
    } finally {
      setLoading(false);
    }
  };

  const loadTrendingMovies = async (pageNum = 1) => {
    setLoading(true);
    try {
      const data = await getTrendingMovies(pageNum);
      if (pageNum === 1) {
        setMovies(data.results);
      } else {
        setMovies(prev => [...prev, ...data.results]);
      }
      setTotalPages(data.total_pages);
    } catch (error) {
      console.error('Error fetching trending movies:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      handleSearch(query);
      setPage(1);
    }, 500);

    return () => clearTimeout(timeoutId);
  }, [query]);

  useEffect(() => {
    loadTrendingMovies();
  }, []);

  const loadMore = () => {
    const nextPage = page + 1;
    if (nextPage <= totalPages) {
      setPage(nextPage);
      if (query.trim()) {
        handleSearch(query, nextPage);
      } else {
        loadTrendingMovies(nextPage);
      }
    }
  };

  return (
    <>
      {loading && <Loader />}
      <div className="min-h-screen bg-gradient-to-b from-gray-900 to-gray-800">
        <div className="container mx-auto px-4 py-8">
          <div className="text-center mb-12">
            <div className="flex items-center justify-center gap-3 mb-4">
              <Film className="w-12 h-12 text-blue-400" />
              <h1 className="text-5xl font-bold text-white">
                Movie<span className="text-blue-400">Verse</span>
              </h1>
            </div>
            <p className="text-gray-300 text-lg max-w-2xl mx-auto">
              Discover the latest blockbusters, search your favorite films, and explore the world of cinema
            </p>
          </div>
          
          <div className="relative max-w-2xl mx-auto mb-12">
            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-6 h-6" />
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search for movies..."
              className="w-full pl-14 pr-4 py-4 rounded-xl border-2 border-gray-700 bg-gray-800 text-white placeholder-gray-400 focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50 text-lg"
            />
          </div>

          {!query && !loading && (
            <div className="flex items-center gap-2 mb-8">
              <Popcorn className="w-6 h-6 text-blue-400" />
              <h2 className="text-2xl font-semibold text-white">Now Playing</h2>
            </div>
          )}

          {!loading && movies.length === 0 && (
            <div className="text-center text-gray-300 py-12">
              No movies found. Try a different search term.
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
            {movies.map(movie => (
              <MovieCard 
                key={movie.id} 
                movie={movie} 
                onClick={() => setSelectedMovie(movie)}
              />
            ))}
          </div>

          {movies.length > 0 && page < totalPages && (
            <div className="text-center mt-12">
              <button
                onClick={loadMore}
                disabled={loading}
                className="bg-blue-500 hover:bg-blue-600 text-white px-8 py-3 rounded-xl font-medium disabled:opacity-50 transition-colors duration-200"
              >
                {loading ? 'Loading...' : 'Load More Movies'}
              </button>
            </div>
          )}

          {selectedMovie && (
            <MovieModal 
              movie={selectedMovie} 
              onClose={() => setSelectedMovie(null)} 
            />
          )}
        </div>
      </div>
    </>
  );
}

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/movie/:id" element={<MovieDetails />} />
      </Routes>
    </Router>
  );
}

export default App;