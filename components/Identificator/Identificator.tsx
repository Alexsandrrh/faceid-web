import React from "react";
import type { FC } from "react";
import clsx from "clsx";

import styles from "./Identificator.module.css";

export enum IDENTIFICATOR_VIEW {
  /** Зеленое отображение */
  green = "green",
  /** Желтое отображение */
  yellow = "yellow",
  /** Красное отображение */
  red = "red",
}

/** Props */
export interface IIdentificatorProps {
  /** Цвет отображения */
  view: IDENTIFICATOR_VIEW;
}

/** Component */
export const Identificator: FC<IIdentificatorProps> = ({ view, children }) => (
  <div className={clsx(styles.root, styles[`${view}View`])}>{children}</div>
);
