import React, { useEffect, useState } from "react";

import MuiModal from "@mui/material/Modal";
import { useRecoilState } from "recoil";
import { modalState, movieState } from "@/atoms/modalAtoms";
import {
  PlusIcon,
  VolumeOffIcon,
  VolumeUpIcon,
  XIcon,
} from "@heroicons/react/solid";
import { Genre } from "@/typing";
import ReactPlayer from "react-player";
import { FaPlay } from "react-icons/fa";
import { ThumbUpIcon } from "@heroicons/react/outline";

export default function Modal() {
  const [showModal, setShowModal] = useRecoilState(modalState);
  const [movie, setMovie] = useRecoilState(movieState);
  const [trailer, setTrailer] = useState("");
  const [runtime, setRuntime] = useState('');
  const [genres, setGenres] = useState<Genre[]>([]);
  const [muted, setMuted] = useState(true);
  const handleClose = () => {
    setShowModal(false);
  };

  useEffect(() => {
    if (!movie) return;

    async function fetchMovie() {
      const data = await fetch(
        `https://api.themoviedb.org/3/${
          movie?.media_type === "tv" ? "tv" : "movie"
        }/${movie?.id}?api_key=${
          process.env.NEXT_PUBLIC_API_KEY
        }&language=en-US&append_to_response=videos`
      )
        .then((response) => response.json())
        .catch((err) => console.log(err.message));
      console.log(data);
      if (data?.videos) {
        const index = data.videos.results.findIndex(
          (element: Element) => element.type === "Trailer"
        );
        setTrailer(data.videos?.results[index]?.key);
      }
      if (data?.genres) {
        setGenres(data.genres);
      }
      if (data?.runtime) {
        let newRuntime = ''
        if(data?.runtime >60){
            newRuntime+=Math.floor(data?.runtime/60)+"h "
        }
        console.log(50%60)
        if(data.runtime%60 < 60)
        {
            newRuntime+= data.runtime%60+"m"
        }
            
        // {runtime > 60 && Math.floor(runtime/60)+"h "+Math.floor(runtime%60) }
        setRuntime(newRuntime);
      }
    }

    fetchMovie();
  }, [movie]);

  console.log(movie?.runtime);
  return (
    <MuiModal
      open={showModal}
      onClose={handleClose}
      className="fixex !top-7 left-0 right-0 z-50 mx-auto w-full max-w-5xl
    overflow-hidden overflow-y-scroll rounded-md scrollbar-hide"
    >
      <>
        {" "}
        <button
          onClick={handleClose}
          className="modalButton absolute right-5 top-5 !z-40
         h-9 w-9 bg-[#181818]  hover:bg-[#181818] "
        >
          <XIcon className="h-6 w-6"></XIcon>
        </button>
        <div className="relative pt-[56.25%] ">
          <ReactPlayer
            url={`https://www.youtube.com/watch?v=${trailer}`}
            width="100%"
            height="100%"
            style={{ position: "absolute", top: "0", left: "0" }}
            playing
            muted={muted}
          />
          <div className="absolute bottom-10 flex w-full items-center justify-between px-10">
            <div className="flex space-x-2">
              <button
                className="flex items-center gap-x-2 rounded bg-white px-8 text-xl
            font-bold text-black transition hover:bg-[#e6e6e6]"
              >
                <FaPlay className="h-7 w-7 text-black" />
                Play
              </button>

              <button className="modalButton">
                <PlusIcon className="h-7 w-7" />
              </button>
              <button className="modalButton">
                <ThumbUpIcon className="h-7 w-7" />
              </button>
            </div>
            <button className="modalButton" onClick={() => setMuted(!muted)}>
              {muted ? (
                <VolumeOffIcon className="h-7 w-7" />
              ) : (
                <VolumeUpIcon className="h-7 w-7" />
              )}
            </button>
          </div>
        </div>
        <div className="flex space-x-16 rounded-b-md px-10 bg-[#191919] py-8">
          <div className="space-y-6">
            <div className="flex  items-center space-x-2  text-lg">
              <p className="text-[#46d369]  text-lg font-semibold text-[16px]">
                {Math.floor(movie!.vote_average * 10)}% Match
              </p>

              <div className="flex justify-center items-center space-x-2">
                <p className=" text-[16px] font-semibold  text-[#bcbcbc]">
                  {movie?.release_date.split("-")[0] ||
                    movie?.first_air_date.split("-")[0]}
                </p>
                <p className=" text-[16px] text-[#bcbcbc]">{runtime}</p>
                <div
                  className="flex h-4 items-center justify-normal rounded border
                     border-white/40 text-xs px-1.5"
                >
                  HD
                </div>
              </div>
            </div>
            <div className="flex flex-col gap-x-10 gap-y-4 font-light md:flex-row">
              <div className="flex flex-col space-y-3 text-sm">
                <div>
                  <span  className=" text-[gray]">Genres: </span>
                     {genres.map((genre) => genre.name).join(", ")}
                </div>
              </div>

              <p className="w-5/6">{movie?.overview}</p>
              <div>
                <span className="text-[gray]">Original Language: </span>
                {movie?.original_language}
            </div>
            <div ><span className="text-[gray]">Total Votes: </span>{movie?.vote_count}</div>
            </div>
           
          </div>
        </div>
      </>
    </MuiModal>
  );
}
