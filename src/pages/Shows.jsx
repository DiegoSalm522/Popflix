import React, { useMemo } from 'react'
import { useMoviesShows } from "../context/Context";
import Hero from "../components/Hero";
import Slider from "../components/Slider";
import Genres from "../components/Genres";

const Shows = () => {
  const { trendingContent, popularContent, topRatedContent, loading } = useMoviesShows();

  const trendingShows = useMemo(() => 
    trendingContent.filter(item => item.media_type === "tv"), 
    [trendingContent]
  )

  const popularShows = useMemo(() =>
    popularContent.filter(item => item.media_type === "tv"),
    [popularContent]
  )

  const topRatedShows = useMemo(() =>
    topRatedContent.filter(item => item.media_type === "tv"),
    [topRatedContent]
  )

  return (
    <>
      <Hero content={trendingShows}/>
      <div>
        {!loading && (
          <>
            <Slider title="Trending TV Shows" content={trendingShows}/>
            <Slider title="Popular TV Shows" content={popularShows}/>
            <Slider title="Top Rated TV Shows" content={topRatedShows}/>
            <Genres mediaType="tv"/>
          </>
        )}
      </div>
    </>
  )
}

export default Shows