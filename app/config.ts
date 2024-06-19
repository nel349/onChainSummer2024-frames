

// use NODE_ENV to not have to change config based on where it's deployed
export const NEXT_PUBLIC_URL =
  process.env.NEXT_TESTING_MODE == 'LOCAL' ? 'http://localhost:3000' : ' https://d857-2600-100f-a101-9e22-598e-623f-f200-2e08.ngrok-free.app';
export const BUY_MY_COFFEE_CONTRACT_ADDR = '0xcD3D5E4E498BAb2e0832257569c3Fd4AE439dD6f';
