import styles from "./section2.module.scss";
import "animate.css/animate.css";
import useIntersectionObserver from "@/hooks/useIntersectionObserver";
import { useRef } from "react";

export default function HomeSection2() {
  const elementRefs = [useRef(null), useRef(null)];
  const isVisible = useIntersectionObserver(elementRefs);

  return (
    <>
      <div className={styles["home-section2"]}>
        <h5>
          <span
            className={`${
              isVisible[0]
                ? `${styles["animation"]}`
                : ""
            }`}
            ref={elementRefs[0]}
          >
            時光在此停滯，謎題在此等候。
            <br />
            請擁抱未知，以智慧與勇氣，尋找通往真相的鑰匙。
            <br />
            願你在迷霧中看見光明，在困境中找到出路。
          </span>
          <br />
          <span
            className={`${
              isVisible[1]
                ? `${styles["animation"]}`
                : ""
            }`}
            ref={elementRefs[1]}
          >
            Time stands still here, and mysteries await.
            <br />
            Embrace the unknown, and with wisdom and courage, seek the key to
            truth.
            <br />
            May you find light in the fog and a way out of the maze.
            <br />
          </span>
        </h5>
      </div>
    </>
  );
}
