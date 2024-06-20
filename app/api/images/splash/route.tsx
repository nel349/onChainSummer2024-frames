"use server";
import sharp from "sharp";
import satori from "satori";
import {join} from "path";
import * as fs from "fs";
import styles from './route.module'

const fontPath = join(process.cwd(), "assets/fonts/umbrage2.ttf");
let fontData = fs.readFileSync(fontPath);

export async function GET(req: Request) {      
  try {

    const svg = await satori(
      initialHtml()
      ,
      {
        width: 900, height: 600, fonts: [{
          data: fontData,
          name: "umbrage2",
          style: "normal",
          weight: 100
        }]
      });

    const pngBuffer = await sharp(Buffer.from(svg))
      .toFormat("png")
      .toBuffer();

    return new Response(pngBuffer, {
      headers: {
        "Content-Type": "image/png",
        "Cache-Control": "max-age=10",
      },
    });
  } catch (error) {
    console.error("Error generating image", error);
    return new Response("Error generating image", {status: 500});
  }
}

const initialHtml = () => {
  return (
    <div
      style={{
        ...styles.initialContainer,
        backgroundImage: 'url(https://monkeytrivia.xyz/assets/images/bg.jpg)',
      }}
    >
      <div
        style={styles.initialBackgroundTextContainer}
      >
        <h1
          style={styles.header1}
        >
          Welcome to Monkey Trivia!
        </h1>

        <h1
          style={styles.header2}
        >
          Get ready to test your knowledge. Good luck!
        </h1>

        <h1
          style={styles.header2}
        >
          Press the "Next" button to start the game.
        </h1>
        <h1
          style={styles.header2}
        >
          You have 5 minutes to complete the game.
        </h1>
      </div>

    </div>
  )
}