import { modalState, movieState } from "@/atoms/modalAtoms";
import Image from "next/image";
import { release } from "os";
import React from "react";
import { useRecoilState } from "recoil";

export default function Related({
  movie,
  checkIfInList,
  relatedMovieId,
}: any) {
  const [showModal, setShowModal] = useRecoilState(modalState);
  const [currentMovie, setCurrentMovie] = useRecoilState(movieState);
  const inList = checkIfInList(relatedMovieId);

  let release_date = ""
 
  if(movie?.release_date){
    release_date = movie?.release_date?movie?.release_date.split("-")[0]:""
  }
  else
  {
    release_date = movie?.first_air_date?movie?.first_air_date.split("-")[0]:""
  }
console.log(movie?.release_date)
  return (
    <>
      <div className="border-2 w-[50%] my-2 md:w-[30%] lg:w-[23%]  bg-[#2f2f2f] mx-2">
        <div
          className="relative h-28 min-w-[180px] cursor-pointer 
      transition duration-200 ease-out md:h-36 md:hover:scale-105"
          onClick={() => {
            setCurrentMovie(movie);
            setShowModal(true);
          }}
        >
          <Image
            className="rounded-sm object-cover  md:rounded"
            src={`https://image.tmdb.org/t/p/w500${
              movie.backdrop_path || movie.poster_path
            }`}
            alt=""
            fill
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          
          />
        </div>
        {/* <div>{movie</div> */}
        <div className="flex justify-between px-4 py-4">
          <div
            className="flex justify-center items-center space-x-2"
            onClick={() => {
              setCurrentMovie(movie);
              setShowModal(true);
            }}
          >
            <p className=" text-[16px] font-semibold  text-[#bcbcbc]">
              {release_date}
            </p>

            <div
              className="flex h-4 items-center justify-normal rounded border
                     border-white/40 text-xs px-1.5"
            >
              HD
            </div>
          </div>
          
        </div>
        <div
          onClick={() => {
            setCurrentMovie(movie);
            setShowModal(true);
          }}
        >
          <p className=" px-4">
            {movie?.overview.slice(0, 150)}{" "}
            {movie?.overview.length > 150 && "..."}
          </p>
        </div>
      </div>
      {/* </div> */}
    </>
  );
}
