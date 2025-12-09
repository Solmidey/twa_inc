import type { NextApiRequest, NextApiResponse } from "next";
import verifyHandler from "./paystack/verify-transaction";

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  return verifyHandler(req, res);
}
