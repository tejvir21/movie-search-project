import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { Star, Clock, Calendar, DollarSign, ArrowLeft, Play, X } from 'lucide-react';
import { getMovieDetails } from '../api';
import { TMDB_IMAGE_BASE_URL } from '../config';
import Loader from '../components/Loader';

const MovieDetails = () => {
  const { id } = useParams();
  const [details, setDetails] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showTrailer, setShowTrailer] = useState(false);

  useEffect(() => {
    const fetchDetails = async () => {
      try {
        const data = await getMovieDetails(id);
        setDetails(data);
      } catch (error) {
        console.error('Error fetching movie details:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchDetails();
  }, [id]);

  if (loading) {
    return <Loader />;
  }

  if (!details) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-600">Movie not found</p>
      </div>
    );
  }

  const trailer = details.videos?.find(
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
    <div className="min-h-screen bg-gray-100">
      <div className="relative">
        <img
          src={`${TMDB_IMAGE_BASE_URL}${details.backdrop_path}`}
          alt={details.title}
          className="w-full lg:h-full md:h-[60vh] sm:h-[60vh] h-[60vh] object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black to-transparent"></div>
        <div className="absolute bottom-0 left-0 right-0 p-8">
          <div className="container mx-auto">
            <button
              onClick={() => window.history.back()}
              className="text-white mb-4 flex items-center gap-2 hover:text-gray-300"
            >
              <ArrowLeft className="w-5 h-5" />
              Back to Search
            </button>
            <h1 className="text-4xl font-bold text-white mb-2">{details.title}</h1>
            {details.tagline && (
              <p className="text-xl text-gray-300 italic">{details.tagline}</p>
            )}
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            <div className="bg-white rounded-lg shadow-lg p-6 mb-8">
              <div className="flex gap-4 mb-6">
                {trailer && (
                  <button
                    onClick={() => setShowTrailer(true)}
                    className="flex items-center gap-2 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
                  >
                    <Play className="w-5 h-5" />
                    Watch Trailer
                  </button>
                )}
                {details.homepage && (
                  <a
                    href={details.homepage}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                  >
                    Visit Website
                  </a>
                )}
              </div>

              <h2 className="text-2xl font-bold mb-4">Overview</h2>
              <p className="text-gray-700 leading-relaxed mb-6">{details.overview}</p>

              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                <div className="bg-gray-50 p-4 rounded-lg">
                  <div className="text-sm text-gray-500">Rating</div>
                  <div className="flex items-center gap-1 mt-1">
                    <Star className="w-5 h-5 text-yellow-500 fill-current" />
                    <span className="text-lg font-semibold">
                      {details.vote_average.toFixed(1)}
                    </span>
                  </div>
                </div>
                <div className="bg-gray-50 p-4 rounded-lg">
                  <div className="text-sm text-gray-500">Runtime</div>
                  <div className="flex items-center gap-1 mt-1">
                    <Clock className="w-5 h-5 text-gray-400" />
                    <span className="text-lg font-semibold">{details.runtime}min</span>
                  </div>
                </div>
                <div className="bg-gray-50 p-4 rounded-lg">
                  <div className="text-sm text-gray-500">Budget</div>
                  <div className="flex items-center gap-1 mt-1">
                    <DollarSign className="w-5 h-5 text-gray-400" />
                    <span className="text-lg font-semibold">
                      {formatCurrency(details.budget)}
                    </span>
                  </div>
                </div>
                <div className="bg-gray-50 p-4 rounded-lg">
                  <div className="text-sm text-gray-500">Release Date</div>
                  <div className="flex items-center gap-1 mt-1">
                    <Calendar className="w-5 h-5 text-gray-400" />
                    <span className="text-lg font-semibold">
                      {new Date(details.release_date).toLocaleDateString()}
                    </span>
                  </div>
                </div>
              </div>

              <div className="mb-6">
                <h2 className="text-2xl font-bold mb-4">Cast</h2>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  {details.credits.cast.slice(0, 8).map((person) => (
                    <div key={person.id} className="text-center">
                      <img
                        src={
                          person.profile_path
                            ? `${TMDB_IMAGE_BASE_URL}${person.profile_path}`
                            : 'https://via.placeholder.com/150'
                        }
                        alt={person.name}
                        className="w-full h-40 object-cover rounded-lg mb-2"
                      />
                      <div className="font-medium">{person.name}</div>
                      <div className="text-sm text-gray-500">{person.character}</div>
                    </div>
                  ))}
                </div>
              </div>

              {details.reviews.length > 0 && (
                <div className="mb-6">
                  <h2 className="text-2xl font-bold mb-4">Reviews</h2>
                  <div className="space-y-4">
                    {details.reviews.slice(0, 3).map((review) => (
                      <div key={review.id} className="bg-gray-50 p-4 rounded-lg">
                        <div className="flex items-center gap-2 mb-2">
                          <div className="font-medium">{review.author}</div>
                          <div className="text-gray-500">
                            {new Date(review.created_at).toLocaleDateString()}
                          </div>
                        </div>
                        <p className="text-gray-700 line-clamp-3">{review.content}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>

          <div>
            <div className="bg-white rounded-lg shadow-lg p-6 mb-8">
              <h2 className="text-2xl font-bold mb-4">Movie Info</h2>
              <div className="space-y-4">
                <div>
                  <h3 className="font-medium text-gray-500">Status</h3>
                  <div>{details.status}</div>
                </div>
                <div>
                  <h3 className="font-medium text-gray-500">Original Language</h3>
                  <div>{details.original_language.toUpperCase()}</div>
                </div>
                <div>
                  <h3 className="font-medium text-gray-500">Budget</h3>
                  <div>{formatCurrency(details.budget)}</div>
                </div>
                <div>
                  <h3 className="font-medium text-gray-500">Revenue</h3>
                  <div>{formatCurrency(details.revenue)}</div>
                </div>
              </div>
            </div>

            {details.similar.length > 0 && (
              <div className="bg-white rounded-lg shadow-lg p-6">
                <h2 className="text-2xl font-bold mb-4">Similar Movies</h2>
                <div className="space-y-4">
                  {details.similar.slice(0, 4).map((movie) => (
                    <a
                      key={movie.id}
                      href={`/movie/${movie.id}`}
                      className="flex gap-4 hover:bg-gray-50 p-2 rounded-lg"
                    >
                      <img
                        src={`${TMDB_IMAGE_BASE_URL}${movie.poster_path}`}
                        alt={movie.title}
                        className="w-20 h-30 object-cover rounded"
                      />
                      <div>
                        <div className="font-medium">{movie.title}</div>
                        <div className="text-sm text-gray-500">
                          {new Date(movie.release_date).getFullYear()}
                        </div>
                      </div>
                    </a>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {showTrailer && trailer && (
        <div className="fixed inset-0 bg-black bg-opacity-90 flex items-center justify-center z-50">
          <div className="relative w-full max-w-4xl mx-4">
            <button
              onClick={() => setShowTrailer(false)}
              className="absolute -top-12 right-0 text-white hover:text-gray-300"
            >
              <X className="w-8 h-8" />
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
  );
};

export default MovieDetails;