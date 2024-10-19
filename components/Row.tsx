import { ChevronLeftIcon, ChevronRightIcon } from "@heroicons/react/outline";

import { useEffect, useRef, useState } from "react";
import { Movie } from "../typing";
import Thumbnail from "./Thumbnail";

interface Props {
  title: string;
  movies: Movie[] | any;
}

function Row({ title, movies }: Props) {
  const rowRef = useRef<HTMLDivElement>(null);
  const [isMoved, setIsMoved] = useState(false);
  const [validMovies, setValidMovies] = useState<Movie[]>([]);
  const checkImage = (url: string): Promise<boolean> => {
    return new Promise((resolve) => {
      const img = document.createElement("img"); // Create an image element
      img.src = url;
      img.onload = () => resolve(true); // Image loaded
      img.onerror = () => resolve(false); // Image failed to load
    });
  };
  const handleClick = (direction: string) => {
    setIsMoved(true);

    if (rowRef.current) {
      const { scrollLeft, clientWidth } = rowRef.current;

      const scrollTo =
        direction === "left"
          ? scrollLeft - clientWidth
          : scrollLeft + clientWidth;

      rowRef.current.scrollTo({ left: scrollTo, behavior: "smooth" });
    }
  };
  useEffect(() => {
    const validateMovies = async () => {
      const validatedMovies = await Promise.all(
        movies.map(async (movie: Movie) => {
          const imageUrl = `https://image.tmdb.org/t/p/w500${movie.poster_path}`; // Adjust based on your image URL structure
          const isValid = await checkImage(imageUrl);
          return isValid ? movie : null; // Return the movie if the image is valid, else null
        })
      );

      // Filter out null values
      setValidMovies(validatedMovies.filter(Boolean) as Movie[]);
    };

    validateMovies();
  }, [movies]);

  return (
    <div className="h-40 space-y-0.5 md:space-y-2">
      <h2
        className="w-56 cursor-pointer text-sm font-semibold text-[#e5e5e5] transition duration-200
       hover:text-white md:text-2xl"
      >
        {title}
      </h2>
      <div className="group relative md:-ml-2">
        <ChevronLeftIcon
          className={`absolute top-0 bottom-0 left-2 z-40 m-auto h-9 w-9 cursor-pointer opacity-0 transition
             hover:scale-125 group-hover:opacity-100 ${!isMoved && "hidden"}`}
          onClick={() => handleClick("left")}
        />

        <div
          ref={rowRef}
          className="flex items-center space-x-0.5 overflow-x-scroll scrollbar-hide md:space-x-2.5 md:p-2"
        >
          {validMovies.map((movie: any) => (
            <Thumbnail key={movie.id} movie={movie} />
          ))}
        </div>

        <ChevronRightIcon
          className={`absolute top-0 bottom-0 right-2 z-40 m-auto h-9 w-9 cursor-pointer opacity-0 transition
             hover:scale-125 group-hover:opacity-100`}
          onClick={() => handleClick("right")}
        />
      </div>
    </div>
  );
}

export default Row;
