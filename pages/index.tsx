import {
  getProduct,
  getProducts,
  Product,
} from "@stripe/firestore-stripe-payments";
import Head from "next/head";
import { useRecoilValue } from "recoil";
import { modalState, movieState } from "../atoms/modalAtoms";
import Banner from "../components/Banner";
import Header from "../components/Header";
import Modal from "../components/Modal";
import Plans from "../components/Plans";
import Row from "../components/Row";
import useAuth from "../hooks/useAuth";
import useList from '../hooks/useList'

import payments from "../lib/stripe";
import { Movie } from "../typing";
import requests from "../utils/requests";
import { useEffect, useState } from "react";
import {
  collection,
  collectionGroup,
  doc,
  getDoc,
  getDocs,
  query,
} from "firebase/firestore";
import { db } from "@/firebase";
import useSubscription from "@/hooks/useSubscription";

interface Props {
  netflixOriginals: Movie[];
  trendingNow: Movie[];
  topRated: Movie[];
  actionMovies: Movie[];
  comedyMovies: Movie[];
  horrorMovies: Movie[];
  romanceMovies: Movie[];
  documentaries: Movie[];
  products: Product[];
}

const Home = ({
  netflixOriginals,
  actionMovies,
  comedyMovies,
  documentaries,
  horrorMovies,
  romanceMovies,
  topRated,
  trendingNow,
  products,
}: Props) => {
  const { logout, loading, user } = useAuth();

  const movie = useRecoilValue(movieState);
  const showModal = useRecoilValue(modalState);
  const subscription = useSubscription(user);
  const list = useList(user?.uid)
  if (loading ) return <div className=" bg-black/75">Loading</div>;

  if (!subscription) return <Plans products={products} />;
  return (
    <div
      className={`relative h-screen bg-gradient-to-b lg:h-[140vh] ${
        showModal && "!h-screen overflow-hidden"
      }`}
    >
      <Head>
        <title>Home - Netflix</title>
      </Head>
      <Header logout={logout} />
      <main className="relative pl-4 pb-24 lg:space-y-24 lg:pl-16">
        <Banner netflixOriginals={netflixOriginals} />
        <section className="md:space-y-24">
          <Row title="Trending Now" movies={trendingNow} />
          <Row title="Top Rated" movies={topRated} />
          <Row title="Action Thrillers" movies={actionMovies} />
          {/* My List Component */}
          {list.length > 0 && <Row title="My List" movies={list} />}
          <Row title="Comedies" movies={comedyMovies} />
          <Row title="Scary Movies" movies={horrorMovies} />
          <Row title="Romance Movies" movies={romanceMovies} />
          <Row title="Documentaries" movies={documentaries} />
        </section>
      </main>
      {showModal && <Modal />}
    </div>
  );
};
export default Home;

export const getServerSideProps = async () => {
  const productdatas = (await getDocs(collection(db, "products"))).docs;
  let products = [];
  let i = 0;
  let productsId = [];
  productdatas.forEach((doc) => {
    console.log(doc.id, " => ", doc.data());
    productsId[i] = { id: doc.id, data: doc.data() };
    i++;
  });

  for (let index = 0; index < productsId.length; index++) {
    console.log(productsId[index]);
    const postRef = collection(db, "products", productsId[index].id, "prices");
    const q = query(postRef);
    const pricesQuerySnap = await getDocs(q);
    const post = pricesQuerySnap.docs.map((item) => ({
      ...productsId[index].data,
      id: productsId[index].id,
      priceId: item.id,
      prices: item.data(),
    }));
    console.log(pricesQuerySnap);
    console.log(post);
    products.push(post[0]);
  }

  const [
    netflixOriginals,
    trendingNow,
    topRated,
    actionMovies,
    comedyMovies,
    horrorMovies,
    romanceMovies,
    documentaries,
  ] = await Promise.all([
    fetch(requests.fetchNetflixOriginals).then((res) => res.json()),
    fetch(requests.fetchTrending).then((res) => res.json()),
    fetch(requests.fetchTopRated).then((res) => res.json()),
    fetch(requests.fetchActionMovies).then((res) => res.json()),
    fetch(requests.fetchComedyMovies).then((res) => res.json()),
    fetch(requests.fetchHorrorMovies).then((res) => res.json()),
    fetch(requests.fetchRomanceMovies).then((res) => res.json()),
    fetch(requests.fetchDocumentaries).then((res) => res.json()),
  ]);
  // consolelog;
  return {
    props: {
      netflixOriginals: netflixOriginals.results,
      trendingNow: trendingNow.results,
      topRated: topRated.results,
      actionMovies: actionMovies.results,
      comedyMovies: comedyMovies.results,
      horrorMovies: horrorMovies.results,
      romanceMovies: romanceMovies.results,
      documentaries: documentaries.results,
      products: products || null,
    },
  };
};
