import React, { useEffect, useState } from "react"
import { FaStar } from "react-icons/fa"
import { IoIosAddCircle } from "react-icons/io"
import { IoPlayCircle } from "react-icons/io5"
import { MdRemoveCircle } from "react-icons/md";
import { useMoviesShows } from "../context/Context";
import { getImageURL, getTitle, getYear } from "../services/api";
import Alert from "./Alert";

const Hero = ({content}) => {
  const {loading, openContentDetails, addToWatchList, removeFromWatchList, isInWatchList} = useMoviesShows();
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isTransitioning, setIsTransitioning] = useState(false);

  const [showAlert, setShowAlert] = useState(false);
  const [alertType, setAlertType] = useState("success");
  const [alertMessage, setAlertMessage] = useState("");

  const featuredContent = content.slice(0, 5);

  useEffect(() => {
    if (featuredContent.length === 0) return;
    const interval = setInterval(() => {
      setIsTransitioning(true);
      setTimeout(() => {
        setCurrentSlide((prev) => (prev + 1) % featuredContent.length);
        setIsTransitioning(false);
      }, 500);
    }, 5000);
    return () => clearInterval(interval);
  }, [loading, featuredContent.length])

  if (loading || featuredContent.length === 0){
    return(
      <div className="relative w-full h-screen flex items-center justify-center bg-neutral-950">
        <div className="animate-pulse flex flex-col items-center">
          <div className="w-16 h-16 border-4 border-red-500 border-t-transparent rounded-full animate-spin"></div>
          <p className="mt-4 text-neutral-400">Loading content.....</p>
        </div>
      </div>
    )
  }

  const currentContent = featuredContent[currentSlide];

  const formatRating = (rating) => {
    return (Math.round(rating*10)/10).toFixed(1);
  }

  const getMediaTypeLabel = (mediaType) => {
    return mediaType === "tv" ? "TV SERIES" : "MOVIE";
  }

  const showAlertMessage = (type, message) => {
    setAlertType(type);
    setAlertMessage(message);
    setShowAlert(true);
    setTimeout(() => {
      setShowAlert(false);
    }, 5000);
  };

  const handleWatchListClick = () => {
    if (isInWatchList(currentContent.id, currentContent.media_type)) {
      removeFromWatchList(currentContent.id, currentContent.media_type);
      showAlertMessage("success", "Removed from your watch list");
    } else {
      addToWatchList(currentContent);
      showAlertMessage("success", "Added to your watch list");
    }
  }

  return (
    <div className="relative w-full h-screen mb-8">
      {showAlert && <Alert type={alertType} text={alertMessage} />}
      {/* Movies Backdrop */}
      <div className={`absolute inset-0 bg-cover bg-center bg-neutral-800 transition-all duration-700 ${
        isTransitioning ? "opacity-0" : "opacity-100"
      }`} style={{backgroundImage: `url(${getImageURL(currentContent.backdrop_path)})`}}
      >
        {/* Gradient Overlay */}
        <div className="absolute inset-0 bg-black opacity-30" />
        <div className="absolute inset-0 bg-linear-to-r from-black/80 to-transparent"/>
      </div>
      {/* Content */}
      <div className="absolute inset-0 flex items-center z-10">
        <div className="w-full max-w-7xl mx-auto px-4">
          <div className="max-w-3xl">
          {/* Movies Info */}
            <div className={`transition-all duration-700 ${isTransitioning ? "opacity-0" : "opacity-100"}`}>
              <div className="flex items-center space-x-3 mb-4">
                <span className="bg-red-500 text-white text-xs font-semibold px-2 py-1 rounded-sm">
                  FEATURED
                </span>
                {/* Media Type */}
                <span className="bg-neutral-950 text-neutral-200 text-xs font-semibold px-2 py-1 rounded-sm">
                  {getMediaTypeLabel(currentContent.media_type)}
                </span>
                {/* Rating */}
                {currentContent.vote_average > 0 && (
                  <div className="flex items-center space-x-1">
                    <FaStar color="yellow"/>
                    <span className="text-white">{formatRating(currentContent.vote_average)}</span>
                  </div>
                )}
                {/* Year */}
                <span className="bg-neutral-100 text-black text-sm font-semibold px-2 py-1 rounded-sm">
                  {getYear(currentContent)}
                </span>
                {/* Adult Content */}
                {currentContent.adult && (
                  <>
                    <span className="text-neutral-400">.</span>
                    <span className="bg-neutral-700 text-neutral-300 text-xs px-11.5 py-0.5">
                      18+
                    </span>
                  </>
                )}
              </div>
              {/* Title */}
              <h1 className="text-4xl md:text-6xl font-bold text-white mb-4">
                {getTitle(currentContent)}
              </h1>
              {/* Overview */}
              <p className="text-white text-base md:text-lg font-bold mb-8 line-clamp-3 md:line-clamp-4 max-w-2xl">
                {currentContent.overview}
              </p>
              {/* Action Buttons */}
              <div className="flex flex-wrap gap-4">
                <button 
                  onClick={() => openContentDetails(currentContent.id, currentContent.media_type)}
                  className="bg-red-600 text-white font-semibold px-6 py-3 rounded-full flex items-center gap-2 transition-all hover:-translate-y-1 duration-200 cursor-pointer">
                    <IoPlayCircle size={22}/>
                    Watch Now
                </button>
                <button 
                  onClick={handleWatchListClick}
                  className="bg-neutral-950 text-white font-semibold px-6 py-3 rounded-full flex items-center gap-2 transition-all border border-neutral-800 hover:-translate-y-1 duration-200 cursor-pointer"
                >
                  {isInWatchList(currentContent.id, currentContent.media_type) ? (
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
      </div>
      {/* Pagination */}
      <div className="absolute bottom-10 left-0 right-0 flex justify-center gap-2 z-10">
        {featuredContent.map((_,index) => (
          <button key={index} onClick={() => {
            setIsTransitioning(true);
            setTimeout(() => {
              setCurrentSlide(index);
              setIsTransitioning(false);
            }, 500)
          }}
            className={`h-1.5 rounded-full transition-all cursor-pointer ${currentSlide === index 
              ? "w-8 bg-red-500" 
              : "w-4 bg-neutral-600"
            }`}>
          </button>
        ))}
      </div>
    </div>
  )
}

export default Hero