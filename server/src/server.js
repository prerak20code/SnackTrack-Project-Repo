import './config/envLoader.js';
import { httpServer } from './socket.js';
import { dbInstance } from './DB/connectDB.js';

const port = process.env.PORT || 4000;

export const connection = await dbInstance.connect();

httpServer.listen(port, () =>
    console.log(`server is listening on port ${port}...`)
);
