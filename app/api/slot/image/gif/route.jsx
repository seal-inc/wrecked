import sharp from "sharp";
import fs from "fs";
import path from "path";
import { NextResponse } from "next/server";
import gifFrames from "gif-frames";

// Helper function to convert stream to buffer
const streamToBuffer = (stream) => {
  const chunks = [];
  return new Promise((resolve, reject) => {
    stream.on("data", (chunk) => chunks.push(chunk));
    stream.on("end", () => resolve(Buffer.concat(chunks)));
    stream.on("error", (err) => reject(err));
  });
};

const handleRequest = async () => {
  try {
    const gifPath = path.resolve("public/artifacts/init.gif");
    const gifBuffer = fs.readFileSync(gifPath);

    // Extract frames from the GIF
    const frames = await gifFrames({
      url: gifBuffer,
      frames: "all",
      outputType: "png",
    });

    const { width, height } = frames[0].frameInfo;

    // Generate a text overlay as SVG
    const textOverlay = Buffer.from(`
      <svg width="${width}" height="${height}">
        <text x="50%" y="50%" font-size="96" fill="white" text-anchor="middle" alignment-baseline="middle">
          Your Text Here
        </text>
      </svg>
    `);

    // Apply the text overlay to each frame and save them
    const modifiedFrames = await Promise.all(
      frames.map(async (frame, index) => {
        const frameBuffer = await streamToBuffer(frame.getImage());
        const modifiedFrameBuffer = await sharp(frameBuffer)
          .composite([{ input: textOverlay, gravity: "center" }])
          .toBuffer();
        await sharp(modifiedFrameBuffer).toFile(`modifiedFrame-${index}.png`);
        return modifiedFrameBuffer;
      })
    );

    // Reassemble the frames into a new GIF
    const images = modifiedFrames.map((buffer, index) => ({
      input: buffer,
      delay: 100, // Adjust the delay as needed
    }));

    const newGif = await sharp({
      create: {
        width: width,
        height: height,
        channels: 4,
        background: { r: 0, g: 0, b: 0, alpha: 0 },
      },
    })
      .composite(images)
      .gif({ loop: 1 })
      .toBuffer();

    const response = new NextResponse(newGif, {
      headers: { "Content-Type": "image/gif" },
    });
    return response;
  } catch (error) {
    console.error("Internal Server Error", error);
    return new NextResponse(
      JSON.stringify({ message: "Internal Server Error", error }),
      {
        status: 500,
        headers: { "Content-Type": "application/json" },
      }
    );
  }
};

export const GET = handleRequest;
export const POST = handleRequest;
