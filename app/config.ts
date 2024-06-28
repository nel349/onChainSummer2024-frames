

// use NODE_ENV to not have to change config based on where it's deployed
export const NEXT_PUBLIC_URL =
  process.env.NEXT_PUBLIC_TESTING_MODE == 'LOCAL' ? 'http://localhost:3000' : process.env.NEXT_PUBLIC_PROD_URL;
export const BUY_MY_COFFEE_CONTRACT_ADDR = '0xcD3D5E4E498BAb2e08322257569c3Fd4AE439dD6f';
