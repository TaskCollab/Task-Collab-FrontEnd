export interface Notification {
    notificationId: number;
    notificationTitle: string;
    content: string;
    type: string;
    readStatus: boolean;
    createdAt: string;
    userID: number;
  }