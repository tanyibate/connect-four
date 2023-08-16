import React from "react";
import Button from "../button/Button";
import { useRouter } from "next/router";
import styles from "./menu-styles.module.scss";

export default function Menu({ continueGame, restartGame }) {
  const router = useRouter();
  const goToMainMenu = () => {
    router.push("/");
  };

  return (
    <div className="w-full h-full bg-black bg-opacity-25 fixed z-50 flex items-center justify-center">
      <div
        className={"bg-dark-purple px-4 py-8 rounded-xl pb-12 " + styles.menu}
      >
        <div className="text-6xl my-6 text-center text-white">PAUSE</div>
        <div className="space-y-4">
          <Button color="white" action={continueGame}>
            CONTINUE GAME
          </Button>
          <Button color="white" action={restartGame}>
            RESTART
          </Button>
          <Button color="red" action={goToMainMenu}>
            QUIT GAME
          </Button>
        </div>
      </div>
    </div>
  );
}
