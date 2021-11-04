// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from "next";

type Data = [number, number, number];

const getInt = () => Math.round(Math.random() * 100);

export default function handler(
  req: NextApiRequest,
  res: NextApiResponse<Data>
) {
  res.status(200).json([getInt(), getInt(), getInt()]);
}
