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
  chapters?: number; // Manga / Manhwa
  seasons?: number; // Anime
  episodes?: number; // Anime (total eps)
  overall: number;
}
