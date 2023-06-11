import app from "../app";
import request from "supertest";
import { connect } from './database';


describe('Integration Test - Auth', () => {

    let connection: any;
    
    beforeAll(async () => {
        connection = await connect();
    } );
    
    afterEach(async () => {
        await connection.cleanup();
    }
    );
    
    afterAll(async () => {
        await connection.disconnect();
    }
    );

    it("should create a new user if all fields are provided", async () => {
        const response = await request(app).post("/api/v1/auth/register").send({
            email: "text@example.com",
            password: "password",
            fullName: "Test User",
        }).set('user-agent', 'Test User Agent');

        expect(response.status).toBe(201);
        expect(response.body).toHaveProperty("message", "User created successfully");
        expect(response.body).toHaveProperty("data");
    }
    );
});