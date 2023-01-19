import axios from "axios";

export const getAIResponse = async (board: number[][], player: number) => {
  const response = await axios.post(
    "/api/ai",

    {
      board,
      player,
    }
  );
  return response.data;
};
