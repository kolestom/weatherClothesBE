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
    it("should return status 400, and an error message if the 2nd testData's Temp interval cover/overlap the 1st's", async() =>{
        
        // given
        const testData1 = {
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
        const testData2 = {
            prefName: "fagypont es afolott vmivel",
            userSub: env.TEST_SUB,
            minTemp: -3,
            maxTemp: 5,
            clothes: {
                cap: true
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
        const first = await request(app)
            .post('/api/pref')
            .set('Authorization', 'Bearer ' + env.TEST_TOKEN)
            .send(testData1)
        const second = await request(app)
            .post('/api/pref')
            .set('Authorization', 'Bearer ' + env.TEST_TOKEN)
            .send(testData2)

        // then
        expect(first.body).toHaveLength(1)
        expect(second.status).toBe(400)
        expect(second.body).toBe("One or more records exist for this temperature interval")
    })
})
describe('GET /pref ', () =>{
    beforeAll(connect);
    beforeEach(cleanData);
    afterAll(disconnect);
    it("should return status 200 and an object that matches the testData properties", async() =>{
        
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
        expect(resp.body[0].prefName).toBe(testData.prefName)
        expect(resp.body[0].maxTemp).toBe(testData.maxTemp)
        expect((await Pref.find({userSub: testUser.sub})).length).toBe(1)
    })
})
describe('GET /pref/:id ', () =>{
    beforeAll(connect);
    beforeEach(cleanData);
    afterAll(disconnect);
    it("should return status 200 and the object that's temperature interval includes the testTemp", async() =>{
        
        // given
        const testData = {
            prefName: "from 0 to 7 C",
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
        const testData2 = {
            prefName: "8 C and above",
            userSub: env.TEST_SUB,
            minTemp: 8,
            maxTemp: 15,
            clothes: {
                cap: true,
                scarf: false,
                jacket: true,
                thermoTop: 9,
                gloves: {
                long: false,
                },
                thermoLeggins: true,
                warmSocks: 2,
            },
            notes: "warmer weather means less clothes needed",
        };
        const testTemp = 5
        const testUser = {
            name: 'Winch Eszter',
            sub: env.TEST_SUB,
            email: "karabely@levelek.hu",
        }
        
        // when
        await User.create(testUser)
        await request(app)
            .post('/api/pref')
            .set('Authorization', 'Bearer ' + env.TEST_TOKEN)
            .send(testData)
        await request(app)
            .post('/api/pref')
            .set('Authorization', 'Bearer ' + env.TEST_TOKEN)
            .send(testData2)
        const resp = await request(app)
            .get(`/api/pref/${testTemp}`)
            .set('Authorization', 'Bearer ' + env.TEST_TOKEN)

        // then
        expect(resp.status).toBe(200)
        expect(typeof resp.body).toBe('object')
        expect(resp.body.notes).toBe(testData.notes)
        expect(resp.body.prefName).toBe(testData.prefName)
        expect(resp.body.maxTemp).toBe(testData.maxTemp)
    })
})
describe('PUT /pref/:id ', () =>{
    beforeAll(connect);
    beforeEach(cleanData);
    afterAll(disconnect);
    it("should return status 200 and an object that matches the testDataUpdate properties. ", async() =>{
        
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
        const testDataUpdate = {
            prefName: "fagypont alatt kicsivel es 10 fokig",
            userSub: env.TEST_SUB,
            minTemp: -1,
            maxTemp: 10,
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
            notes: "mar nem kell annyi ruha",
        };
        const testUser = {
            name: 'Winch Eszter',
            sub: env.TEST_SUB,
            email: "karabely@levelek.hu",
        }
        
        // when
        await User.create(testUser)
        const createResponse = await request(app)
            .post('/api/pref')
            .set('Authorization', 'Bearer ' + env.TEST_TOKEN)
            .send(testData)
        const updateResponse = await request(app)
            .put(`/api/pref/${createResponse.body[0]._id}`)
            .set('Authorization', 'Bearer ' + env.TEST_TOKEN)
            .send(testDataUpdate)

        // then
        expect(updateResponse.status).toBe(200)
        expect(typeof updateResponse.body).toBe('object')
        expect(updateResponse.body.length).toBe(1)
        expect(updateResponse.body[0].notes).toBe(testDataUpdate.notes)
        expect(updateResponse.body[0].prefName).toBe(testDataUpdate.prefName)
        expect(updateResponse.body[0].maxTemp).toBe(testDataUpdate.maxTemp)
        expect(createResponse.body[0]._id).toEqual(updateResponse.body[0]._id)
        expect(await Pref.find({userSub: testUser.sub})).toHaveLength(1)
    })
})
describe('DELETE /pref/:id ', () =>{
    beforeAll(connect);
    beforeEach(cleanData);
    afterAll(disconnect);
    it("should return status 200 and the created preference should be deleted", async() =>{
        
        // given
        const testData = {
            prefName: "from 0 to 7 C",
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
        const createResponse = await request(app)
            .post('/api/pref')
            .set('Authorization', 'Bearer ' + env.TEST_TOKEN)
            .send(testData)
        const deleteResponse = await request(app)
            .delete(`/api/pref/${createResponse.body[0]._id}`)
            .set('Authorization', 'Bearer ' + env.TEST_TOKEN)

        // then
        expect(deleteResponse.status).toBe(200)
        expect(await Pref.find({})).toHaveLength(0)
    })
})