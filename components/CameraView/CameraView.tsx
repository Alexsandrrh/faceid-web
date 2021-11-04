import React, { useEffect, useMemo } from "react";
import type { FC, RefObject } from "react";

import type { TStateError, TStateStream } from "../../hooks";
import styles from "./CameraView.module.css";
import clsx from "clsx";

export interface ICameraViewProps {
  /** CSS */
  className?: string;
  /** Ссылка на видео объект*/
  videoRef: RefObject<HTMLVideoElement>;
  /** Стрим видео */
  stream: TStateStream;
  /** Ошибка стрим соединения */
  error: TStateError;
  /** Количество оставшихся секунд */
  seconds: number;
  /** Съемка начата или нет */
  isStarted: boolean;
}

export const CameraView: FC<ICameraViewProps> = ({
  videoRef,
  stream,
  error,
  seconds,
  className,
  isStarted,
}) => {
  const video = useMemo(
    () => <video className={styles.video} ref={videoRef} muted autoPlay />,
    [videoRef]
  );

  /** Установление видео потока для */
  useEffect(() => {
    if (videoRef.current && !error && stream) {
      videoRef.current.srcObject = stream;
    }
    if (error) {
      alert("Упс! Нет видео потока(");
    }
  }, [stream, error, videoRef]);

  return (
    <div
      className={clsx(
        styles.root,
        seconds === 0 && styles.shot,
        isStarted && styles.isStarted,
        className
      )}
    >
      {video}
      <p className={clsx(styles.seconds, isStarted && styles.isStarted)}>
        {seconds}
      </p>
    </div>
  );
};
