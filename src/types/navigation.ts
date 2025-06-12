import { NavigatorScreenParams } from '@react-navigation/native';

export type RootStackParamList = {
  index: undefined;
  onboarding: undefined;
  '(tabs)': NavigatorScreenParams<TabParamList>;
  'auth/connect': undefined;
  'chat/[topic]': { topic: string };
  'agent/[id]': { id: string };
  'mini-app/[id]': { id: string; data?: any };
  'event/[id]': { id: string };
  'map/index': undefined;
};

export type TabParamList = {
  explore: undefined;
  stream: undefined;
  create: undefined;
  marketplace: undefined;
  echo: undefined;
};

// Navigation props helpers
export type RootStackScreenProps<T extends keyof RootStackParamList> = {
  route: { params: RootStackParamList[T] };
  navigation: any;
};

export type TabScreenProps<T extends keyof TabParamList> = {
  route: { params: TabParamList[T] };
  navigation: any;
};