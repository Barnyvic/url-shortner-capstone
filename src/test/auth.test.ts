import app from "../app";
import request from "supertest";
import { connect } from './database';
import User from "../model/userModel";
import bcrypt from 'bcrypt'



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
        const response = await request(app).post("/auth/register").send({
            email: "text@example.com",
            password: "password",
            fullName: "Test User",
        }).set('user-agent', 'Test User Agent');

        expect(response.status).toBe(201);
        expect(response.body).toHaveProperty("message", "User created successfully");
        expect(response.body).toHaveProperty("data");
    }
    );

    it("should return an error if email is not provided", async () => {
        const response = await request(app).post("/auth/register").send({
            password: "password",
            fullName: "Test User",
        }).set('user-agent', 'Test User Agent');

        expect(response.status).toBe(400);
        expect(response.body).toHaveProperty("error", "All fields are required");
    }
    );

    it("should return an error if password is not provided", async () => {
        const response = await request(app).post("/auth/register").send({
            email: "text@example.com",
            fullName: "Test User",
        }).set('user-agent', 'Test User Agent');

        expect(response.status).toBe(400);
        expect(response.body).toHaveProperty("error", "All fields are required");
    }
    );

    it("should return an error if fullName is not provided", async () => {
        const response = await request(app).post("/auth/register").send({
           email: "text@example.com",
            password: "password",
        }).set('user-agent', 'Test User Agent');

        expect(response.status).toBe(400);
        expect(response.body).toHaveProperty("error", "All fields are required");
    }
    );

    it("should return an error if email already exist", async () => {
       const existingUser = new User({
      email: "text@example.com",
      password: "password",
      fullName: "Existing User",
    });
    await existingUser.save();


    const response = await request(app).post("/auth/register").send({
      email: "text@example.com",
      password: "password",
      fullName: "Test User",
    });

    expect(response.status).toBe(400);
    expect(response.body).toHaveProperty("error", "User already exist");

    await User.findByIdAndDelete(existingUser._id);
    }
    );

    it("should return error if password is not included in the request body when logging in", async () => {
        const response = await request(app).post("/auth/login").send({
                 email: "text@example.com",
        }).set('user-agent', 'Test User Agent');

        expect(response.status).toBe(400);
        expect(response.body).toHaveProperty("error", "All fields are required");
    }
    );

    it("should return error if email is not included in the request body when logging in", async () => {
        const response = await request(app).post("/auth/login").send({
            password: "password",
        }).set('user-agent', 'Test User Agent');

        expect(response.status).toBe(400);
        expect(response.body).toHaveProperty("error", "All fields are required");
    }
    );

    it("should return error if email does not exist when logging in", async () => {
        const response = await request(app).post("/auth/login").send({
                            email: "text@example.com",
            password: "password",
        }).set('user-agent', 'Test User Agent');

        expect(response.status).toBe(400);
        expect(response.body).toHaveProperty("error", "User not  found");

    }
    );

    it("should return error if password is incorrect when logging in", async () => {
        const existingUser = new User({
               email: "text@example.com",
              password: "password",
               fullName: "Existing User",
        });

        await existingUser.save();

        const response = await request(app).post("/auth/login").send({
             email: "text@example.com",
            password: "wrongpassword",
        }).set('user-agent', 'Test User Agent');

        expect(response.status).toBe(400);
        expect(response.body).toHaveProperty("error", "Invalid Password");

        await User.findByIdAndDelete(existingUser._id);

    }
    );

    it("should return a token if all fields are provided when logging in", async () => {
        const password = await bcrypt.hash("password", 10);

        const existingUser = new User({
                          email: "text@example.com",
                            password: password,
                            fullName: "Existing User",
        });

        await existingUser.save();

    const logindetails = {
         email: "text@example.com",
            password: "password",
    }

        const response = await request(app).post("/auth/login").send(logindetails)


        expect(response.status).toBe(200);
        expect(response.body).toHaveProperty("message", "Login successful");
        expect(response.body).toHaveProperty("data");

        await User.findByIdAndDelete(existingUser._id);

    }
    );

});

