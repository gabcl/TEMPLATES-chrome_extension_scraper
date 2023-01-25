import { DataFrame } from './DataFrame';

export interface Message {
  type: string;
  track: Array<string>;
  tabId?: number;
  content: DataFrame;
}
