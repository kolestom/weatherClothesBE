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
  
  if (!result) return res.sendStatus(500)
  
  const user = await User.findOne<UserType>({sub: result.sub})

  if (!user) {
    const newUser = await User.create(result)
    const sessionToken = jwt.sign({name: newUser.name, sub: newUser.sub, email: newUser.email}, env.JWT_SECRET_KEY, {expiresIn: "5h"});
    return res.send({token: sessionToken});
  }
  const updateUser = await User.findOneAndUpdate<UserType>({sub: result.sub},{result}, {new: true})
  if (!updateUser) return res.sendStatus(401)
  
  const sessionToken = jwt.sign({name: updateUser.name, sub: updateUser.sub, email: updateUser.email}, env.JWT_SECRET_KEY, {expiresIn: "5h"});
  res.send({token: sessionToken});
});
export default router;