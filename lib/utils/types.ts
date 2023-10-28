export enum AuthorizationType {
  SIGN_UP = 'sign-up',
  AUTH = 'auth',
}

export enum QuestStatus {
  REGISTRATION_STARTED = 'registration-started',
  REGISTRATION_COMPLETED = 'registration-completed',
  STARTED = 'started',
  COUNTING = 'counting',
  COMPLETED = 'completed',
}

export interface ProfileInterface {
  login: string;
  avatarURL: URL;
}
