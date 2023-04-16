import request from "supertest";
import { cleanData, disconnect, connect } from "../mongodbMemoryServer/mongodb.memory.test.helper";
import app from "../app";
import { env } from "../util/envParser";
import { User } from "../models/UserSchema";
import { Pref } from "../models/PrefSchema";

describe('POST /pref ', () =>{
    beforeAll(connect);
    beforeEach(cleanData);
    afterAll(disconnect);
    it("should return status 200, the response body should be an object. This object's notes property should match the testData ", async() =>{
        
        // given
        const testData = {
            prefName: "fagypont es afolott vmivel",
            userSub: env.TEST_SUB,
            minTemp: 0,
            maxTemp: 7,
            clothes: {
                cap: true,
                scarf: false,
                jacket: true,
                thermoTop: 44,
                gloves: {
                long: false,
                },
                thermoLeggins: true,
                warmSocks: 2,
            },
            notes: "kell a teljes anzug",
        };
        const testUser = {
            name: 'Winch Eszter',
            sub: env.TEST_SUB,
            email: "karabely@levelek.hu",
        }
        
        // when
        await User.create(testUser)
        const resp = await request(app)
            .post('/api/pref')
            .set('Authorization', 'Bearer ' + env.TEST_TOKEN)
            .send(testData)

        // then
        expect(resp.status).toBe(200)
        expect(typeof resp.body).toBe('object')
        expect(resp.body.length).toBe(1)
        expect(resp.body[0].notes).toBe(testData.notes)
        expect((await Pref.find({userSub: testUser.sub})).length).toBe(1)
    })
})