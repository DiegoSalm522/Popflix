import { createContext, useContext, useEffect, useState } from "react"
import { 
  fetchGenres, 
  fetchPopularContent, 
  fetchTopRatedContent, 
  fetchTrendingContent 
} from "../services/api";

const Context = createContext();

export const useMoviesShows = () => useContext(Context);

export const MoviesShowsProvider = ({children}) => {
  const [trendingContent, setTrendingContent] = useState([]);
  const [popularContent, setPopularContent] = useState([]);
  const [topRatedContent, setTopRatedContent] = useState([]);
  const [genres, setGenres] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedContent, setSelectedContent] = useState(null);
  const [watchList, setWatchList] = useState([]);
  const [isInitialLoad, setIsInitialLoad] = useState(true);

  useEffect(() => {
    const savedWatchList = localStorage.getItem('watchList');
    if (savedWatchList) {
      try {
        const parsed = JSON.parse(savedWatchList);
        setWatchList(parsed);
      } catch (error) {
        console.error("Error loading watch list:", error);
        setWatchList([]);
      }
    }
    setIsInitialLoad(false);
  }, []);

  useEffect(() => {
    if (!isInitialLoad) {
      localStorage.setItem('watchList', JSON.stringify(watchList));
    }
  }, [watchList, isInitialLoad]);

  useEffect(() => {
    const fetchContentData = async() => {
      try{
        setLoading(true);
        const [trending, popular, topRated, genreList] = await Promise.all([
          fetchTrendingContent(),
          fetchPopularContent(),
          fetchTopRatedContent(),
          fetchGenres(),
        ]);
        setTrendingContent(trending);
        setPopularContent(popular);
        setTopRatedContent(topRated);
        setGenres(genreList);
      }
      catch(err){
        console.log("Error Fetching Content Data", err);
        setError(err);
      }
      finally{
        setLoading(false);
      }
    }
    fetchContentData();
  },[])

  const openContentDetails = (contentId, mediaType) => {
    setSelectedContent({id: contentId, mediaType: mediaType});
    document.body.style.overflow = "hidden";
  }

  const closeContentDetails = () => {
    setSelectedContent(null);
    document.body.style.overflow = "auto";
  }

  const addToWatchList = (item) => {
    setWatchList(prev => {
      const isAlreadyInList = prev.some(
        content => content.id === item.id && content.media_type === item.media_type
      );
      if (isAlreadyInList) {
        return prev;
      }
      return [...prev, item];
    });
  }

  const removeFromWatchList = (itemId, mediaType) => {
    setWatchList(prev => 
      prev.filter(item => !(item.id === itemId && item.media_type === mediaType))
    );
  }

  const isInWatchList = (itemId, mediaType) => {
    return watchList.some(
      item => item.id === itemId && item.media_type === mediaType
    );
  }

  return (
    <Context.Provider
      value={{
        trendingContent,
        popularContent,
        topRatedContent,
        genres, 
        loading, 
        error, 
        selectedContent,
        watchList,
        openContentDetails,
        closeContentDetails,
        addToWatchList,
        removeFromWatchList,
        isInWatchList
      }}
    >
      {children}
    </Context.Provider>
  )
}