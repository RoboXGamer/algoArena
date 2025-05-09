import { myEnvironment } from "./config/env.js";
import app from "./app.js";
import http from "http";
import { initSocketServer } from "./socketServer.js";

const server = http.createServer(app);

initSocketServer(server);

server.listen(myEnvironment.PORT, () => {
  console.log(`Server is running on port ${myEnvironment.PORT}`);
});
