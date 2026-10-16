export interface MediaItem {
  id: string;
  title: string;
  type: 'Anime' | 'Manga' | 'Manhwa';
  coverImage: string;
  genres: string[];
  synopsis: string;
  review: string;
  scores: {
    story: number;
    character: number;
    art: number;
    enjoyment: number;
  };
  status: 'Completed' | 'Ongoing';
  overall: number;
}
