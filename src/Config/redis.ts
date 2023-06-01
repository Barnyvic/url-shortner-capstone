import { createClient } from "redis";



const redisUrl = 'rediss://red-chs4qr9mbg582kfr8210:zUG8Tw6sIRflrpqzDyauL9sKxBIN5CnT@oregon-redis.render.com:6379';

const client = createClient({
  url: redisUrl,
});

(async () => {
  await client.connect();
})();

client.on("connect", () => console.log("Redis Client Connected"));
client.on("error", (err) => console.log("Redis Client Connection Error", err));

export default client;
