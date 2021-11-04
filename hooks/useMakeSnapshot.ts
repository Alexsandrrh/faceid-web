import { useCallback, useState } from "react";
import type { RefObject } from "react";

export type TUseMakeSnapshotReturned = [() => void, File | null];

export const useMakeSnapshot = (
  videoRef: RefObject<HTMLVideoElement>
): TUseMakeSnapshotReturned => {
  /** Хранилище для картинки */
  const [image, setImage] = useState<File | null>(null);

  const makeSnapshot = useCallback(() => {
    const canvas = document.createElement("canvas");

    if (videoRef.current) {
      canvas.width = videoRef.current.videoWidth;
      canvas.height = videoRef.current.videoHeight;
      canvas.getContext("2d")?.drawImage(videoRef.current, 0, 0);
      canvas.toBlob((blob) => {
        if (blob) {
          setImage(
            new File([blob], `face-${Date.now()}.jpeg`, { type: "image/jpeg" })
          );
        }
      }, "image/jpeg");
    }
  }, [videoRef.current]);

  return [makeSnapshot, image];
};
