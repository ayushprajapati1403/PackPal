export type Role = 'Owner' | 'User';
export type Permission = 'Admin' | 'Member' | 'Viewer';

export interface User {
  id: string;
  name: string;
  email: string;
  role: 'admin' | 'user';
  createdAt: string;
  updatedAt: string;
  fullname: string;
  username: string;
  createdEvents?: Event[];
  assignments?: Assignment[];
  comments?: Comment[];
  notifications?: Notification[];
}

export type Event = {
  [x: string]: any;
  id: string;
  name: string;
  description: string;
  date: string;
  categories: Category[];
  members: User[];
};

export interface Category {
  id: string;
  name: string;
  items: Item[];
}

export type Item = {
  id: string;
  name: string;
  status: 'pending' | 'packed';
};

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