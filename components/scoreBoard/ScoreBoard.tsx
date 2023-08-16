import React from "react";
import { Player } from "../../pages/game";

export default function ScoreBoard({
  large,
  player,
}: {
  large?: boolean;
  player: Player;
}) {
  let iconClassNames;
  let scoreClassNames;
  let containerClass;

  if (player.number === 1 && large) {
    iconClassNames =
      "absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2";
    scoreClassNames = "absolute w-full h-full text-center left-0 top-0 py-8";
    containerClass = "mr-12";
  } else if (player.number === 2 && large) {
    iconClassNames =
      "absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2";
    scoreClassNames = "absolute w-full h-full text-center left-0 top-0 py-8";
    containerClass = "ml-12";
  } else if (player.number === 1 && !large) {
    iconClassNames =
      "absolute top-1/2 left-0 -translate-x-1/2 -translate-y-1/2";
    scoreClassNames =
      "flex flex-col justify-center absolute w-full h-full text-center left-0 top-0 md:flex md:items-center md:pr-12 md:gap-x-8 md:flex-row";
  } else if (player.number === 2 && !large) {
    iconClassNames =
      "absolute top-1/2 left-full -translate-x-1/2 -translate-y-1/2";
    scoreClassNames =
      "flex flex-col justify-center absolute w-full h-full text-center left-0 top-0 md:items-center md:pl-12 md:gap-x-8 md:flex-row-reverse";
  }

  return (
    <div
      className={`w-[130px] h-[76px] md:w-[272px] md:h-[100px] xl:w-[141px] xl:h-[160px] relative ${
        large ? containerClass : ""
      }`}
    >
      <img
        src={`/assets/images/scoreboard-${large ? "large" : "small"}.png`}
        alt=""
        className="h-full w-full"
      />
      <div className={scoreClassNames}>
        <div className="text-base md:text-xl">{player.name}</div>
        <div className="text-3xl md:text-6xl">{player.score}</div>
      </div>
      <img
        src={`/assets/images/player-${player.number === 1 ? "one" : "two"}.svg`}
        alt=""
        className={iconClassNames}
      />
    </div>
  );
}
