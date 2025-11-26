
export interface Message {
  id: string;
  text: string;
  sender: 'user' | 'bot';
  groundingSources?: { title: string; uri: string }[];
}