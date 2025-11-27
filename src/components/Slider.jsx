import React, { useRef, useState } from "react"
import { FaStar } from "react-icons/fa"
import { IoPlayCircle } from "react-icons/io5"
import { MdChevronLeft, MdChevronRight, MdRemoveCircle } from "react-icons/md"
import { getImageURL, getTitle, getYear } from "../services/api"
import { IoIosAddCircle } from "react-icons/io"
import { useMoviesShows } from "../context/Context"
import Alert from "./Alert";

const Slider = ({ title, content }) => {
  const sliderRef = useRef(null);
  const { openContentDetails, addToWatchList, removeFromWatchList, isInWatchList } = useMoviesShows();
  const [showAlert, setShowAlert] = useState(false);
  const [alertType, setAlertType] = useState("success");
  const [alertMessage, setAlertMessage] = useState("");

  const displayContent = content.slice(0, 20);

  const formatRating = (rating) => {
    return (Math.round(rating * 10) / 10).toFixed(1);
  }

  const scrollLeft = () => {
    if (sliderRef.current) {
      sliderRef.current.scrollBy({
        left: -400,
        behavior: "smooth"
      });
    }
  }

  const scrollRight = () => {
    if (sliderRef.current) {
      sliderRef.current.scrollBy({
        left: 400,
        behavior: "smooth"
      });
    }
  }

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
  }

  if (!content || content.length === 0) {
    return null;
  }

  return (
    <section className="py-5">
      {showAlert && <Alert type={alertType} text={alertMessage} />}
      <div className="mx-auto px-4 max-w-7xl">
        <div className="flex items-baseline justify-between mb-8">
          <div className="text-2xl md:text-3xl font-bold text-white">
            <h2>{title}</h2>
          </div>
          <div className="flex space-x-2">
            <button 
              onClick={scrollLeft}
              className="p-2 rounded-full bg-neutral-800 hover:bg-neutral-700 text-white transition-all cursor-pointer"
              aria-label="Scroll left"  
            >
              <MdChevronLeft size={25}/>
            </button>
            <button 
              onClick={scrollRight}
              className="p-2 rounded-full bg-neutral-800 hover:bg-neutral-700 text-white transition-all cursor-pointer"
              aria-label="Scroll right"  
            >
              <MdChevronRight size={25}/>
            </button>
          </div>
        </div>
        {/* Movie Slider */}
        <div className="relative">
          <div 
            ref={sliderRef}
            className="flex space-x-4 overflow-x-auto scrollbar-hide pb-4 snap-x scroll-smooth"
          >
            {displayContent.map((item) => (
              <div 
                key={`${item.id}-${item.media_type}`} 
                className="min-w-[200px] md:min-w-48 snap-start relative group cursor-pointer"
              >
                <div className="rounded-lg overflow-hidden bg-neutral-800">
                  <div className="relative aspect-2/3">
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
                      <FaStar size={15} color="yellow"/>
                      <span className="text-neutral-400 text-xs">
                        {formatRating(item.vote_average)}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}

export default Slider