import { NextFunction, Request, Response } from 'express'
import jwt from 'jsonwebtoken'
import { env } from '../util/envParser'


const authMW = (req: Request, res: Response, next: NextFunction) => {
    // const header = req.headers["authorization"]
    // if (!header) return res.status(401)
    // const token = header.split(" ")[1]
    // if (!token) return res.status(401)
    // jwt.verify(token, env.JWT_SECRET_KEY, (error:any, decoded:any) => {
    //   if (error) return res.status(401)
    //   res.locals.sub = decoded?.sub
    //   next()
    // })
    
    const header = req.headers.authorization
    if (!header) return res.sendStatus(401)
    const token = header.split(" ")[1]
    if (!token) return res.status(401)
    try {
      const decoded =jwt.verify(token, env.JWT_SECRET_KEY)
      res.locals.sub = decoded?.sub
        next ()

    } catch (err) {
        console.log(err);
        return res.sendStatus(403)

    }
}
 
export default authMW;