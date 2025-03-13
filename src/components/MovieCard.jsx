import React from 'react';
import { Star } from 'lucide-react';
import { TMDB_IMAGE_BASE_URL } from '../config';

const MovieCard = ({ movie, onClick }) => {
  if (!movie) return null;

  const posterUrl = movie.poster_path
    ? `${TMDB_IMAGE_BASE_URL}${movie.poster_path}`
    : 'https://images.unsplash.com/photo-1598899134739-24c46f58b8c0?w=500';

  const releaseYear = movie.release_date 
    ? new Date(movie.release_date).getFullYear() 
    : 'N/A';

  const rating = typeof movie.vote_average === 'number'
    ? movie.vote_average.toFixed(1)
    : 'N/A';

  return (
    <div 
      className="bg-white rounded-lg shadow-lg overflow-hidden transition-transform duration-300 hover:scale-105 cursor-pointer h-full flex flex-col"
      onClick={() => onClick(movie)}
    >
      <div className="relative pt-[150%]">
        <img
          src={posterUrl}
          alt={movie.title || 'Movie poster'}
          className="absolute inset-0 w-full h-full object-cover"
          loading="lazy"
        />
        <div className="absolute top-2 right-2 bg-black/50 px-2 py-1 rounded-full flex items-center gap-1">
          <Star className="w-4 h-4 text-yellow-400 fill-current" />
          <span className="text-white text-sm font-medium">{rating}</span>
        </div>
      </div>
      <div className="p-4 flex-1 flex flex-col">
        <h3 className="text-xl font-semibold mb-2 line-clamp-1">
          {movie.title || 'Untitled'}
        </h3>
        <p className="text-gray-600 text-sm mb-3 line-clamp-2 flex-1">
          {movie.overview || 'No description available'}
        </p>
        <div className="flex items-center justify-between mt-auto">
          <span className="text-sm text-gray-500">{releaseYear}</span>
          <span className="text-sm font-medium text-gray-700">
            {movie.original_language?.toUpperCase() || 'N/A'}
          </span>
        </div>
      </div>
    </div>
  );
};

export default MovieCard;