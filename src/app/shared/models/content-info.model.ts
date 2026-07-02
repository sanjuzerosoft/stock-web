export interface ContentInfo {
  id: string;
  title: string;
  type: string;
  content: string;
}

export interface ContentApiResponse {
  status: string;
  data: ContentInfo[];
}
