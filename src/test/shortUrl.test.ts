import app from "../app";
import request from "supertest";
import { connect } from './database';




describe('Integration Test - ShortUrl', () => {
  
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

  it('should return 400 if the longUrl is invalid', async () => {
    const response = await request(app).post('/api/v1/shorturl/create').send({
      longUrl: 'invalidUrl',
    });

    expect(response.status).toBe(400);
    expect(response.body).toBe('Invalid Url Provided....');
  }
  );

  it('should return 400 if the longUrl is not provided', async () => {
    const response = await request(app).post('/api/v1/shorturl/create').send({});

    expect(response.status).toBe(400);
    expect(response.body).toBe('Invalid Url Provided....');
  }
  );

  it('should return 200 if the longUrl is valid', async () => {
    const response = await request(app).post('/api/v1/shorturl/create').send({
      longUrl: 'https://www.google.com',
      customedUrl: 'google',
    }).set('user-agent', 'Test User Agent');

    expect(response.status).toBe(201);
    expect(response.body).toHaveProperty('message', 'Url Created Successfully.');
    expect(response.body).toHaveProperty('data');
  }
  );

  it('should return 200 if the longUrl is valid and customedUrl is not provided', async () => {
    const response = await request(app).post('/api/v1/shorturl/create').send({
      longUrl: 'https://www.google.com',
    }).set('user-agent', 'Test User Agent');

    expect(response.status).toBe(201);
    expect(response.body).toHaveProperty('message', 'Url Created Successfully.');
    expect(response.body).toHaveProperty('data');
  }
  );

  it('should return 200 if the longUrl is valid and customedUrl is not provided and user is not in the database', async () => {
    const response = await request(app).post('/api/v1/shorturl/create').send({
      longUrl: 'https://www.google.com',
    }).set('user-agent', 'Test User Agent');

    expect(response.status).toBe(201);
    expect(response.body).toHaveProperty('message', 'Url Created Successfully.');
    expect(response.body).toHaveProperty('data');
  }
  );

  it('should return 200 if the longUrl is valid and customedUrl is not provided and user is in the database', async () => {
    const response = await request(app).post('/api/v1/shorturl/create').send({
      longUrl: 'https://www.google.com',
    }).set('user-agent', 'Test User Agent');

    expect(response.status).toBe(201);
    expect(response.body).toHaveProperty('message', 'Url Created Successfully.');
    expect(response.body).toHaveProperty('data');
  }
  );

  it("should redirect to the longUrl if the shortUrl is valid", async () => {
      const shortCodeID = 'google';
      const response = await request(app).get(`/api/v1/shorturl/${shortCodeID}`);

      expect(response.status).toBe(302);
      expect(response.header.location).toBe('https://www.google.com');
  }
  );

  it("should return 404 if the shortUrl is invalid", async () => {
      const shortCodeID = 'invalidShortUrl';
      const response = await request(app).get(`/api/v1/shorturl/${shortCodeID}`);

      expect(response.status).toBe(404);
    expect(response.body).toHaveProperty('message', 'Url not found');
  }
  );


  // it("should get the qrcode for a short URL", async () => {
  //     const shortCodeID = 'google';
  //     const response = await request(app).get(`/api/v1/shorturl/qrcode/${shortCodeID}`);

  //     expect(response.status).toBe(200);
  //     expect(response.header['content-type']).toBe('image/png');
  // }
  // );

});
