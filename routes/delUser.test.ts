import request from "supertest";
import { cleanData, disconnect, connect } from "../mongodbMemoryServer/mongodb.memory.test.helper";
import app from "../app";
import { env } from "../util/envParser";
import { User } from "../models/UserSchema";
import { City, CityType } from "../models/CitySchema";
import { Pref } from "../models/PrefSchema";

describe('DELETE /delUser ', () =>{
    beforeAll(connect);
    beforeEach(cleanData);
    afterAll(disconnect);
    it("should return status 200, and all user related data should be removed from the DB", async() =>{
        
        // given
        const testPref = {
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
        const testCity: CityType ={
            city: 'Kathmandu',
            country: 'NP',
            lat: 11,
            lon: 11
        }
        
        // when
        await User.create(testUser)
        await request(app)
            .post('/api/favCity')
            .set('Authorization', 'Bearer ' + env.TEST_TOKEN)
            .send(testCity)
        await request(app)
            .post('/api/pref')
            .set('Authorization', 'Bearer ' + env.TEST_TOKEN)
            .send(testPref)
        const resp = await request(app)
            .delete('/api/delUser')
            .set('Authorization', 'Bearer ' + env.TEST_TOKEN)

        // then
        expect(resp.status).toBe(200)
        expect(await Pref.find({})).toHaveLength(0)
        expect((await City.find({})).length).toBe(0)
        expect((await User.find({sub: env.TEST_SUB})).length).toBe(0)
    })
    it("should return status 200, and all user related data should be removed from the DB (no cities) ", async() =>{
        
        // given
        const testPref = {
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
        await request(app)
            .post('/api/pref')
            .set('Authorization', 'Bearer ' + env.TEST_TOKEN)
            .send(testPref)
        const resp = await request(app)
            .delete('/api/delUser')
            .set('Authorization', 'Bearer ' + env.TEST_TOKEN)

        // then
        expect(resp.status).toBe(200)
        expect(await Pref.find({})).toHaveLength(0)
        expect((await User.find({sub: env.TEST_SUB})).length).toBe(0)
    })
    it("should return status 200, and the user should be deleted (no preferences, no cities) ", async() =>{
        
        // given
        const testUser = {
            name: 'Winch Eszter',
            sub: env.TEST_SUB,
            email: "karabely@levelek.hu",
        }
        
        // when
        await User.create(testUser)
        const resp = await request(app)
            .delete('/api/delUser')
            .set('Authorization', 'Bearer ' + env.TEST_TOKEN)

        // then
        expect(resp.status).toBe(200)
        expect((await User.find({sub: env.TEST_SUB})).length).toBe(0)
    })
})