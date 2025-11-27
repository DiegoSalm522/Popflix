import React, { useState, useEffect, useMemo } from "react"
import { FaStar } from "react-icons/fa"
import { IoPlayCircle } from "react-icons/io5"
import { useMoviesShows } from "../context/Context"
import { fetchContentByGenre, getImageURL, getTitle, getYear } from "../services/api"
import { IoIosAddCircle } from "react-icons/io"
import { MdRemoveCircle } from "react-icons/md"
import Alert from "./Alert";

const Genres = ({ mediaType = "all" }) => {
  const { genres, loading: contextLoading, openContentDetails, addToWatchList, removeFromWatchList, isInWatchList } = useMoviesShows();
  const [selectedGenre, setSelectedGenre] = useState(null);
  const [genreContent, setGenreContent] = useState([]);
  const [loadingContent, setLoadingContent] = useState(false);
  const [availableGenres, setAvailableGenres] = useState([]);
  const [initialLoading, setInitialLoading] = useState(true);
  const [showAlert, setShowAlert] = useState(false);
  const [alertType, setAlertType] = useState("success");
  const [alertMessage, setAlertMessage] = useState("");

  useEffect(() => {
    const validateGenres = async () => {
      if (genres.length === 0) return;
      
      setInitialLoading(true);
      const genresWithContent = [];

      const validationPromises = genres.map(async (genre) => {
        try {
          const content = await fetchContentByGenre(genre.id, 1);
          let hasContent = false;
          if (mediaType === "movie") {
            hasContent = content.some(item => item.media_type === "movie");
          } else if (mediaType === "tv") {
            hasContent = content.some(item => item.media_type === "tv");
          } else {
            hasContent = content.length > 0;
          }
          return hasContent ? genre : null;
        } catch (error) {
          return null;
        }
      });

      const results = await Promise.all(validationPromises);
      const validGenres = results.filter(g => g !== null);
      
      setAvailableGenres(validGenres);
      
      if (validGenres.length > 0) {
        setSelectedGenre(validGenres[0].id);
      }
      
      setInitialLoading(false);
    };

    validateGenres();
  }, [genres, mediaType]);

  useEffect(() => {
    const loadGenreContent = async () => {
      if (!selectedGenre || initialLoading) return;
      setLoadingContent(true);
      try {
        const content = await fetchContentByGenre(selectedGenre);
        let filteredContent = content;
        if (mediaType === "movie") {
          filteredContent = content.filter(item => item.media_type === "movie");
        } else if (mediaType === "tv") {
          filteredContent = content.filter(item => item.media_type === "tv");
        }
        setGenreContent(filteredContent.slice(0, 30));
      } catch (error) {
        console.error("Error loading genre content:", error);
      } finally {
        setLoadingContent(false);
      }
    };
    loadGenreContent();
  }, [selectedGenre, mediaType, initialLoading]);

  const formatRating = (rating) => {
    return (Math.round(rating * 10) / 10).toFixed(1);
  };

  const handleGenreClick = (genreId) => {
    setSelectedGenre(genreId);
  };

  const showAlertMessage = (type, message) => {
    setAlertType(type);
    setAlertMessage(message);
    setShowAlert(true);
    setTimeout(() => {
      setShowAlert(false);
    }, 5000);
  };

  const handleWatchListClick = (e, item) => {
    e.stopPropagation();
    if (isInWatchList(item.id, item.media_type)) {
      removeFromWatchList(item.id, item.media_type);
      showAlertMessage("success", "Removed from your watch list");
    } else {
      addToWatchList(item);
      showAlertMessage("success", "Added to your watch list");
    }
  };

  const getSectionTitle = () => {
    switch(mediaType) {
      case "movie":
        return "Browse Movies by Genre";
      case "tv":
        return "Browse TV Shows by Genre";
      default:
        return "Browse by Genre";
    }
  };

  if (contextLoading || initialLoading) {
    return (
      <section className="py-12">
        <div className="mx-auto px-4 max-w-7xl">
          <h2 className="text-2xl md:text-3xl font-bold text-white mb-6">
            {getSectionTitle()}
          </h2>
          <div className="h-64 flex items-center justify-center">
            <div className="animate-pulse flex flex-col items-center">
              <div className="w-12 h-12 border-4 border-red-500 border-t-transparent rounded-full animate-spin"></div>
              <p className="mt-4 text-neutral-400">Loading genres...</p>
            </div>
          </div>
        </div>
      </section>
    );
  }

  if (availableGenres.length === 0) {
    return (
      <section className="py-12">
        <div className="mx-auto px-4 max-w-7xl">
          <h2 className="text-2xl md:text-3xl font-bold text-white mb-6">
            {getSectionTitle()}
          </h2>
          <div className="h-64 flex items-center justify-center">
            <p className="text-neutral-400 text-lg">
              No genres available for this content type
            </p>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="py-12">
      {showAlert && <Alert type={alertType} text={alertMessage} />}
      <div className="mx-auto px-4 max-w-7xl">
        <h2 className="text-2xl md:text-3xl font-bold text-white mb-6">
          {getSectionTitle()}
        </h2>
        {/* Genre Tabs */}
        <div className="mb-8 overflow-x-auto pb-2 scrollbar-hide">
          <div className="flex space-x-2 min-w-max">
            {availableGenres.map((genre) => (
              <button
                key={genre.id}
                onClick={() => handleGenreClick(genre.id)}
                className={`px-4 py-2 rounded-md transition-colors text-sm font-medium whitespace-nowrap cursor-pointer ${
                  selectedGenre === genre.id
                    ? "bg-red-500 text-white"
                    : "bg-neutral-800 text-neutral-300 hover:bg-neutral-700"
                }`}
              >
                {genre.name}
              </button>
            ))}
          </div>
        </div>
        {/* Loading State */}
        {loadingContent && (
          <div className="h-64 flex items-center justify-center">
            <div className="animate-pulse">
              <div className="w-12 h-12 border-4 border-red-500 border-t-transparent rounded-full animate-spin"></div>
            </div>
          </div>
        )}
        {/* Content Grid */}
        {!loadingContent && genreContent.length > 0 && (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-4 md:gap-6">
            {genreContent.map((item) => (
              <div key={`${item.id}-${item.media_type}`} className="group cursor-pointer">
                <div className="relative rounded-lg overflow-hidden bg-neutral-800">
                  <div className="aspect-2/3">
                    <img
                      src={getImageURL(item.poster_path, "w500")}
                      alt={getTitle(item)}
                      className="w-full h-full object-cover transition-all duration-300 group-hover:scale-110 group-hover:opacity-35"
                      loading="lazy"
                    />                    
                    {/* Hover Overlay */}
                    <div className="absolute inset-0 bg-linear-to-t from-neutral-900 to-transparent flex flex-col justify-end p-4 opacity-0 group-hover:opacity-100 transition-all duration-300">
                      <div className="transform translate-y-4 group-hover:translate-y-0 transition-transform duration-300 space-y-3">
                        <button 
                          onClick={() => openContentDetails(item.id, item.media_type)}
                          className="w-full bg-red-600 hover:-translate-y-1 duration-200 text-white py-3 rounded-full flex items-center justify-center gap-1 transition-all text-sm cursor-pointer">
                            <IoPlayCircle size={22}/>
                            Watch Now
                        </button>
                        <button 
                          onClick={(e) => handleWatchListClick(e, item)}
                          className="w-full bg-neutral-950 hover:-translate-y-1 duration-200 border border-neutral-800 text-white py-3 rounded-full flex items-center justify-center gap-1 transition-all text-sm cursor-pointer"
                        >
                          {isInWatchList(item.id, item.media_type) ? (
                            <>
                              <MdRemoveCircle size={22}/>
                              Remove from List
                            </>
                          ) : (
                            <>
                              <IoIosAddCircle size={22}/>
                              Add to Watch List
                            </>
                          )}
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
                {/* Content Info */}
                <div className="mt-3">
                  <h3 className="text-white text-sm font-medium truncate">
                    {getTitle(item)}
                  </h3>
                  <div className="flex items-center justify-between">
                    <span className="text-neutral-500 text-xs">
                      {getYear(item)}
                    </span>
                    <div className="flex items-center space-x-1">
                      <FaStar size={15} color="yellow" />
                      <span className="text-neutral-400 text-xs">
                        {formatRating(item.vote_average)}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  )
}

export default Genres