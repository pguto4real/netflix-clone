import Image from "next/image";
import { Inter } from "next/font/google";
import Head from "next/head";
import Header from "../components/Header";
import Banner from "@/components/Banner";

const inter = Inter({ subsets: ["latin"] });

export default function Home() {
  return (
    <div
      className="relative h-screen bg-gradient-to-b from-gray-900/10
     to-[#010511] lg:h-[140vh]
    "
    >
      <Head>
        <title>Home - Netflix</title>
      </Head>
      <Header />
      <main>
        <Banner />
        <section>
          {/* Row */}
          {/* Row */}
          {/* Row */}
          {/* Row */}
          {/* Row */}
          {/* Row */}
        </section>
      </main>
      {/* Modal */}
    </div>
  );
}
