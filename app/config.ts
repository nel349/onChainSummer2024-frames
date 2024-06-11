// use NODE_ENV to not have to change config based on where it's deployed
export const NEXT_PUBLIC_URL =
  process.env.TESTING_MODE == 'LOCAL' ? 'https://15a2-2600-1700-69f0-6e50-5a-787f-3002-4de9.ngrok-free.app/' : 'https://15a2-2600-1700-69f0-6e50-5a-787f-3002-4de9.ngrok-free.app/';
export const BUY_MY_COFFEE_CONTRACT_ADDR = '0xcD3D5E4E498BAb2e0832257569c3Fd4AE439dD6f';
