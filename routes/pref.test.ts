
import request from "supertest";
import { cleanData, disconnect, connect } from "../mongodbMemoryServer/mongodb.memory.test.helper";
import app from "../app";
import { env } from "../util/envParser";

describe('POST /pref ', () =>{
    beforeAll(connect);
    beforeEach(cleanData);
    afterAll(disconnect);
    it("should return 200 if the temperature interval doesn't exist in the DB", async() =>{
        // given
        const testData = {
            prefName: "updatelt MASODIK",
            userSub: 114960804292480580000,
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
            notes: "tesztelunk serenyen, de nagyon NAGYON NAGYON",
        };

       // when
       const response = await request(app)
            .post('/api/pref')
            .set('Authorization', 'Bearer ' + env.TEST_TOKEN)
            .send(testData)

        // then
        expect(response.status).toBe(200)
    })
})