"use client";
import { CSSProperties, useEffect, useState } from "react";
import { CreatePost } from "@/components/create-post";
import { title } from "@/components/primitives";
import { getLocalOffsetTimeZone, getNextTimeZoneFor1337 } from "./utils";

export default function Home() {
  const [isVisible, setIsVisible] = useState<boolean>(true);
  const [isTimezoneVisible, setIsTimezoneVisible] = useState<boolean>(false);
  const [isFadingOut, setIsFadingOut] = useState<boolean>(false);

  const fadeStyle: CSSProperties = {
    opacity: isFadingOut ? 0 : 2,
    transition: "opacity 1s ease-in-out",
  };

  const getUtcLabel = () => {
    const nextTimeZone = getNextTimeZoneFor1337();

    return `${getLocalOffsetTimeZone().label === nextTimeZone ? "Your timezone" : nextTimeZone} is up next!`;
  };

  useEffect(() => {
    // Start fading out after 5 seconds
    const fadeTimer = setTimeout(() => {
      setIsFadingOut(true);
    }, 4000);

    // Hide the component after the fade-out transition (1 second)
    const hideTimer = setTimeout(() => {
      setIsVisible(false);
      setIsTimezoneVisible(true);
    }, 5000); // Allowing 1 second for the fade-out animation

    // Cleanup the timers when the component unmounts or state changes
    return () => {
      clearTimeout(fadeTimer);
      clearTimeout(hideTimer);
    };
  }, []);

  return (
    <section className="flex flex-col items-center justify-center gap-4 py-8 md:py-10">
      <div className="inline-block text-center justify-center">
        <span className={title({ color: "violet" })}>13:37</span>
        <br />
        <br />
        <br />
        {isVisible && (
          <span className={title()} style={fadeStyle}>
            Master the game, own the name!
          </span>
        )}
        {isTimezoneVisible && <span className={title()}>{getUtcLabel()}</span>}
        <br />
        <br />
        <br />
        <br />
        <br />
        <div className="lg:inline-block lg:text-center lg:justify-center lg:w-[400px]">
          <CreatePost />
        </div>
      </div>
    </section>
  );
}
