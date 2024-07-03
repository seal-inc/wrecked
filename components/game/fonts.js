import * as fs from "node:fs/promises";
import * as path from "node:path";

export const runtime = "nodejs";

const PixeledFont = fs.readFile(
  path.join(path.resolve(process.cwd(), "public/fonts"), "Pixeled.ttf")
);

const AudiowideRegularFont = fs.readFile(
  path.join(
    path.resolve(process.cwd(), "public/fonts"),
    "Audiowide-Regular.ttf"
  )
);

export const fonts = await Promise.all([
  {
    name: "Pixeled",
    data: await PixeledFont,
    weight: 400,
  },
  {
    name: "Audiowide",
    data: await AudiowideRegularFont,
    weight: 400,
  },
]);
