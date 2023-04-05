import { z } from "zod"

export const safeParseFc = <Schema extends z.ZodTypeAny>(schema: Schema, data: unknown): z.infer<Schema> | null => {
  // console.log("data",data);
  
  const result = schema.safeParse(data);
  if (!result.success) {
    console.log(result.error);
    return null
  }
  return result.data;
}


