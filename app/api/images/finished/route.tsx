"use server";
import sharp from "sharp";
import satori from "satori";
import {join} from "path";
import * as fs from "fs";
import styles from './route.module'
import { FrameSession } from "../../../game-domain/frame-session";
import { getFrameSession } from "../../../mongo/frame-session";
import { State } from "../../..";

const fontPath = join(process.cwd(), "assets/fonts/umbrage2.ttf");
let fontData = fs.readFileSync(fontPath);

export async function GET(req: Request) {    
  
  try {

    const {searchParams} = new URL(req.url);
    const frameId = searchParams.get("frameId") ?? "";
    const score = searchParams.get("score") ?? "0";
    const {numberOfQuestions} = await getFrameSession(frameId);

    console.log('score:', score);
    console.log('numberOfQuestions:', numberOfQuestions);

    // console.log('frameId:', frameId);
    // console.log('questionPage:', questionPage);
    
    const svg = await satori(
      EndHtml({score: parseInt(score)})
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

const EndHtml = (state: State) => {
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
          Game Over!
        </h1>

        <h1
          style={styles.header2}
        >
          Score: {state.score}%
        </h1>

        <h1
          style={styles.header2}
        >
          Click on Submit Score to be eligible for prizes!
        </h1>
        <h1
          style={styles.header2}
        >
          Compete with your friends!
        </h1>
      </div>

    </div>
  )
}