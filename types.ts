
export interface Participant {
  id: string;
  name: string;
  photoUrl: string;
  votes: number;
}

export interface AppState {
  participants: Participant[];
  votedForId: string | null;
  isAdmin: boolean;
  sessionTitle: string;
}

export enum AppView {
  ADMIN = 'admin',
  VOTE = 'vote',
  LEADERBOARD = 'leaderboard'
}
