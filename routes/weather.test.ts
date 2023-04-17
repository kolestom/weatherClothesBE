import request from "supertest";
import { cleanData, disconnect, connect } from "../mongodbMemoryServer/mongodb.memory.test.helper";
import app from "../app";

describe("POST, /weather",  ()=>{
    beforeAll(connect)
    beforeEach(cleanData)
    afterAll(disconnect)
    it('should return status 200 and an object containing data related to the requested location', async () =>{

        // given
        const testData = {
            city: 'Kathmandu',
            country: "Nepal"
        }
    
        // when
        const weatherResponse = await request(app)
            .post('/api/weather')
            .send(testData)
    
        // then
        expect(weatherResponse.status).toBe(200)
        expect(weatherResponse.body.location.name).toBe(testData.city)
        expect(weatherResponse.body.location.country).toBe(testData.country)
        expect(weatherResponse.body.location.lat).toBe(27.72)
        expect(weatherResponse.body.location.lon).toBe(85.32)
    })
})