import axios from 'axios';
import { TMDB_API_KEY, TMDB_BASE_URL } from './config';

const api = axios.create({
  baseURL: TMDB_BASE_URL,
  params: {
    api_key: TMDB_API_KEY,
  },
});

export const searchMovies = async (query, page = 1) => {
  try {
    const response = await api.get('/search/movie', {
      params: {
        query,
        page,
      },
    });
    return response.data;
  } catch (error) {
    console.error('Error searching movies:', error);
    return { results: [], total_pages: 0, total_results: 0, page: 1 };
  }
};

export const getTrendingMovies = async (page = 1) => {
  try {
    const response = await api.get('/movie/now_playing', {
      params: {
        page,
        region: 'US',
      },
    });
    return response.data;
  } catch (error) {
    console.error('Error fetching trending movies:', error);
    return { results: [], total_pages: 0, total_results: 0, page: 1 };
  }
};

export const getMovieDetails = async (movieId) => {
  try {
    const [details, videos, credits, reviews, similar] = await Promise.all([
      api.get(`/movie/${movieId}?append_to_response=videos`),
      api.get(`/movie/${movieId}/videos`),
      api.get(`/movie/${movieId}/credits`),
      api.get(`/movie/${movieId}/reviews`),
      api.get(`/movie/${movieId}/similar`),
    ]);

    return {
      ...details.data,
      videos: videos.data.results,
      credits: credits.data,
      reviews: reviews.data.results,
      similar: similar.data.results,
    };
  } catch (error) {
    console.error('Error fetching movie details:', error);
    throw error;
  }
};