import {
  WebSocketGateway,
  SubscribeMessage,
  MessageBody,
  ConnectedSocket,
  WebSocketServer,
  OnGatewayConnection,
  OnGatewayDisconnect,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { ChatService } from './chat.service';

@WebSocketGateway({
  cors: {
    origin: '*', // In production, replace with your frontend URL
  },
})
export class ChatGateway implements OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer()
  server: Server;

  constructor(private chatService: ChatService) {}

  handleConnection(client: Socket) {
    console.log(`Client connected: ${client.id}`);
  }

  handleDisconnect(client: Socket) {
    console.log(`Client disconnected: ${client.id}`);
  }

  // 1. Users join a "Room" based on their User ID
  @SubscribeMessage('join')
  handleJoin(@MessageBody() userId: string, @ConnectedSocket() client: Socket) {
    client.join(userId);
    console.log(`User ${userId} joined their private room`);
  }

  // 2. Sending a message
  @SubscribeMessage('send_message')
  async handleSendMessage(
    @MessageBody()
    data: {
      senderId: string;
      receiverId: string;
      content: string;
    },
  ) {
    // Save to database
    const message = await this.chatService.saveMessage(
      data.senderId,
      data.receiverId,
      data.content,
    );

    // Send to the receiver's private room only
    this.server.to(data.receiverId).emit('receive_message', message);

    // Also send back to the sender so they see it in their UI
    this.server.to(data.senderId).emit('receive_message', message);
  }
}
