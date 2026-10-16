export type PosterCategory =
  | 'All'
  | 'Brand Identity'
  | 'Typography'
  | 'Advertising'
  | 'Digital Art';

export type AspectRatio = 'portrait' | 'square';

export interface Poster {
  id: string;
  title: string;
  category: Exclude<PosterCategory, 'All'>;
  description: string;
  image_url: string;
  aspect_ratio: AspectRatio;
  tags: string[];
  created_at?: string;
  isVisible?: boolean; // Controls whether displayed on public portfolio
  isFeatured?: boolean;
}

export type ProjectCategory = 'All' | 'Full-Stack' | 'Mobile' | 'Visual Identity';

export interface Project {
  id: string;
  title: string;
  tagline: string;
  description: string;
  category: ProjectCategory;
  tags: string[];
  imageUrl: string;
  demoUrl?: string;
  githubUrl?: string;
  featured: boolean;
  year: string;
}

export interface SkillPillar {
  title: string;
  discipline: string;
  description: string;
  number: string;
  color: string;
  tags: string[];
  competencies: {
    name: string;
    level: string;
    proficiency: number;
  }[];
}
