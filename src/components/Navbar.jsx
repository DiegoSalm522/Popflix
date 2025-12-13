import { useEffect, useRef, useState } from "react"
import { FaSearch, FaTimes } from "react-icons/fa"
import { FaBars } from "react-icons/fa6"
import { Link, NavLink } from "react-router-dom"
import { searchContent, getImageURL, getTitle, getYear } from "../services/api"
import { useMoviesShows } from "../context/Context"

const Navbar = () => {
  const [isOpen, setisOpen] = useState(false)
  const [isScrolled, setIsScrolled] = useState(false)

  const [searchQuery, setSearchQuery] = useState("")
  const [searchResult, setSearchResult] = useState([])
  const [isSearching, setIsSearching] = useState(false)
  const [showSearchResults, setShowSearchResults] = useState(false)
  const searchDesktopRef = useRef(null)
  const searchMobileRef = useRef(null)

  const { openContentDetails } = useMoviesShows()

  const toggleMenu = () => {
    setisOpen(!isOpen)
  }

  const closeMenu = () => {
    setisOpen(false)
  }

  const handleNavClick = () => {
    window.scrollTo({ top: 0, behavior: "smooth" })
    closeMenu()
  }

  useEffect(() => {
    const searchTimer = setTimeout(async () => {
      if (searchQuery.trim().length >= 2) {
        setIsSearching(true)
        setShowSearchResults(true)
        try {
          const results = await searchContent(searchQuery)
          setSearchResult(results.slice(0, 8))
        } catch (error) {
          console.error("Error searching:", error)
          setSearchResult([])
        } finally {
          setIsSearching(false)
        }
      } else {
        setSearchResult([])
        setShowSearchResults(false)
      }
    }, 500)
    return () => clearTimeout(searchTimer)
  }, [searchQuery])
  useEffect(() => {
  const handleClickOutside = (event) => {
    const target = event.target
    const clickedOutsideDesktop = searchDesktopRef.current && !searchDesktopRef.current.contains(target)
    const clickedOutsideMobile = searchMobileRef.current && !searchMobileRef.current.contains(target)
    const isOutside = (!searchDesktopRef.current && !searchMobileRef.current) ||
                      (searchDesktopRef.current && searchMobileRef.current
                        ? clickedOutsideDesktop && clickedOutsideMobile
                        : (searchDesktopRef.current ? clickedOutsideDesktop : clickedOutsideMobile)
                      )
    if (isOutside) {
      setShowSearchResults(false)
    }
  }

  document.addEventListener("click", handleClickOutside)
  document.addEventListener("touchstart", handleClickOutside)

  return () => {
    document.removeEventListener("click", handleClickOutside)
    document.removeEventListener("touchstart", handleClickOutside)
  }
}, [])


  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10)
    }
    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value)
  }

  const handleResultClick = (item) => {
    openContentDetails(item.id, item.media_type)
    setSearchQuery("")
    setShowSearchResults(false)
    closeMenu()
  }

  const clearSearch = () => {
    setSearchQuery("")
    setSearchResult([])
    setShowSearchResults(false)
  }

  return (
    <div>
      <header
        className={`fixed flex items-center justify-between w-full px-4 py-4 z-50 transition-all duration-300
          ${isOpen
            ? "bg-black md:bg-transparent"
            : isScrolled
              ? "bg-black backdrop-blur-md shadow-lg"
              : "bg-transparent"
          }
        `}
      >
        <div className="w-full max-w-7xl mx-auto flex items-center justify-between">
          <Link to="/" onClick={handleNavClick} className="text-red-500 font-bold text-3xl">
            POPFLIX
          </Link>
          {/* Desktop Navigation */}
          <nav className="hidden md:flex space-x-8">
            <NavLink 
              to="/" 
              onClick={handleNavClick}
              className={({isActive}) =>
                `${isActive? "text-red-500" : ""} text-xl font-bold hover:text-red-500 transition-all duration-300`
              }>
              Home
            </NavLink>
            <NavLink 
              to="/movies" 
              onClick={handleNavClick}
              className={({isActive}) =>
                `${isActive? "text-red-500" : ""} text-xl font-bold hover:text-red-500 transition-all duration-300`
              }>
              Movies
            </NavLink>
            <NavLink 
              to="/tv-shows" 
              onClick={handleNavClick}
              className={({isActive}) =>
                `${isActive? "text-red-500" : ""} text-xl font-bold hover:text-red-500 transition-all duration-300`
              }>
              TV Shows
            </NavLink>
            <NavLink 
              to="/watch-list" 
              onClick={handleNavClick}
              className={({isActive}) =>
                `${isActive? "text-red-500" : ""} text-xl font-bold hover:text-red-500 transition-all duration-300`
              }>
              Watch List
            </NavLink>
          </nav>
          {/* Desktop Search */}
          <div className="hidden md:block relative" ref={searchDesktopRef}>
            <div className="relative">
              <input 
                type="text" 
                value={searchQuery}
                onChange={handleSearchChange}
                placeholder="Search movies & TV shows....."
                className={`text-white px-4 py-2 pr-11 focus:pr-20 rounded-full text-md w-64 focus:w-80 transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-red-500
                  ${isScrolled
                    ? "bg-neutral-900"
                    : "bg-black"
                  }
                `}
              />             
              {searchQuery && (
                <button
                  onClick={clearSearch}
                  className="absolute right-10 top-3 text-neutral-400 hover:text-white transition-colors"
                >
                  <FaTimes size={14}/>
                </button>
              )}              
              <div className="absolute right-3 top-3 text-neutral-400">
                {isSearching ? (
                  <div className="animate-spin">
                    <FaSearch size={18}/>
                  </div>
                ) : (
                  <FaSearch size={18}/>
                )}
              </div>
            </div>
            {/* Search Results Dropdown */}
            {showSearchResults && searchResult.length > 0 && (
              <div className="absolute mt-2 w-80 bg-neutral-950 rounded-lg shadow-lg overflow-hidden z-50 max-h-96 overflow-y-auto">
                <ul className="divide-y divide-neutral-800">
                  {searchResult.map((item) => (
                    <li key={`${item.id}-${item.media_type}`} className="hover:bg-neutral-800">
                      <button 
                        onClick={() => handleResultClick(item)}
                        className="flex items-center p-3 w-full text-left"
                      >
                        <div className="w-12 h-16 bg-neutral-800 rounded overflow-hidden flex shrink-0">
                          {item.poster_path ? (
                            <img 
                              src={getImageURL(item.poster_path, "w92")} 
                              alt={getTitle(item)} 
                              className="w-full h-full object-cover"
                            />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center text-neutral-500 text-xs">
                              No Image
                            </div>
                          )}
                        </div>
                        <div className="ml-3 flex-1">
                          <p className="text-sm font-medium text-white truncate">
                            {getTitle(item)}
                          </p>
                          <div className="flex items-center gap-2 mt-1">
                            <span className="text-xs text-neutral-400">
                              {getYear(item)}
                            </span>
                          </div>
                        </div>
                      </button>
                    </li>
                  ))}
                </ul>
              </div>
            )}
            {/* No Results */}
            {showSearchResults && searchQuery.trim().length >= 2 && searchResult.length === 0 && !isSearching && (
              <div className="absolute mt-2 w-80 bg-neutral-950 rounded-lg shadow-lg overflow-hidden z-50">
                <div className="p-4 text-center text-neutral-400 text-sm">
                  No results found for "{searchQuery}"
                </div>
              </div>
            )}
          </div>
          {/* Mobile Menu Button */}
          <button className="md:hidden text-white hover:text-red-500 cursor-pointer transition-all duration-300 z-50" onClick={toggleMenu}>
            {isOpen ? <FaTimes size={30}/> : <FaBars size={30}/>}
          </button>
        </div>
      </header>
      {/* Mobile Navigation */}
      <div className={`md:hidden px-8 fixed left-0 w-full bg-black/95 text-white transition-all duration-300 ease-in-out z-40 top-[60px]
        ${isOpen ? 
          "max-h-screen opacity-100" 
          : 
          "max-h-0 opacity-0 overflow-hidden"
        }`
      }>
        <nav className="flex flex-col pt-4 pb-2">
          <NavLink 
            to="/" 
            onClick={handleNavClick}
            className="text-lg font-bold hover:text-red-500 py-3 transition-all duration-300"
          >
            Home
          </NavLink>
          <NavLink 
            to="/movies" 
            onClick={handleNavClick}
            className="text-lg font-bold hover:text-red-500 py-3 transition-all duration-300"
          >
            Movies
          </NavLink>
          <NavLink 
            to="/tv-shows" 
            onClick={handleNavClick}
            className="text-lg font-bold hover:text-red-500 py-3 transition-all duration-300"
          >
            TV Shows
          </NavLink>
          <NavLink 
            to="/watch-list" 
            onClick={handleNavClick}
            className="text-lg font-bold hover:text-red-500 py-3 transition-all duration-300"
          >
            Watch List
          </NavLink>
        </nav>
        {/* Mobile Search */}
        <div className="relative mt-3 pb-4" ref={searchMobileRef}>
          <input 
            type="text" 
            value={searchQuery}
            onChange={handleSearchChange}
            placeholder="Search movies & TV shows..."
            className="bg-neutral-900 text-white px-4 py-2 pr-20 rounded-full text-md w-full transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-red-500" 
          />         
          {searchQuery && (
            <button
              onClick={clearSearch}
              className="absolute right-10 top-3 text-neutral-400 hover:text-white transition-colors"
            >
              <FaTimes size={14}/>
            </button>
          )}         
          <div className="absolute right-3 top-3 text-neutral-400">
            {isSearching ? (
              <div className="animate-spin">
                <FaSearch size={18}/>
              </div>
            ) : (
              <FaSearch size={18}/>
            )}
          </div>
          {/* Mobile Search Results */}
          {showSearchResults && searchResult.length > 0 && (
            <div className="absolute mt-2 w-full bg-neutral-950 rounded-lg shadow-lg overflow-hidden z-50 max-h-72 overflow-y-auto">
              <ul className="divide-y divide-neutral-800">
                {searchResult.map((item) => (
                  <li key={`${item.id}-${item.media_type}`} className="hover:bg-neutral-800">
                    <button 
                      onClick={() => handleResultClick(item)}
                      className="flex items-center p-3 w-full text-left"
                    >
                      <div className="w-12 h-16 bg-neutral-800 rounded overflow-hidden flex shrink-0">
                        {item.poster_path ? (
                          <img 
                            src={getImageURL(item.poster_path, "w92")} 
                            alt={getTitle(item)} 
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center text-neutral-500 text-xs">
                            No Image
                          </div>
                        )}
                      </div>
                      <div className="ml-3 flex-1">
                        <p className="text-sm font-medium text-white truncate">
                          {getTitle(item)}
                        </p>
                        <div className="flex items-center gap-2 mt-1">
                          <span className="text-xs text-neutral-400">
                            {getYear(item)}
                          </span>
                        </div>
                      </div>
                    </button>
                  </li>
                ))}
              </ul>
            </div>
          )}
          {/* Mobile No Results */}
          {showSearchResults && searchQuery.trim().length >= 2 && searchResult.length === 0 && !isSearching && (
            <div className="absolute mt-2 w-full bg-neutral-950 rounded-lg shadow-lg overflow-hidden z-50">
              <div className="p-4 text-center text-neutral-400 text-sm">
                No results found for "{searchQuery}"
              </div>
            </div>
          )}
        </div>
      </div>
      {isOpen && (
        <div 
          className="md:hidden fixed inset-0 z-30 top-[88px] bg-black/50" 
          onClick={closeMenu}
        />
      )}
    </div>
  )
}

export default Navbar