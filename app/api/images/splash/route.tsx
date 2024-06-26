"use server";
import sharp from "sharp";
import satori from "satori";
import { join } from "path";
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
    return new Response("Error generating image", { status: 500 });
  }
}

const initialHtml = () => {
  return (
    <div
      style={{
        height: '100%',
        width: '100%',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#fff',
        fontSize: 32,
        fontWeight: 600,
      }}
    >
      <svg
        width="75"
        viewBox="0 0 75 65"
        fill="#000"
        style={{ margin: '0 75px' }}
      >
        <path d="M37.59.25l36.95 64H.64l36.95-64z"></path>
      </svg>
      <div style={{ marginTop: 40 }}>Hello, World: Monkey Trivia</div>
    </div>
  )
}