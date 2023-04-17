import supertest from "supertest"
import app from "../app"
import { connect, disconnect, cleanData } from "../mongodbMemoryServer/mongodb.memory.test.helper"
import { User } from "../models/UserSchema"
import { env } from "../util/envParser"

jest.mock("../api/google")
import { getIdToken } from "../api/google"

describe('POST /login ', () =>{
    beforeAll(connect)
    afterEach(cleanData)
    afterAll(disconnect)
    it("should return 200 and save user to the DB", async () => {
        // given
        const code = "as56df5w5a8d823djak"
        const token = env.TEST_TOKEN
        const mockedGetIdToken = jest.mocked(getIdToken)
        mockedGetIdToken.mockReturnValueOnce(Promise.resolve(token))
        // when
        const response = await supertest(app).post("/api/login").send({code})
        // then
        const dbContent = await User.find()
        expect(dbContent).toHaveLength(1)
        expect(response.status).toBe(200)
    })
})