import React, { useEffect, useState } from "react";

import MuiModal from "@mui/material/Modal";
import { useRecoilState } from "recoil";
import { modalState, movieState } from "@/atoms/modalAtoms";
import {
  CheckIcon,
  PlusIcon,
  VolumeOffIcon,
  VolumeUpIcon,
  XIcon,
} from "@heroicons/react/solid";
import { Genre, Movie } from "@/typing";
import ReactPlayer from "react-player";
import { FaPlay } from "react-icons/fa";
import { ThumbUpIcon } from "@heroicons/react/outline";

import Related from "./Related";
import { db } from "@/firebase";
import {
  collection,
  deleteDoc,
  doc,
  DocumentData,
  onSnapshot,
  setDoc,
} from "firebase/firestore";
import useAuth from "@/hooks/useAuth";
import toast, { Toaster } from "react-hot-toast";

export default function Modal() {
  const [showModal, setShowModal] = useRecoilState(modalState);
  const [movie, setMovie] = useRecoilState(movieState);
  const [trailer, setTrailer] = useState("");
  const [runtime, setRuntime] = useState("");
  const [genres, setGenres] = useState<Genre[]>([]);
  const [muted, setMuted] = useState(true);
  const [relatedMovies, setRelatedMovies] = useState([]);
  const { user } = useAuth();
  const [addedToList, setAddedToList] = useState(false);
  const [movies, setMovies] = useState<DocumentData[] | Movie[]>([]);

  const toastStyle = {
    background: "white",
    color: "black",
    fontWeight: "bold",
    fontSize: "16px",
    padding: "15px",
    borderRadius: "9999px",
    maxWidth: "1000px",
  };
  const handleClose = () => {
    setShowModal(false);
    setMovie(null);
  };

  useEffect(() => {
    console.log('showModal',showModal)
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

      if (data?.videos) {
       
        const index = data.videos.results.findIndex(
          (element: Element) => element?.type === "Trailer"
        );
        setTrailer(data.videos?.results[index]?.key);
      }
      if (data?.genres) {
        setGenres(data.genres);
      }
      if (data?.runtime) {
        let newRuntime = "";
        if (data?.runtime > 60) {
          newRuntime += Math.floor(data?.runtime / 60) + "h ";
        }

        if (data.runtime % 60 < 60) {
          newRuntime += (data.runtime % 60) + "m";
        }

        // {runtime > 60 && Math.floor(runtime/60)+"h "+Math.floor(runtime%60) }
        setRuntime(newRuntime);
      }
    }
    function shuffle(dataArray: []) {
      //   set the index to the arrays length
      let i = dataArray.length,
        j,
        temp;
      //   create a loop that subtracts everytime it iterates through
      while (--i > 0) {
        //  create a random number and store it in a variable
        j = Math.floor(Math.random() * (i + 1));
        // create a temporary position from the item of the random number
        temp = dataArray[j];
        // swap the temp with the position of the last item in the dataArray
        dataArray[j] = dataArray[i];
        // swap the last item with the position of the random number
        dataArray[i] = temp;
      }
      // return[execute] the dataArray when it completes::don't really need the console.log but helps to check
      return dataArray;
    }
    async function fetchRelatedMovie() {
      const data = await fetch(
        `https://api.themoviedb.org/3/movie/${movie?.id}/similar?api_key=${process.env.NEXT_PUBLIC_API_KEY}`
      )
        .then((response) => response.json())
        .catch((err) => console.log(err.message));

      setRelatedMovies(shuffle(data.results).slice(0, 8));
    }

    fetchMovie();
    fetchRelatedMovie();
  }, [movie]);
  // Find all the movies in the user's list
  useEffect(() => {
    if (user) {
      return onSnapshot(
        collection(db, "customers", user.uid, "myList"),
        (snapshot) => setMovies(snapshot.docs)
      );
    }
  }, [movie?.id,user]);
  const checkIfInList = (id: any) => {
    return movies.findIndex((result) => result.data().id === id) !== -1;
  };
  // Check if the movie is already in the user's list
  useEffect(
    () =>
      setAddedToList(
        movies.findIndex((result) => result.data().id === movie?.id) !== -1
      ),
    [movies, movie?.id]
  );

  const handleList = async () => {
    if (addedToList) {
      await deleteDoc(
        doc(db, "customers", user!.uid, "myList", movie?.id.toString()!)
      );

      toast(
        `${movie?.title || movie?.original_name} has been removed from My List`,
        {
          duration: 8000,
          style: toastStyle,
        }
      );
    } else {
      await setDoc(
        doc(db, "customers", user!.uid, "myList", movie?.id.toString()!),
        { ...movie }
      );

      toast(
        `${movie?.title || movie?.original_name} has been added to My List`,
        {
          duration: 8000,
          style: toastStyle,
        }
      );
    }
  };

  return (
    <MuiModal
      open={showModal}
      onClose={handleClose}
      className="fixex !top-7 left-0 right-0 z-50 mx-auto w-[65%] md:w-[80%] max-w-5xl
   overflow-y-scroll rounded-md scrollbar-hide lg:w-full"
    >
      <>
        {" "}
        <Toaster position="bottom-center" />
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
            poster
            width="100%"
            height="100%"
            style={{ position: "absolute", top: "0", left: "0" }}
            playing
            muted={muted}
          />
          <div
            className="border-[3px] absolute bottom-[8rem] text-[40px] capitalize 
          bg-black mx-8 p-2 rounded-[0.5rem] font-bold"
          >
            {movie?.original_name || movie?.name || movie?.title || ""}
          </div>
          <div className="absolute bottom-10 flex w-full items-center justify-between px-10">
            <div className="flex space-x-2">
              <button
                className="flex items-center gap-x-2 rounded bg-white px-8 text-xl
            font-bold text-black transition hover:bg-[#e6e6e6]"
              >
                <FaPlay className="h-7 w-7 text-black" />
                Play
              </button>

              <button className="modalButton" onClick={handleList}>
                {addedToList ? (
                  <CheckIcon className="h-7 w-7" />
                ) : (
                  <PlusIcon className="h-7 w-7" />
                )}
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
                  <span className=" text-[gray]">Genres: </span>
                  {genres.map((genre) => genre.name).join(", ")}
                </div>
              </div>

              <p className="w-5/6">{movie?.overview}</p>
              <div>
                <span className="text-[gray]">Original Language: </span>
                {movie?.original_language}
              </div>
              <div>
                <span className="text-[gray]">Total Votes: </span>
                {movie?.vote_count}
              </div>
            </div>
            <div>
              <h1
                className="text-2xl font-extrabold px-2 py-2 text-center
              md:text-center lg:text-left "
              >
                More Like This
              </h1>

              <div className="flex flex-wrap justify-center lg:justify-normal">
                {relatedMovies.map((relatedMovie) => (
                  <Related
                    key={relatedMovie?.id}
                    relatedMovieId={relatedMovie?.id}
                    checkIfInList={checkIfInList}
                    movie={relatedMovie}
                    addedToList={addedToList}
                    handleList={handleList}
                  />
                ))}
              </div>
            </div>
          </div>
        </div>
      </>
    </MuiModal>
  );
}
