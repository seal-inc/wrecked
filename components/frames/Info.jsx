import { Button } from "frames.js/next";
import { fonts } from "../game/fonts";

export const Info = async ({ player }) => {
  const firstTime = player.first_time;
  const imageUrl = `${process.env.APP_URL}/artifacts/${
    firstTime ? "info-new-player" : "info"
  }.png`;

  return {
    image: imageUrl,
    buttons: [
      <Button action="post" target={{ query: { value: "Play" } }}>
        Play
      </Button>,
    ],
    imageOptions: {
      fonts: fonts,
      aspectRatio: "1:1",
    },
  };
};
