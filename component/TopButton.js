"use client";

import { useEffect, useState } from "react";
import styles from "./TopButton.module.css";

export default function TopButton() {
  const [show, setShow] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setShow(window.scrollY > 200);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth"});
  };

  return (
    <button onClick={scrollToTop}
    className={`${styles.topButton} ${
        show ? styles.topButtonVisible : styles.topButtonHidden
      }`}>
      ▲
    </button>
  );
}