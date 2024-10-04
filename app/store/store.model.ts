export interface User {
  nickname: string;
  points: string;
}

export interface Store {
  user: User | null;
  setUser: (user: User | null) => void;
}