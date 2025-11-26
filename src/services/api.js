const API_KEY = import.meta.env.VITE_TMDB_API_KEY;
const BASE_URL = "https://api.themoviedb.org/3"

export const fetchTrendingContent = async() => {
  try{
    const response = await fetch(
      `${BASE_URL}/trending/all/day?api_key=${API_KEY}&language=en-US`
    );
    const data = await response.json();
    return data.results.filter(item => 
      item.media_type === "movie" || item.media_type === "tv"
    );
  }
  catch(error){
    console.error("Error Fetching Trending Content", error);
    return [];
  }
}

export const fetchPopularContent = async() => {
  try{
    const [moviesResponse, tvResponse] = await Promise.all([
      fetch(`${BASE_URL}/movie/popular?api_key=${API_KEY}&language=en-US&page=1`),
      fetch(`${BASE_URL}/tv/popular?api_key=${API_KEY}&language=en-US&page=1`)
    ]);  
    const moviesData = await moviesResponse.json();
    const tvData = await tvResponse.json();
    const movies = moviesData.results.map(item => ({...item, media_type: "movie"}));
    const tvShows = tvData.results.map(item => ({...item, media_type: "tv"}));
    return [...movies, ...tvShows]
      .sort((a, b) => b.popularity - a.popularity)
  }
  catch(error){
    console.error("Error Fetching Popular Content", error);
    return [];
  }
}

export const fetchTopRatedContent = async() => {
  try{
    const [moviesResponse, tvResponse] = await Promise.all([
      fetch(`${BASE_URL}/movie/top_rated?api_key=${API_KEY}&language=en-US&page=1`),
      fetch(`${BASE_URL}/tv/top_rated?api_key=${API_KEY}&language=en-US&page=1`)
    ]);
    const moviesData = await moviesResponse.json();
    const tvData = await tvResponse.json();
    const movies = moviesData.results.map(item => ({...item, media_type: "movie"}));
    const tvShows = tvData.results.map(item => ({...item, media_type: "tv"}));
    return [...movies, ...tvShows]
      .sort((a, b) => b.vote_average - a.vote_average)
  }
  catch(error){
    console.error("Error Fetching Top Rated Content", error);
    return [];
  }
}

export const fetchContentByGenre = async(genreId, itemsToFetch = 180) => {
  try{
    const pagesNeeded = Math.ceil(itemsToFetch / 20);
    const movieRequests = [];
    const tvRequests = [];
    for (let page = 1; page <= pagesNeeded; page++) {
      movieRequests.push(
        fetch(`${BASE_URL}/discover/movie?api_key=${API_KEY}&language=en-US&with_genres=${genreId}&page=${page}`)
      );
      tvRequests.push(
        fetch(`${BASE_URL}/discover/tv?api_key=${API_KEY}&language=en-US&with_genres=${genreId}&page=${page}`)
      );
    }
    const [movieResponses, tvResponses] = await Promise.all([
      Promise.all(movieRequests),
      Promise.all(tvRequests)
    ]);
    const movieDataArray = await Promise.all(movieResponses.map(res => res.json()));
    const tvDataArray = await Promise.all(tvResponses.map(res => res.json()));
    const allMovies = movieDataArray.flatMap(data => 
      data.results.map(item => ({...item, media_type: "movie"}))
    );
    const allTvShows = tvDataArray.flatMap(data => 
      data.results.map(item => ({...item, media_type: "tv"}))
    );
    return [...allMovies, ...allTvShows]
      .sort((a, b) => b.popularity - a.popularity)
      .slice(0, itemsToFetch);
  }
  catch(error){
    console.error("Error Fetching Content by Genre", error);
    return [];
  }
}

export const fetchGenres = async() => {
  try{
    const [movieGenresResponse, tvGenresResponse] = await Promise.all([
      fetch(`${BASE_URL}/genre/movie/list?api_key=${API_KEY}&language=en-US`),
      fetch(`${BASE_URL}/genre/tv/list?api_key=${API_KEY}&language=en-US`)
    ]);
    const movieData = await movieGenresResponse.json();
    const tvData = await tvGenresResponse.json();
    const allGenres = [...movieData.genres, ...tvData.genres];
    const uniqueGenres = allGenres.filter((genre, index, self) =>
      index === self.findIndex((g) => g.id === genre.id)
    );
    return uniqueGenres.sort((a, b) => a.name.localeCompare(b.name));
  }
  catch(error){
    console.error("Error Fetching Genres", error);
    return [];
  }
}

export const fetchContentDetails = async(contentId, mediaType) => {
  try{
    const response = await fetch(
      `${BASE_URL}/${mediaType}/${contentId}?api_key=${API_KEY}&language=en-US`
    );
    const data = await response.json();
    return {...data, media_type: mediaType};
  }
  catch(error){
    console.error("Error Fetching Content Details", error);
    return null;
  }
}

export const searchContent = async(query) => {
  try{
    const response = await fetch(
      `${BASE_URL}/search/multi?api_key=${API_KEY}&language=en-US&query=${query}&page=1&include_adult=false`
    );
    const data = await response.json();
    return data.results.filter(item => 
      item.media_type === "movie" || item.media_type === "tv"
    );
  }
  catch(error){
    console.error("Error Searching Content", error);
    return [];
  }
}

export const getTitle = (item) => {
  return item.title || item.name || "No Title";
}

export const getReleaseDate = (item) => {
  return item.release_date || item.first_air_date || "";
}

export const getYear = (item) => {
  const date = getReleaseDate(item);
  return date ? date.substring(0, 4) : "N/A";
}

export const getImageURL = (path, size = "original") => {
  if(!path){
    return "https://via.placeholder.com/400x600?text=No+Image+Available";
  }
  return `https://image.tmdb.org/t/p/${size}${path}`;
}