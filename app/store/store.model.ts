export interface User {
  nickname: string;
  points: string;
  personalBest: string;
}

export interface AppError {
  id: number;
  message: string;
}

export interface Store {
  user: User | null;
  setUser: (user: User | null) => void;
  errors: AppError[];
  addError: (errorMessage: string) => void;
  removeError: (id: number) => void;
}
