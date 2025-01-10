import BrandCategory from "@/components/visualizations/BrandCategory";
import ProjectProgress from "@/components/visualizations/ProjectProgress";

export default function TestPage() {
  return (
    <div className="space-y-8">
      <ProjectProgress collectionName="Projects" />
    </div>
  );
}