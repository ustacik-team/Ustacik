import { ServiceCategoryGroup, ServiceCategoryCard } from "./service-category-card";

interface CategoryServicesListProps {
  categories: ServiceCategoryGroup[];
}

export function CategoryServicesList({ categories }: CategoryServicesListProps) {
  return (
    <div className="space-y-4">
      {categories.map((categoryGroup) => (
        <ServiceCategoryCard key={categoryGroup.id} categoryGroup={categoryGroup} />
      ))}
    </div>
  );
}
