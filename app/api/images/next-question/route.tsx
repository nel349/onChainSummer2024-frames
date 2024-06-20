"use server";
import sharp from "sharp";
import satori from "satori";
import {join} from "path";
import * as fs from "fs";
import styles from './route.module'
import { Question } from "../../../game-domain/question";
import { FrameSession } from "../../../game-domain/frame-session";
import { getFrameSession, getQuestions } from "../../../mongo/frame-session";

const fontPath = join(process.cwd(), "assets/fonts/umbrage2.ttf");
let fontData = fs.readFileSync(fontPath);

export async function GET(req: Request) {      
  try {

    const {searchParams} = new URL(req.url);
    const questionPage = parseInt(searchParams.get("page") ?? "0");
    const frameId = searchParams.get("frameId") ?? "";

    // console.log('frameId:', frameId);
    // console.log('questionPage:', questionPage);

    const frameSession = await getFrameSession(frameId);
    const questions = await _getQuestions(frameSession);

    const svg = await satori(
      questionHtml(questionPage, questions, frameSession)
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

const getQuestion = (questions: Question[], index: number) => {
  return questions.length > 0 && questions[index] ?
    `${questions[index].question}` : 'empty'
}

const isCorrectAnswer = (questions: Question[], index: number, optionPicked: number) => {
  if (questions && questions.length > 0 &&
    questions[index] &&
    questions[index].options) {

    const optionPickedValue = questions[index].options[optionPicked];
    questions[index].player_answer = optionPickedValue;
    // console.log('Answer:', questions[index].answer)
    // console.log('Option picked:', questions[index].options[optionPicked])
    return optionPickedValue === questions[index].answer
  }
  return false
}

const getOptions = (questions: Question[], index: number) => {
  return questions.length > 0 && questions[index] &&
    questions[index].options ? questions[index].options : []
}

const getOptionText = (questions: Question[], index: number, optionIndex: number) => {
  const option = questions?.[index]?.options?.[optionIndex];
  return option ? option : '';
};

const footer = (questionIndex: number, session: FrameSession) => {
  return <p style={styles.footer}>Question {questionIndex + 1} / {session?.numberOfQuestions}</p>
}

const _getQuestions = async (frameSession: FrameSession) => {

  // let frameSession: FrameSession = {} as FrameSession;
  let questions = [] as Question[];
  // let solanaAddress = '';

  try {
    // frameSession = await getFrameSession(frameSession.frameId);
    // console.log('frame session: ', frameSession)
    // previousState.numberOfQuestions = previousState.frameSession.numberOfQuestions;
    // if (!frameSession) {
    //   console.log('No frame session found')
    // }

    questions = await getQuestions(frameSession.metaphor_id);
    // const client = new NeynarAPIClient(process.env.NEYNAR_API_KEY ?? "");

    // console.log("api key:", process.env.NEYNAR_API_KEY)

    // const fid = frameData?.fid ?? 1;

    // const userBulkResponse = client.fetchBulkUsers([fid]);

    // console.log('user bulk response:', (await userBulkResponse).users[0]);

    // solanaAddress = (await userBulkResponse).users[0].verified_addresses.sol_addresses[0];

    // console.log('Solana address:', solanaAddress);
    // Get questions given the metaphor id
    return questions;
  }
  catch (e) {
    console.log('error', e)
    return [];
  }
}

const questionHtml = (questionIndex: number, questions: Question[], session: FrameSession) => {
  return (
    <div
      style={styles.container}
    >
      <h2
        style={styles.question}
      >
        {getQuestion(questions, questionIndex)}
      </h2>
      <div
        style={styles.optionsContainer}
      >
        <div
          style={styles.option}
        >
          <div
            style={{
              ...styles.optionIndicator,
              backgroundColor: "lightgreen",
            }}
          />
          <p
            style={styles.optionText}
          >
            {getOptionText(questions, questionIndex, 0)}
          </p>
        </div>
        <div
          style={styles.option}
        >
          <div
            style={{
              ...styles.optionIndicator,
              backgroundColor: "#EF4444"
            }}
          />
          <p
            style={styles.optionText}
          >
            {getOptionText(questions, questionIndex, 1)}
          </p>
        </div>
        <div
          style={styles.option}
        >
          <div
            style={{
              ...styles.optionIndicator,
              backgroundColor: "#3B82F6",
            }}
          />
          <p
            style={styles.optionText}
          >
            {getOptionText(questions, questionIndex, 2)}
          </p>
        </div>
        {getOptionText(questions, questionIndex, 3) &&
          <div
            style={styles.option}
          >
            <div
              style={{
                ...styles.optionIndicator,
                backgroundColor: "#F59E0B"
              }}
            />
            <p
              style={styles.optionText}
            >
              {getOptionText(questions, questionIndex, 3)}
            </p>
          </div>}
      </div>
      {footer(questionIndex, session)}
    </div>
  )
}