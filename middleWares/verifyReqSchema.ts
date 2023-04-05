import { safeParseFc } from "../util/safeParseFc"
import express, { NextFunction, Request, Response } from "express"
import { z } from "zod"

export const verifyReqSchema = <Schema extends z.ZodTypeAny>(schema: Schema) => (req: Request, res: Response, next: NextFunction) => {
  const result = safeParseFc(schema, req.body)
  if (!result) return res.sendStatus(400)
  next()
}
