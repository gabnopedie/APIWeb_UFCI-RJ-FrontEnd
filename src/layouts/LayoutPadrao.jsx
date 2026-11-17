"use client";

import Navbar from "@/components/Navbar";

export default function LayoutPadrao({ children }) {
  return (
    <>
      <Navbar />
      {children}
    </>
  );
}
