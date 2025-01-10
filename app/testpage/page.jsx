import BrandCategory from "@/component/visualizations/BrandCategory";
import ProjectProgress from "@/component/visualizations/ProjectProgress";

export default function TestPage() {
  return (
    <div className="space-y-8">
      <ProjectProgress collectionName="Projects" />
    </div>
  );
}