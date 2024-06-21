import type { Metadata } from 'next';
import { NEXT_PUBLIC_URL } from './config';
import * as envEnc from "@chainlink/env-enc";
import { GamePhase } from '.';

envEnc.config();


const imageUrl = `${NEXT_PUBLIC_URL}/api/images/splash`;

export const metadata: Metadata = {
  title: 'zizzamia.xyz',
  description: 'LFG',
  openGraph: {
    title: 'zizzamia.xyz',
    description: 'LFG',
    images: [`${NEXT_PUBLIC_URL}/park-1.png`],
  },
  other: {}, // Initialize with an empty object
};

(async () => {
  const { getFrameMetadata } = await import('@coinbase/onchainkit/frame');
  const frameMetadata = getFrameMetadata({
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
    postUrl: `${NEXT_PUBLIC_URL}/api/frame?frameId=66249df51c3fd6482546a4c1&gamePhase=${GamePhase.Initial}`,
  });

  metadata.other = {
    ...frameMetadata,
  };
})();

export default function Page() {
  return (
    <>
      <h1>zizzamia.xyz</h1>
      <h2>{NEXT_PUBLIC_URL}</h2>
    </>
  );
}
