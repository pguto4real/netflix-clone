import {
  HiOutlineBell,
  HiOutlineSearchCircle,
} from "react-icons/hi";

import { useEffect, useState } from "react";

import Link from "next/link";
import BasicMenu from "./BasicMenu";
import Image from "next/image";

export default function Header() {
  const [isScrolled, setIsScrolled] = useState(false);


  useEffect(() => {

  
    const handleScroll = () => {
      if (window.scrollY > 0) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };

    window.addEventListener("scroll", handleScroll);

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);
  
  return (
    <>
      <header className={`${isScrolled && "bg-[#141414]"}`}>
      <div className="flex items-center space-x-2 md:space-x-10">
      
        <Image
            src="/Netflix_2015_logo.svg"
            className="cursor-pointer object-contain "
            width={100}
            height={100}
            alt=""
          />

 <BasicMenu />
        <ul className="hidden space-x-4 md:flex">
          <li className="header__link">Home</li>
          <li className="header__link">Tv Shows</li>
          <li className="header__link">Movies</li>
          <li className="header__link">New & Popular</li>
          <li className="header__link">My List</li>
          <li className="header__link">Browse by Language</li>
        </ul>
      </div>

      <div className="flex items-center  space-x-4 text-sm font-light">
        <HiOutlineSearchCircle className="hidden h-6 w-6 sm:inline" />
        <p className="hidden lg:inline">Kids</p>
        <HiOutlineBell className="h-6 w-6" />
        <Link href="/account">
        <Image
            src="https://rb.gy/g1pwyx"
            className="cursor-pointer rounded "
            width={32}
            height={32}
            alt=""
          />
        </Link>
      </div>
    </header>
    </>
  
  );
}
