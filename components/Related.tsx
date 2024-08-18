import { modalState, movieState } from "@/atoms/modalAtoms";
import { imageBaseUrl } from "@/constant/movie";
import { CheckIcon, PlusIcon } from "@heroicons/react/solid";
import Image from "next/image";
import React from "react";
import { useRecoilState } from "recoil";

export default function Related({
  movie,
  addedToList,
  handleList,
  checkIfInList,
  relatedMovieId,
}: any) {
  const [showModal, setShowModal] = useRecoilState(modalState);
  const [currentMovie, setCurrentMovie] = useRecoilState(movieState);
  const inList = checkIfInList(relatedMovieId);
  // console.log(inList)
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
            layout="fill"
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
              {movie?.release_date
                ? movie?.release_date.split("-")[0]
                : movie?.first_air_date.split("-")[0]}
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
