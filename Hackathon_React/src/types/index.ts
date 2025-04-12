export type Role = 'Owner' | 'User';
export type Permission = 'Admin' | 'Member' | 'Viewer';

export interface User {
  id: string;
  email: string;
  fullname: string;
  username: string;
  role: Role;
  createdEvents?: Event[];
  assignments?: Assignment[];
  comments?: Comment[];
  notifications?: Notification[];
}

export interface Event {
  eventId: string;
  eventName: string;
  description: string;
  startDate: string;
  updatedAt: string;
  creatorId: string;
  creator?: User;
  categories?: Category[];
  assignments?: Assignment[];
  notifications?: Notification[];
}

export interface Category {
  id: string;
  name: string;
  event: Event;
  eventId: string;
  items?: Item[];
  Assignment?: Assignment;
  assignmentId?: string;
}

export interface Item {
  id: string;
  name: string;
  isPacked: boolean;
  isDelivered: boolean;
  category: Category;
  categoryId: string;
  assignment?: Assignment;
  assignmentId?: string;
  comments?: Comment[];
}

export interface Assignment {
  id: string;
  user: User;
  userId: string;
  event: Event;
  eventId: string;
  level: Permission;
  categories?: Category[];
  items?: Item[];
}

export interface Comment {
  id: string;
  text: string;
  createdAt: string;
  item: Item;
  itemId: string;
  user: User;
  userId: string;
}

export interface Notification {
  id: string;
  message: string;
  event: Event;
  eventId: string;
  user: User;
  userId: string;
  sent: boolean;
  createdAt: string;
}