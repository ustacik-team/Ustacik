import { WorkPhotoItem, PortfolioPhotoCard } from "./portfolio-photo-card";
import { PortfolioEmptyState } from "./portfolio-empty-state";

interface PortfolioGalleryProps {
  photos: WorkPhotoItem[];
}

export function PortfolioGallery({ photos }: PortfolioGalleryProps) {
  if (photos.length === 0) {
    return <PortfolioEmptyState />;
  }

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
      {photos.map((photo, index) => (
        <PortfolioPhotoCard key={photo.id} photo={photo} index={index} />
      ))}
    </div>
  );
}
