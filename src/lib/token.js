import { LAMPORTS_PER_SOL } from "@solana/web3.js";



 const BACKEND_URL = process.env.VITE_BACKEND || "http://localhost:3001";

 export const getSliceReward = (score) => {

  if (score < 10) return 0; // Minimum score required
  if (score < 20) return 0.005 * LAMPORTS_PER_SOL; // 0.005 SOL
  if (score < 50) return 0.01 * LAMPORTS_PER_SOL; // 0.01 SOL
  if (score < 100) return 0.03 * LAMPORTS_PER_SOL; // 0.03 SOL
  return 0.05 * LAMPORTS_PER_SOL; // 0.05 SOL for top scores
};

export async function transferTokens(playerAddress, score) {
  try {
    const jwtoken = localStorage.getItem("gameToken");
    if (!jwtoken) {
      throw new Error("No auth token found");
    }

    const response = await fetch(`${BACKEND_URL}/api/transfer-tokens`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${jwtoken}`,
      },
      body: JSON.stringify({ playerAddress, score }),
    });

    const data = await response.json();

    if (!response.ok) {
      if (response.status === 401) {
        localStorage.removeItem("gameToken");
        throw new Error("Auth expired");
      }
      throw new Error(data.error || data.details || "Failed to transfer tokens");
    }

    return data.signature;
  } catch (error) {
    console.error("Error transferring tokens", error);
    throw new Error(error.message || "Failed to transfer tokens");
  }
}