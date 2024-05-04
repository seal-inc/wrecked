import { frames } from "./frames";
import { Intro } from "@/components/frames/Intro";
import { Play } from "@/components/frames/Play";
import { Result } from "@/components/frames/result";

const handleRequest = frames(async (ctx) => {
  try {
    const gameId = ctx.searchParams.id;
    const action = ctx.searchParams.value;
    // Get the game with the specific id
    if (ctx?.message?.transactionId) {
      return Result({ ctx });
    } else if (action === "Play") {
      return Play({ gameId, ctx });
    } else {
      return Intro({ gameId, ctx });
    }
  } catch (error) {
    console.error(error);
    return error("Something went wrong! Try again later");
  }
});

export const GET = handleRequest;
export const POST = handleRequest;
