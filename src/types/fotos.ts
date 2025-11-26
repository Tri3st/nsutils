// Interface for a single image
export interface ExtractedImage {
  id: number;
  url: string;
  image_size: number;
  image_type: string;
  medewerker_number: string;
  owner_username: string | null;
  original_filename: string | null;
}

// Interface for the paginated API response
export interface PaginatedUploadsResponse {
    count: number;
    next: string | null;
    previous: string | null;
    results: ExtractedImage[];
}