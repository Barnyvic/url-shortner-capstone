import { createClient } from "redis";



const redisUrl = process.env.REDIS_URL 

const client = createClient({
  url: redisUrl,
});

(async () => {
  await client.connect();
})();

client.on("connect", () => console.log("Redis Client Connected"));
client.on("error", (err) => console.log("Redis Client Connection Error", err));

export default client;
