import type { NextPage } from "next";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import clsx from "clsx";
import axios from "axios";

import styles from "../styles/Home.module.css";
import { CameraView } from "../components/CameraView";
import { useMakeSnapshot, useMediaDevice } from "../hooks";
import { Identificator, IDENTIFICATOR_VIEW } from "../components/Identificator";

/** Количество секунд ожидания */
const INITIAL_SECONDS_VALUE: number = 5;

/** Образы значений */
const VIEWS = Object.values(IDENTIFICATOR_VIEW);

/** Компонент */
const Home: NextPage = () => {
  /** Состояние секунд */
  const [seconds, setSeconds] = useState<number>(INITIAL_SECONDS_VALUE);

  /** Состояние старта съемки */
  const [started, setStarted] = useState<boolean>(false);

  /** Состояние полученных значений */
  const [itemsIds, setItemsIds] = useState<number[] | null>(null);

  /** Ссылка на тег video */
  const videoRef = useRef<HTMLVideoElement>(null);

  /** Получаем медиа данные с камеры */
  const [stream, error] = useMediaDevice({
    video: {
      width: 500,
      height: 500,
    },
  });

  /** Создание snapshot пользователя */
  const [makeSnapshot, image] = useMakeSnapshot(videoRef);

  /** Счетчик секунд */
  useEffect(() => {
    const interval = setInterval(() => {
      setSeconds((state) => (state <= 0 || !started ? state : state - 1));
    }, 1150);

    return () => {
      clearInterval(interval);
    };
  }, [started]);

  /** Сброс счетчика и создание фотки */
  useEffect(() => {
    if (seconds === 0) {
      makeSnapshot();
    }
  }, [seconds]);

  /** Отсылаем картинку на сервер */
  useEffect(() => {
    if (image) {
      const formData = new FormData();
      formData.append("file", image);
      axios
        .post<[number, number, number]>("http://127.0.0.1:5000/", formData)
        .then(({ data }) => {
          setItemsIds(data);
          setSeconds(INITIAL_SECONDS_VALUE);
        });
    }
  }, [image]);

  /** Активация съемки пользователя */
  const handleClickStart = useCallback(() => {
    setStarted((state) => !state);

    if (started && seconds !== INITIAL_SECONDS_VALUE) {
      setSeconds(INITIAL_SECONDS_VALUE);
    }

    if (!started) {
      setItemsIds(null);
    }
  }, [started, seconds]);

  /** Список полученных значений от сервера */
  const ResultItems = useCallback(
    () => (
      <>
        {itemsIds &&
          itemsIds.map((id, index) => (
            <Identificator key={id} view={VIEWS[index]}>
              {id}
            </Identificator>
          ))}
      </>
    ),
    [itemsIds]
  );

  return (
    <div className={styles.root}>
      <CameraView
        videoRef={videoRef}
        stream={stream}
        error={error}
        seconds={seconds}
        isStarted={started}
        className={styles.cameraView}
      />

      <div className={styles.result}>
        <ResultItems />
      </div>

      <button
        className={clsx(styles.buttonToggle, started && styles.isActive)}
        type="button"
        onClick={handleClickStart}
      >
        {started ? "Остановить съёмку" : "Начать съёмку"}
      </button>
    </div>
  );
};

export default Home;
