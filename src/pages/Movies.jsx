import React, { useMemo } from "react"
import { useMoviesShows } from "../context/Context";
import Hero from "../components/Hero";
import Slider from "../components/Slider";
import Genres from "../components/Genres";

const Movies = () => {
  const { trendingContent, popularContent, topRatedContent, loading } = useMoviesShows();

  const trendingMovies = useMemo(() => 
    trendingContent.filter(item => item.media_type === "movie"), 
    [trendingContent]
  )

  const popularMovies = useMemo(() =>
    popularContent.filter(item => item.media_type === "movie"),
    [popularContent]
  )

  const topRatedMovies = useMemo(() =>
    topRatedContent.filter(item => item.media_type === "movie"),
    [topRatedContent]
  )

  return (
    <>
      <Hero content={trendingMovies}/>
      <div>
        {!loading && (
          <>
            <Slider title="Trending Movies" content={trendingMovies}/>
            <Slider title="Popular Movies" content={popularMovies}/>
            <Slider title="Top Rated Movies" content={topRatedMovies}/>
            <Genres mediaType="movie"/>
          </>
        )}
      </div>
    </>
  )
}

export default Movies