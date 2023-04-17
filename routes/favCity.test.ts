import request from "supertest";
import { cleanData, disconnect, connect } from "../mongodbMemoryServer/mongodb.memory.test.helper";
import app from "../app";
import { env } from "../util/envParser";
import { User } from "../models/UserSchema";
import { City, CityType } from "../models/CitySchema";

describe('GET /favCity', () =>{
    beforeAll(connect)
    afterEach(cleanData)
    afterAll(disconnect)
    it("should return status 200 with an array of 2 objects that match the testData", async()=>{

        // given
        const testData1: CityType ={
            city: 'Kathmandu',
            country: 'NP',
            lat: 11,
            lon: 11
        }
        const testData2: CityType ={
            city: 'Baltimore',
            country: 'US',
            lat: 12,
            lon: 12
        }
        const testUser = {
            name: 'Winch Eszter',
            sub: env.TEST_SUB,
            email: "karabely@levelek.hu",
        }
        
        // when
        await User.create(testUser)
        await request(app)
            .post('/api/favCity')
            .set('Authorization', 'Bearer ' + env.TEST_TOKEN)
            .send(testData1)
        const resp = await request(app)
            .post('/api/favCity')
            .set('Authorization', 'Bearer ' + env.TEST_TOKEN)
            .send(testData2)
        
        // then
        expect(resp.status).toBe(200)
        expect(resp.body.length).toBe(2)
        expect(resp.body[0].city).toBe(testData1.city)
        expect(resp.body[1].lat).toBe(testData2.lat)
        expect((await City.find({})).length).toBe(2)
    })
})
describe('POST /favCity', () =>{
    beforeAll(connect)
    afterEach(cleanData)
    afterAll(disconnect)
    it("should return status 200 with an array of 2 objects that match the testData", async()=>{

        // given
        const testData1: CityType ={
            city: 'Kathmandu',
            country: 'NP',
            lat: 11,
            lon: 11
        }
        const testData2: CityType ={
            city: 'Baltimore',
            country: 'US',
            lat: 12,
            lon: 12
        }
        const testUser = {
            name: 'Winch Eszter',
            sub: env.TEST_SUB,
            email: "karabely@levelek.hu",
        }
        
        // when
        await User.create(testUser)
        await request(app)
            .post('/api/favCity')
            .set('Authorization', 'Bearer ' + env.TEST_TOKEN)
            .send(testData1)
        const resp = await request(app)
            .post('/api/favCity')
            .set('Authorization', 'Bearer ' + env.TEST_TOKEN)
            .send(testData2)
        
        // then
        expect(resp.status).toBe(200)
        expect(resp.body.length).toBe(2)
        expect(resp.body[0].city).toBe(testData1.city)
        expect(resp.body[1].lat).toBe(testData2.lat)
        expect((await City.find({})).length).toBe(2)
    })
    it("should return status 406 if the 2nd testData matches the 1st", async()=>{

        // given
        const testData1: CityType ={
            city: 'Kathmandu',
            country: 'NP',
            lat: 11,
            lon: 11
        }
        const testData2: CityType ={
            city: 'Kathmandu',
            country: 'NP',
            lat: 11,
            lon: 11
        }
        const testUser = {
            name: 'Winch Eszter',
            sub: env.TEST_SUB,
            email: "karabely@levelek.hu",
        }
        
        // when
        await User.create(testUser)
        await request(app)
            .post('/api/favCity')
            .set('Authorization', 'Bearer ' + env.TEST_TOKEN)
            .send(testData1)

        const resp = await request(app)
            .post('/api/favCity')
            .set('Authorization', 'Bearer ' + env.TEST_TOKEN)
            .send(testData2)
        
        // then
        expect(resp.status).toBe(406)
    })
    it("should return status 401 if there's no authorization token in the header", async()=>{

        // given
        const testData1: CityType ={
            city: 'Kathmandu',
            country: 'NP',
            lat: 11,
            lon: 11
        }
        const testUser = {
            name: 'Winch Eszter',
            sub: env.TEST_SUB,
            email: "karabely@levelek.hu",
        }
        
        // when
        await User.create(testUser)

        const resp = await request(app)
            .post('/api/favCity')
            .send(testData1)
        
        // then
        expect(resp.status).toBe(401)
    })
})
describe('DELETE /favCity/:id', () =>{
    beforeAll(connect)
    afterEach(cleanData)
    afterAll(disconnect)
    it("should return status 200 and the DB should not contain the testCity", async()=>{

        // given
        const testData1 ={
            city: 'Kathmandu',
            country: 'NP',
            lat: 11,
            lon: 11
        }
        const testUser = {
            name: 'Winch Eszter',
            sub: env.TEST_SUB,
            email: "karabely@levelek.hu",
        }
        
        // when
        await User.create(testUser)
        const testCity = await request(app)
            .post('/api/favCity')
            .set('Authorization', 'Bearer ' + env.TEST_TOKEN)
            .send(testData1)
        const resp = await request(app)
            .delete(`/api/favCity/${testCity.body[0]._id}`)
            .set('Authorization', 'Bearer ' + env.TEST_TOKEN)
        
        // then
        expect(resp.status).toBe(200)
        expect((await City.find({city: testData1.city})).length).toBe(0)
    })
})