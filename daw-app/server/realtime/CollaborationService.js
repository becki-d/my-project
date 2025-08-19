import { Server } from 'socket.io';
import Redis from 'ioredis';

export class CollaborationService {
  constructor(server) {
    this.io = new Server(server, {
      adapter: new RedisAdapter(process.env.REDIS_URL)
    });

    this.io.on('connection', socket => {
      socket.on('join-project', this.handleJoinProject.bind(this, socket));
      socket.on('edit', this.handleEdit.bind(this, socket));
    });
  }

  handleEdit(socket, edit) {
    // Track contributions
    ContributionTracker.track(
      socket.userId, 
      edit.projectId, 
      edit.actionType
    );
    
    // Broadcast to collaborators
    socket.to(edit.projectId).emit('remote-edit', edit);
  }
}