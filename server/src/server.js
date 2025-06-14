import './Config/envLoader.js';
import { connectDB } from './DB/connectMongoDB.js';
import { http } from './socket.js';
import { connectRedis } from './DB/connectRedis.js';
// import { seedDatabase } from './seeder.js';

const PORT = process.env.PORT;

// Initialize redisClient to export later
let redisClient;

try {
    // MongoDB connection
    await connectDB();

    // Redis connection
    redisClient = await connectRedis();

    // Optional: await seedDatabase();

    // Start the server
    http.listen(PORT, '0.0.0.0', () =>
        console.log(`✅ server listening on port ${PORT}...`)
    );
} catch (err) {
    console.error('❌ Server startup failed:', err.message);
    process.exit(1);
}

export { redisClient };
