import mongoose from 'mongoose';
import type { MessageDoc } from '../types/message';

const MessageSchema = new mongoose.Schema<MessageDoc>(
  {
    author: { type: String, required: true, trim: true, maxlength: 100 },
    content: { type: String, required: true, trim: true, maxlength: 2000 },
  },
  { timestamps: true }
);

MessageSchema.index({ createdAt: -1 });

export const Message = mongoose.model<MessageDoc>('Message', MessageSchema);
