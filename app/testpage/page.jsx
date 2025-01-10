import BrandCategory from "@/components/visualizations/BrandCategory";
import ProjectProgress from "@/components/visualizations/ProjectProgress";
import PlatformCategory from "@/components/visualizations/PlatformCategory";

export default function TestPage() {
  return (
    <div className="space-y-8">
      <PlatformCategory collectionName="Projects" />
    </div>
  );
}