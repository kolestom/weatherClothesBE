import express, { Express, Request, Response } from "express";
import jwt from "jsonwebtoken";
import { verifyReqSchema } from "../middleWares/verifyReqSchema";
import { safeParseFc } from "../util/safeParseFc";
import { z } from "zod";
import { getIdToken } from "../api/google";
import { User, UserType} from "../models/UserSchema"
import { env } from "../util/envParser";

const router = express.Router();

if (!env.JWT_SECRET_KEY) throw "Secret Key is required";

const LoginRequestSchema = z.object({
  code: z.string(),
});
type LoginRequest = z.infer<typeof LoginRequestSchema>;
  
const Payload = z.object({
  name: z.string(),
  sub: z.string(),
  email: z.string().email(),
});
type Payload = z.infer<typeof Payload>;

router.post("/", verifyReqSchema(LoginRequestSchema), async (req: Request, res: Response) => {

  const loginRequest:LoginRequest = req.body
  const idToken = await getIdToken(loginRequest.code);
  if (!idToken) return res.status(401);
  const payload: unknown = jwt.decode(idToken);
  const result = safeParseFc(Payload, payload);
  
  if (!result) {
    return res.sendStatus(500);
  }
  
  const user = await User.findOne<UserType>({sub: result.sub})

  
  if (!user) {
    const newUser = await User.create(result)
    const sessionToken = jwt.sign({newUser}, env.JWT_SECRET_KEY, {expiresIn: "5m"});
    return res.send({sessionToken, username: newUser.name});
  }
  // kell update, ha vmilye valtozna a user-nek
  const sessionToken = jwt.sign({user}, env.JWT_SECRET_KEY, {expiresIn: "5m"});
  res.send({sessionToken, username: user.name});
});
export default router;