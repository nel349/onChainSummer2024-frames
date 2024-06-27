import type { Metadata, ResolvingMetadata } from 'next';
import { NEXT_PUBLIC_URL } from './config';
import * as envEnc from "@chainlink/env-enc";
envEnc.config();

const imageUrl = `${NEXT_PUBLIC_URL}/api/images/splash`;

type Props = {
  params: { id: string }
  searchParams: { [key: string]: string | string[] | undefined }
}

export async function generateMetadata(  
  { params, searchParams }: Props,
  parent: ResolvingMetadata
): Promise<Metadata> {
  const { getFrameMetadata } = await import('@coinbase/onchainkit/frame');
  

  console.log("query: ", params)
  console.log("searchParams: ", searchParams)
  // console.log("parent: ", parent)

  const { frameId, gamePhase } = searchParams;

  const frameMetadata = await getFrameMetadata({
    buttons: [
      {
        label: 'Start Test', // Start the game
      },
      {
        action: 'tx',
        label: 'Send Base Sepolia',
        target: `${NEXT_PUBLIC_URL}/api/tx`,
        postUrl: `${NEXT_PUBLIC_URL}/api/tx-success`,
      },
      {
        action: 'tx',
        label: 'Mint NFT',
        target: `${NEXT_PUBLIC_URL}/api/txMint`,
        postUrl: `${NEXT_PUBLIC_URL}/api/tx-success`,
      }
    ],
    image: {
      src: imageUrl,
      aspectRatio: '1.91:1',
    },
    postUrl: `${NEXT_PUBLIC_URL}/api/frame?frameId=${frameId}&gamePhase=${gamePhase}`,
  });

  return {
    title: 'zizzamia.xyz',
    description: 'LFG',
    openGraph: {
      title: 'zizzamia.xyz',
      description: 'LFG',
      images: [`${NEXT_PUBLIC_URL}/park-1.png`],
    },
    other: {
      ...frameMetadata,
    },
  };
}

export default function Page() {
  return (
    <>
      <h1>zizzamia.xyz</h1>
      <h2>{NEXT_PUBLIC_URL}</h2>
    </>
  );
}
