import React, { useEffect, useState } from 'react'
import { FaImdb, FaStar } from "react-icons/fa"
import { IoIosAddCircle } from "react-icons/io"
import { IoPlayCircle, IoWarningOutline } from "react-icons/io5"
import { MdClose, MdOutlineComputer, MdRemoveCircle } from "react-icons/md"
import { useMoviesShows } from "../context/Context"
import { fetchContentDetails, getImageURL, getTitle, getYear } from "../services/api"
import Alert from "./Alert";

const Details = () => {
  const { selectedContent, closeContentDetails, addToWatchList, removeFromWatchList, isInWatchList } = useMoviesShows();
  const [details, setDetails] = useState(null);
  const [trailer, setTrailer] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showAlert, setShowAlert] = useState(false);
  const [alertType, setAlertType] = useState("success");
  const [alertMessage, setAlertMessage] = useState("");

  useEffect(() => {
    const loadDetails = async () => {
      if (!selectedContent) return;
      setLoading(true);
      setError(null);
      try {
        const data = await fetchContentDetails(selectedContent.id, selectedContent.mediaType);
        setDetails(data);
        const API_KEY = import.meta.env.VITE_TMDB_API_KEY;
        const videoRes = await fetch(
          `https://api.themoviedb.org/3/${selectedContent.mediaType}/${selectedContent.id}/videos?api_key=${API_KEY}&language=en-US`
        );
        const videoData = await videoRes.json();
        const officialTrailer = videoData.results.find(
          v =>
            (v.type === "Trailer" || v.type === "Teaser") &&
            v.site === "YouTube"
        );
        setTrailer(officialTrailer || null);
      } catch (err) {
        setError(err.message || "Failed to load details");
      } finally {
        setLoading(false);
      }
    };
    loadDetails();
  }, [selectedContent]);

  if (!selectedContent) return null;

  const formatRuntime = (minutes) => {
    if (!minutes) return "N/A";
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return `${hours}h ${mins}m`;
  };

  const formatMoney = (amount) => {
    if (!amount || amount === 0) return "N/A";
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
    }).format(amount);
  };

  const formatRating = (rating) => {
    return (Math.round(rating * 10) / 10).toFixed(1);
  };

  const showAlertMessage = (type, message) => {
    setAlertType(type);
    setAlertMessage(message);
    setShowAlert(true);
    setTimeout(() => {
      setShowAlert(false);
    }, 5000);
  };

  const handleWatchListClick = () => {
    if (!details) return;
    if (isInWatchList(details.id, details.media_type)) {
      removeFromWatchList(details.id, details.media_type);
      showAlertMessage("success", "Removed from your watch list");
    } else {
      addToWatchList(details);
      showAlertMessage("success", "Added to your watch list");
    }
  };

  const handleBackdropClick = (e) => {
    if (e.target === e.currentTarget) {
      closeContentDetails();
    }
  };

  return (
    <div onClick={handleBackdropClick} className="fixed inset-0 z-80 flex items-center justify-center p-4 bg-neutral-900/95 backdrop-blur-sm overflow-auto">
      {showAlert && <Alert type={alertType} text={alertMessage} />}
      <div className="relative w-full max-w-5xl bg-neutral-950 rounded-lg shadow-xl max-h-[90vh] overflow-y-auto">
        {/* Close Button */}
        <button 
          onClick={closeContentDetails}
          className="absolute top-4 right-4 z-10 p-2 rounded-full bg-neutral-950 text-white hover:bg-neutral-800 border border-neutral-800 transition-all cursor-pointer"
        >
          <MdClose size={18}/>
        </button>
        {/* Loading */}
        {loading && (
          <div className="h-96 flex items-center justify-center">
            <div className="animate-pulse flex flex-col items-center">
              <div className="w-16 h-16 border-4 border-red-500 border-t-transparent rounded-full animate-spin"></div>
              <p className="mt-4 text-neutral-400">Loading details...</p>
            </div>
          </div>
        )}
        {/* Error */}
        {error && !loading && (
          <div className="h-96 flex items-center justify-center">
            <div className="text-center">
              <IoWarningOutline color="red" size={48} className="mx-auto"/>
              <h2 className="text-xl font-bold mt-4 text-white">
                Failed to load details
              </h2>
              <p className="mt-2 text-neutral-400">{error}</p>
              <button 
                onClick={closeContentDetails}
                className="mt-6 bg-red-600 hover:bg-red-700 text-white px-6 py-2 rounded-md cursor-pointer"
              >
                Close
              </button>
            </div>
          </div>
        )}
        {/* Content */}
        {!loading && !error && details && (
          <div>
            {/* Backdrop Header */}
            <div className="relative h-72 md:h-96 w-full">
              {details.backdrop_path ? (
                <img
                  src={getImageURL(details.backdrop_path, "original")}
                  alt={getTitle(details)}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full bg-neutral-950"/>
              )}
              <div className="absolute inset-0 bg-linear-to-t from-neutral-950 to-transparent"/>
            </div>
            <div className="p-6 md:p-8">
              <div className="md:flex gap-8 -mt-32 md:-mt-48 relative">
                {/* Poster */}
                <div className="w-32 md:w-64 shrink-0 mb-4 md:mb-0">
                  <div className="rounded-lg overflow-hidden shadow-lg border border-neutral-950">
                    {details.poster_path ? (
                      <img 
                        src={getImageURL(details.poster_path, "w500")} 
                        alt={getTitle(details)}
                        className="w-full h-auto"
                      />
                    ) : (
                      <div className="w-full aspect-2/3 bg-neutral-950 flex items-center justify-center text-neutral-400">
                        No Poster Available
                      </div>
                    )}
                  </div>
                </div>
                {/* Content Info */}
                <div className="flex-1">
                  <h1 className="text-3xl md:text-4xl font-bold text-white">
                    {getTitle(details)}
                    {getYear(details) && (
                      <span className="text-neutral-400 font-normal ml-2">
                        ({getYear(details)})
                      </span>
                    )}
                  </h1>
                  {/* Other info */}
                  <div className="flex flex-wrap gap-x-4 gap-y-2 mt-3 text-sm items-center">
                    {details.vote_average > 0 && (
                      <div className="flex items-center">
                        <FaStar color="yellow"/>
                        <span className="ml-1 font-medium text-white">
                          {formatRating(details.vote_average)}
                        </span>
                      </div>
                    )}
                    {details.runtime && (
                      <span className="text-neutral-300">
                        {formatRuntime(details.runtime)}
                      </span>
                    )}
                  </div>
                  {/* Genres */}
                  {details.genres && details.genres.length > 0 && (
                    <div className="mt-4 flex flex-wrap gap-2">
                      {details.genres.map((genre) => (
                        <span 
                          key={genre.id}
                          className="bg-neutral-700 text-neutral-300 px-3 py-1 rounded-full text-xs"
                        >
                          {genre.name}
                        </span>
                      ))}
                    </div>
                  )}
                  {/* Overview */}
                  <div className="mt-6">
                    <h2 className="text-xl font-semibold text-white mb-2">
                      Overview
                    </h2>
                    <p className="text-neutral-300">
                      {details.overview || "No overview available."}
                    </p>
                  </div>
                  {/* Button */}
                  <div className="mt-8 flex flex-wrap gap-3">
                    <button 
                      onClick={handleWatchListClick}
                      className="bg-neutral-900 border border-neutral-700 hover:-translate-y-1 text-white px-6 py-3 rounded-full flex items-center gap-2 transition-all cursor-pointer"
                    >
                      {isInWatchList(details.id, details.media_type) ? (
                        <>
                          <MdRemoveCircle size={22}/>
                          Remove from List
                        </>
                      ) : (
                        <>
                          <IoIosAddCircle size={22}/>
                          Add to WatchList
                        </>
                      )}
                    </button>
                  </div>
                </div>
              </div>
              {/* Trailer */}
                  {trailer && (
                    <div className="mt-10">
                      <div className="w-full aspect-video rounded-lg overflow-hidden border border-neutral-700">
                        <iframe
                          className="w-full h-full"
                          src={`https://www.youtube.com/embed/${trailer.key}`}
                          title="Trailer"
                          allowFullScreen
                        ></iframe>
                      </div>
                    </div>
                  )}
              {/* Additional Details */}
              <div className="mt-12 grid grid-cols-1 md:grid-cols-2 gap-8">
                {/* Left column */}
                <div>
                  <h2 className="text-xl font-semibold text-white mb-4">
                    Details
                  </h2>
                  <div className="space-y-4">
                    {details.production_companies?.length > 0 && (
                      <div>
                        <h3 className="text-neutral-400 text-sm mb-1">Production Companies</h3>
                        <p className="text-white">
                          {details.production_companies.map(c => c.name).join(', ')}
                        </p>
                      </div>
                    )}
                    {details.spoken_languages?.length > 0 && (
                      <div>
                        <h3 className="text-neutral-400 text-sm mb-1">Languages</h3>
                        <p className="text-white">
                          {details.spoken_languages.map(l => l.english_name).join(', ')}
                        </p>
                      </div>
                    )}
                    {details.budget > 0 && (
                      <div>
                        <h3 className="text-neutral-400 text-sm mb-1">Budget</h3>
                        <p className="text-white">{formatMoney(details.budget)}</p>
                      </div>
                    )}
                  </div>
                </div>
                {/* Right column */}
                <div>
                  <h2 className="text-xl font-semibold text-white mb-4">
                    Rating
                  </h2>
                  {details.vote_average > 0 ? (
                    <div className="flex items-center">
                      <div className="w-24 h-24 rounded-full border-4 border-red-500 flex items-center justify-center mr-4">
                        <span className="text-3xl font-bold text-white">
                          {formatRating(details.vote_average)}
                        </span>
                      </div>
                      <div>
                        <p className="text-neutral-300">
                          {details.vote_count?.toLocaleString()} votes
                        </p>
                        <div className="w-full bg-neutral-700 rounded-full h-2.5 mt-2">
                          <div 
                            className="bg-red-600 h-2.5 rounded-full"
                            style={{ width: `${(details.vote_average / 10) * 100}%` }}
                          />
                        </div>
                      </div>
                    </div>
                  ) : (
                    <p className="text-neutral-400">No rating available</p>
                  )}
                  {/* Links */}
                  <div className="mt-8 flex gap-4 flex-wrap font-bold">
                    {details.homepage && (
                      <a 
                        href={details.homepage} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="inline-flex items-center bg-neutral-700 hover:-translate-y-1 text-white px-5 py-2 rounded-full duration-200 cursor-pointer"
                      >
                        <MdOutlineComputer size={18} className="mr-2" />
                        Official Website
                      </a>
                    )}
                    <a 
                      href={`https://www.themoviedb.org/${selectedContent.mediaType}/${details.id}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center bg-cyan-600 hover:-translate-y-1 text-white px-5 py-2 rounded-full duration-200 cursor-pointer ml-4"
                    >
                      View on TMDB
                    </a>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default Details
