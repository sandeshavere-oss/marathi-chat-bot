
export interface GroundingChunk {
  web?: {
    uri: string;
    title: string;
  };
}

export interface ChatMessage {
  id: string;
  role: 'user' | 'model';
  text: string;
  sources?: GroundingChunk[];
  timestamp: Date;
}

export interface SearchResponse {
  text: string;
  sources: GroundingChunk[];
}
