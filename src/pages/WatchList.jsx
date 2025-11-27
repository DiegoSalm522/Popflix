import React, { useEffect, useState } from "react"
import { FaStar } from "react-icons/fa"
import { IoPlayCircle } from "react-icons/io5"
import { MdOutlineTvOff, MdRemoveCircle } from "react-icons/md"
import { useMoviesShows } from "../context/Context"
import { getImageURL, getTitle, getYear } from "../services/api"
import Alert from "../components/Alert"

const WatchList = () => {
  const { watchList, openContentDetails, removeFromWatchList } = useMoviesShows();

  const [showAlert, setShowAlert] = useState(false);
  const [alertType, setAlertType] = useState("success");
  const [alertMessage, setAlertMessage] = useState("");

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const formatRating = (rating) => {
    return (Math.round(rating * 10) / 10).toFixed(1);
  }

  const showAlertMessage = (type, message) => {
    setAlertType(type);
    setAlertMessage(message);
    setShowAlert(true);
    setTimeout(() => {
      setShowAlert(false);
    }, 5000);
  };

  const handleRemove = (id, mediaType) => {
    removeFromWatchList(id, mediaType);
    showAlertMessage("success", "Removed from your watch list");
  };

  if (watchList.length === 0) {
    return (
      <div className="min-h-screen pt-24 pb-12">
        {showAlert && <Alert type={alertType} text={alertMessage} />}
        <div className="mx-auto px-4 max-w-7xl">
          <h1 className="text-3xl md:text-4xl font-bold text-white mb-8">
            My Watch List
          </h1>
          <div className="flex flex-col items-center justify-center py-20">
            <div className="text-neutral-400 text-6xl mb-4">
              <MdOutlineTvOff size={180}/>
            </div>
            <h2 className="text-2xl font-semibold text-white mb-2">
              Your Watch List is Empty
            </h2>
            <p className="text-neutral-400 text-center max-w-md">
              Start adding movies and TV shows to your watch list to keep track of what you want to watch!
            </p>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen pt-24 pb-12 bg-neutral-950">
      {showAlert && <Alert type={alertType} text={alertMessage} />}
      <div className="mx-auto px-4 max-w-7xl">
        <div className="mb-8">
          <h1 className="text-3xl md:text-4xl font-bold text-white mb-2">
            My Watch List
          </h1>
          <p className="text-neutral-400">
            {watchList.length} {watchList.length === 1 ? "item" : "items"}
          </p>
        </div>
        {/* Content Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-4 md:gap-6">
          {watchList.map((item) => (
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
                        className="w-full bg-red-600 hover:-translate-y-1 duration-200 text-white py-3 rounded-full flex items-center justify-center gap-1 transition-all text-sm cursor-pointer"
                      >
                        <IoPlayCircle size={22}/>
                        Watch Now
                      </button>
                      <button 
                        onClick={() => handleRemove(item.id, item.media_type)}
                        className="w-full bg-neutral-950 hover:-translate-y-1 duration-200 border border-neutral-800 text-white py-3 rounded-full flex items-center justify-center gap-1 transition-all text-sm cursor-pointer"
                      >
                        <MdRemoveCircle size={22}/>
                        Remove from List
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
      </div>
    </div>
  )
}

export default WatchList