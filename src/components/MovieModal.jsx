import React, { useState, useEffect } from 'react';
import { Star, X, Play, ExternalLink, Clock, Calendar, DollarSign } from 'lucide-react';
import { TMDB_IMAGE_BASE_URL } from '../config';
import { getMovieDetails } from '../api';

const MovieModal = ({ movie, onClose }) => {
  const [details, setDetails] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showTrailer, setShowTrailer] = useState(false);

  useEffect(() => {
    const fetchDetails = async () => {
      try {
        const data = await getMovieDetails(movie.id);
        setDetails(data);
      } catch (error) {
        console.error('Error fetching movie details:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchDetails();
  }, [movie.id]);

  if (!movie) return null;

  const backdropUrl = movie.backdrop_path
    ? `${TMDB_IMAGE_BASE_URL}${movie.backdrop_path}`
    : (movie.poster_path
      ? `${TMDB_IMAGE_BASE_URL}${movie.poster_path}`
      : 'https://images.unsplash.com/photo-1598899134739-24c46f58b8c0?w=500');

  const rating = typeof movie.vote_average === 'number'
    ? movie.vote_average.toFixed(1)
    : 'N/A';

  const trailer = details?.videos?.find(
    (video) => video.type === 'Trailer' && video.site === 'YouTube'
  );

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      maximumFractionDigits: 0,
    }).format(amount);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center p-4 z-50 overflow-y-auto">
      <div className="bg-white rounded-lg max-w-4xl w-full my-auto relative">
        <button
          onClick={onClose}
          className="absolute -top-18 right-0 bg-red-500 hover:bg-red-600 text-white w-12 h-12 rounded-full flex items-center justify-center shadow-xl transition-all duration-200 focus:outline-none focus:ring-4 focus:ring-red-500 focus:ring-opacity-50 z-50"
          aria-label="Close modal"
        >
          <X className="w-6 h-6" strokeWidth={2.5} />
        </button>
        
        <div className="relative">
          <img
            src={backdropUrl}
            alt={movie.title}
            className="w-full h-full object-cover rounded-t-lg"
          />
        </div>
        
        <div className="p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-3xl font-bold">{movie.title}</h2>
            <div className="flex items-center gap-2 bg-yellow-100 px-3 py-1 rounded-full">
              <Star className="w-5 h-5 text-yellow-500 fill-current" />
              <span className="font-semibold">{rating}</span>
            </div>
          </div>

          {loading ? (
            <div className="flex justify-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
            </div>
          ) : (
            <>
              <div className="flex gap-4 mb-6">
                <button
                  onClick={() => setShowTrailer(true)}
                  disabled={!trailer}
                  className="flex items-center gap-2 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <Play className="w-5 h-5" />
                  Watch Trailer
                </button>
                <a
                  href={`/movie/${movie.id}`}
                  className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                >
                  <ExternalLink className="w-5 h-5" />
                  Read More
                </a>
              </div>

              <div className="grid gap-4 text-sm text-gray-600">
                <div className="flex items-center gap-2">
                  <Calendar className="w-4 h-4" />
                  <span className="font-semibold">Release Date:</span>
                  {new Date(details.release_date).toLocaleDateString()}
                </div>
                <div className="flex items-center gap-2">
                  <Clock className="w-4 h-4" />
                  <span className="font-semibold">Runtime:</span>
                  {details.runtime} minutes
                </div>
                <div className="flex items-center gap-2">
                  <DollarSign className="w-4 h-4" />
                  <span className="font-semibold">Budget:</span>
                  {formatCurrency(details.budget)}
                </div>
              </div>

              <div className="mt-4">
                <h3 className="text-lg font-semibold mb-2">Overview</h3>
                <p className="text-gray-700 leading-relaxed">
                  {details.overview}
                </p>
              </div>

              {details.genres && (
                <div className="mt-4">
                  <h3 className="text-lg font-semibold mb-2">Genres</h3>
                  <div className="flex flex-wrap gap-2">
                    {details.genres.map((genre) => (
                      <span
                        key={genre.id}
                        className="px-3 py-1 bg-gray-100 rounded-full text-sm"
                      >
                        {genre.name}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </>
          )}
        </div>

        {showTrailer && trailer && (
          <div className="fixed inset-0 bg-black bg-opacity-90 flex items-center justify-center z-[70]">
            <div className="relative w-full max-w-4xl mx-4">
              <button
                onClick={() => setShowTrailer(false)}
                className="absolute -top-16 right-0 bg-red-500 hover:bg-red-600 text-white w-12 h-12 rounded-full flex items-center justify-center shadow-xl transition-all duration-200 focus:outline-none focus:ring-4 focus:ring-red-500 focus:ring-opacity-50"
                aria-label="Close trailer"
              >
                <X className="w-6 h-6" strokeWidth={2.5} />
              </button>
              <div className="relative pt-[56.25%]">
                <iframe
                  className="absolute inset-0 w-full h-full"
                  src={`https://www.youtube.com/embed/${trailer.key}?autoplay=1&modestbranding=1&rel=0`}
                  title="Movie Trailer"
                  frameBorder="0"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                ></iframe>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default MovieModal;