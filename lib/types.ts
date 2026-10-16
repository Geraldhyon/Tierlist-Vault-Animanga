export interface ReadLink {
  name: string; // nama situs, mis. "MangaDex"
  url: string; // link lengkap (https://...)
}

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
  readLinks?: ReadLink[]; // opsional: daftar tempat baca / nonton
  overall: number;
}
