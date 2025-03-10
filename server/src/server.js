import './Config/envLoader.js'; // will we available to all
import { app } from './app.js';
import { connectDB } from './DB/connectDB.js';

const PORT = process.env.PORT || 4000;

await connectDB();

app.listen(PORT, () => console.log(`server is listening on port ${PORT}...`));
