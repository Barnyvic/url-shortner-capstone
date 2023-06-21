import app from "../app";
import request from "supertest";
import { generateToken } from "../helper/JwtHelper";
import { user1 } from "./test-helpers/user-data";
import User from "../model/userModel";
import bcrypt from 'bcrypt'


describe('Integration Test - Url', () => {

   let token: string;
  let existingUser: any;



  it("should create a new url if all fields are provided", async () => {

    token = await generateToken({
        id: existingUser._id,
        email: existingUser.email,
    });

console.log(existingUser)
    const response = await request(app)
      .post("/create")
      .send({
        longUrl: 'https://example.com',
        customedUrl: 'example',
      })
      .set('Authorization', `Bearer ${token}`);

    expect(response.status).toBe(201);
    expect(response.body).toHaveProperty("message", "Url Created Successfully.");
    expect(response.body).toHaveProperty("data");
  },90000);
});
