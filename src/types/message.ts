export type MessageDoc = {
  _id: string;
  author: string;
  content: string;
  createdAt: Date;
};

export type CreateMessageBody = {
  author: string;
  content: string;
};
