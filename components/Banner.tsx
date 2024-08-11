import { imageBaseUrl } from "@/constant/movie";
import { Movie } from "@/typing";
import { InformationCircleIcon } from "@heroicons/react/solid";
import Image from "next/image";
import { useEffect, useState } from "react";
import { BsInfoCircle } from "react-icons/bs";
import { FaPlay } from "react-icons/fa";

interface Props {
  netflixOriginals: Movie[];
}

export default function Banner({ netflixOriginals }: Props) {
  const [movie, setMovie] = useState<Movie | null>(null);
  useEffect(() => {
    setMovie(
      netflixOriginals[Math.floor(Math.random() * netflixOriginals.length)]
    );
    console.log(movie);
  }, [netflixOriginals]);

  console.log(movie);

  console.log(
    `${imageBaseUrl}${movie?.backdrop_path} || ${movie?.poster_path}`
  );
  return (
    <div className="flex pl-4 flex-col bottom-[35%] py-16 md:space-y-4 lg:h-[65vh] lg:justify-end lg:pl-10">
      <div className="absolute top-0 left-0 h-[95vh] w-screen -z-10">
        {
          <Image
            className="w-[100%]"
            src={`${imageBaseUrl}${movie?.backdrop_path || movie?.poster_path}`}
            layout="fill"
            objectFit="cover"
            alt=""
          />
        }
      </div>
      <h1 className="text-2xl lg:text-7xl md:text-4xl">
        {movie?.original_name || movie?.name || movie?.title || ""}
      </h1>
      <p className="text-shadow-md max-w-xs font-normal text-xs md:max-w-lg md:text-lg lg:max-w-2xl lg:text-[20px]">
        {movie?.overview}
      </p>
      <div className="flex leading-[88%] mt-[1.5vw] whitespace-nowrap space-x-3">
        <button className="banner__button bg-white text-black" ><FaPlay className="h-4 w-4 text-black md:h-7 md:w-7"/> Play</button>
        <button className="banner__button bg-[gray]/70"><BsInfoCircle className="h-5 w-5 md:h-8 w-8"/>More Info</button>
      </div>
    </div>
  );
}
