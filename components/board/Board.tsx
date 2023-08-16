import React from "react";
import {
  smallCounterRed,
  smallCounterYellow,
  largeCounterRed,
  largeCounterYellow,
} from "../../utils/constants";

export default function Board({ board }) {
  return (
    <div className="absolute w-[314px] md:w-[592px] min-w-[314px] md:min-w-[592px] h-[268px] md:h-[504px] top-[10px] left-[10px] md:top-[20px] md:left-[20px]  grid grid-cols-7 grid-rows-6 gap-3 md:gap-6 z-[-1]">
      {board.map((column, xIndex) => {
        return column.map((token, yIndex) => {
          return (
            <div key={`${xIndex + yIndex}`} className="relative">
              {token === 1 || token === 3 ? (
                <img
                  src={smallCounterRed}
                  srcSet={`${smallCounterRed} 34w, ${largeCounterRed} 64w`}
                  sizes="(max-width: 767px) 34px, 64px"
                  alt=""
                />
              ) : token === 2 || token === 4 ? (
                <img
                  src={smallCounterYellow}
                  srcSet={`${smallCounterYellow} 34w, ${largeCounterYellow} 64w`}
                  sizes="(max-width: 767px) 34px, 64px"
                  alt=""
                />
              ) : (
                ""
              )}
              {(token === 3 || token === 4) && (
                <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 border-4 md:border-8 border-white border-solid rounded-full h-1/2 w-1/2"></div>
              )}
            </div>
          );
        });
      })}
    </div>
  );
}
