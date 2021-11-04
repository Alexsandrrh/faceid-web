import { useState, useEffect } from "react";

export type TStateStream = MediaStream | null;
export type TStateError = any | null;

/** Получение данных из девайса */
export const useMediaDevice = (constraints: MediaStreamConstraints) => {
  const [stream, setStream] = useState<TStateStream>(null);
  const [error, setError] = useState<TStateError>(null);

  useEffect(() => {
    (async () => {
      try {
        if (
          "mediaDevices" in navigator &&
          "getUserMedia" in navigator.mediaDevices
        ) {
          const stream = await navigator.mediaDevices.getUserMedia(constraints);
          setStream(stream);
          setError(null);
        } else {
          throw new Error("Not found navigator props!");
        }
      } catch (e) {
        setError(e);
      }
    })();
  }, []);

  return [stream, error];
};
