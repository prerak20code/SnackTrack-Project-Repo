import './Config/envLoader.js';
import { app } from './app.js';
import { connectDB } from './DB/connectDB.js';
import { generateTransporter } from './mailer.js';
// import { seedDatabase } from './seeder.js';

const PORT = process.env.PORT || 4000;

await connectDB();
await generateTransporter();

// await seedDatabase();

app.listen(PORT, () => console.log(`✅ server listening on port ${PORT}...`));
