export interface Note {
  id: string;
  content: string;
  timestamp: number;
}

export type Theme = 'light' | 'dark';

export interface GenerateReportResponse {
  markdown: string;
}