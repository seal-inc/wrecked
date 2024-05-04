import * as fs from "node:fs/promises";
import * as path from "node:path";

export const runtime = "nodejs";

const PressStart2PRegularFont = fs.readFile(
  path.join(
    path.resolve(process.cwd(), "public/fonts"),
    "PressStart2P-Regular.ttf"
  )
);

const MonotonRegularFont = fs.readFile(
  path.join(path.resolve(process.cwd(), "public/fonts"), "Monoton-Regular.ttf")
);

const AudiowideRegularFont = fs.readFile(
  path.join(
    path.resolve(process.cwd(), "public/fonts"),
    "Audiowide-Regular.ttf"
  )
);

export const fonts = await Promise.all([
  {
    name: "Press Start 2P",
    data: await PressStart2PRegularFont,
    weight: 400,
  },
  {
    name: "Monoton",
    data: await MonotonRegularFont,
    weight: 400,
  },
  {
    name: "Audiowide",
    data: await AudiowideRegularFont,
    weight: 400,
  },
]);
