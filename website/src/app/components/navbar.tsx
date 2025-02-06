'use client';
import Link from "next/link";
import React, { useState } from "react";
import { FaBars, FaTimes } from "react-icons/fa";

const Navbar = () => {
    const [nav, setNav] = useState(false);

  const links = [
    {
        id:0, 
        link:"/..",
        label:"home"
    },
    { 
      id: 1,
      link: "finder",
      label:"Team Finder"
    },
  ];

  return (
    <div className="w-full max-w-7xl mx-auto flex justify-between items-center bg-blue-500 text-white dark:bg-secondary dark:text-white p-4">
        <div className="">
            <h2 className="text-xl font-bold">Dokkan Battle Team Builder</h2>
          </div>

      <ul className="hidden md:flex">      
        {links.map(({ id, link, label }) => (
          <li
            key={id}
            className="nav-links px-4 cursor-pointer capitalize font-medium text-white hover:scale-105 hover:text-white duration-200 link-underline"
          >
            <Link href={link}>{label}</Link>
          </li>
        ))}
      </ul>

      <div
        onClick={() => setNav(!nav)}
        className="cursor-pointer pr-4 z-10 text-gray-500 md:hidden"
      >
        {nav ? <FaTimes size={30} /> : <FaBars size={30} />}
      </div>

      {nav && (
        <ul className="flex flex-col justify-center items-center absolute top-0 left-0 w-full h-screen bg-gradient-to-b from-black to-gray-800 text-gray-500">
          {links.map(({ id, link, label }) => (
            <li
              key={id}
              className="px-4 cursor-pointer capitalize py-6 text-4xl"
            >
              <Link onClick={() => setNav(!nav)} href={link}>
                {label}
              </Link>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default Navbar;