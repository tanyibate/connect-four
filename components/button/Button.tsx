import React from "react";
import styles from "./button-styles.module.scss";

export default function Button({
  color,
  action,
  children,
  iconUrl,
}: {
  children: React.ReactNode;
  action: () => void;
  iconUrl?: string;
  color?: string;
}) {
  const contentSpacing = iconUrl ? "justify-between" : "justify-center";
  const returnColor = (color) => {
    let returnColor = "bg-white";
    switch (color) {
      case "red":
        returnColor = "bg-red";
        break;
      case "yellow":
        returnColor = "bg-yellow";
        break;
      case "dark-purple":
        returnColor = "bg-dark-purple";
        break;
      default:
        returnColor = "bg-white";
        break;
    }
    return returnColor;
  };

  return (
    <button
      className={
        styles.button +
        ` flex items-center ${contentSpacing} ${returnColor(color)} px-5`
      }
      onClick={action}
    >
      {children}
      {iconUrl && <img src={iconUrl} alt="icon" />}
    </button>
  );
}
