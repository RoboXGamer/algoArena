import {Server} from 'socket.io';

export const initSocketServer = (server) => {
  const io = new Server(server);
}