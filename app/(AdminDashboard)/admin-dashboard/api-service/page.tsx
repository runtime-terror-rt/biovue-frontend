"use client";

import { useState } from "react";
import { Search, Sparkles, Brain, Image as ImageIcon, Info } from "lucide-react";
import DashboardHeading from "@/components/common/DashboardHeading";
import { Input } from "@/components/ui/input";
import ApiServiceCard from "@/components/AdminDashboard/api-service/ApiServiceCard";
import ApiKeyModal from "@/components/AdminDashboard/api-service/ApiKeyModal";


// Mock AI APIs data based on specific routes
const AI_APIS = [
  {
    id: "current-lifestyle",
    name: "Project Current Lifestyle",
    description: "Analyze and project outcomes based on current lifestyle data. Endpoint: /api/v1/projection-lifestyle",
    icon: Brain,
    color: "bg-purple-500",
    status: "Active" as const,
    route: "/projection-lifestyle",
  },
  {
    id: "future-goal",
    name: "Project Future Goal",
    description: "Forecast future health and performance milestones. Endpoint: /api/v1/projection/future-goal/",
    icon: ImageIcon,
    color: "bg-blue-500",
    status: "Active" as const,
    route: "/api/v1/projection/future-goal/",
  },
  {
    id: "current-insights",
    name: "Get Current Insights",
    description: "Retrieve real-time actionable insights from current health metrics. Endpoint: /api/v1/insights/current",
    icon: Sparkles,
    color: "bg-teal-500",
    status: "Active" as const,
    route: "/api/v1/insights/current",
  },
  {
    id: "future-insights",
    name: "Get Future Insights",
    description: "Get predictive insights and recommendations for long-term health. Endpoint: /api/v1/insights/future",
    icon: Brain,
    color: "bg-orange-500",
    status: "Active" as const,
    route: "/api/v1/insights/future",
  },
];

export default function ApiServicePage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedApi, setSelectedApi] = useState<typeof AI_APIS[0] | null>(null);
  const [apiKey, setApiKey] = useState("");

  const filteredApis = AI_APIS.filter((api) =>
    api.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    api.description.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleGetKey = (apiId: string) => {
    const api = AI_APIS.find((a) => a.id === apiId);
    if (api) {
      // Mock API Key generation (In a real app, this would check subscription and call backend)
      const mockKey = `bv_${Math.random().toString(36).substring(2, 11)}_${Math.random().toString(36).substring(2, 11)}`;
      setSelectedApi(api);
      setApiKey(mockKey);
      setIsModalOpen(true);
    }
  };

  return (
    <div className="min-h-screen font-inter pb-20">
      <div className="flex flex-col gap-8">
        {/* Header Section */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div className="flex-1">
            <DashboardHeading
              heading="AI API Services"
              subheading="Access premium AI capabilities through our unified API ecosystem."
            />
          </div>
          
          <div className="relative w-full md:w-96 group">
            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5 group-focus-within:text-[#0FA4A9] transition-colors" />
            <Input
              placeholder="Search available models..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-12 h-14 bg-white border-gray-100 rounded-2xl shadow-sm focus-visible:ring-[#0FA4A9] focus-visible:border-[#0FA4A9] transition-all text-sm font-medium"
            />
          </div>
        </div>

        {/* Info Banner */}
        <div className="bg-[#0FA4A9] rounded-3xl p-8 text-white relative overflow-hidden shadow-2xl shadow-teal-600/20">
           <div className="relative z-10 flex flex-col md:flex-row items-center gap-6">
              <div className="w-16 h-16 bg-white/20 backdrop-blur-md rounded-2xl flex items-center justify-center shrink-0">
                 <Sparkles className="w-8 h-8 text-white" />
              </div>
              <div className="flex-1 text-center md:text-left">
                 <h2 className="text-2xl font-bold mb-1">Empower Your Workspace</h2>
                 <p className="text-teal-50 text-sm opacity-90 max-w-2xl leading-relaxed">
                   Select an AI model below to generate your unique API key. Remember, your access level depends on your current subscription plan.
                 </p>
              </div>
              <div className="shrink-0">
                 <button className="px-6 py-3 bg-white text-[#0FA4A9] rounded-xl font-bold text-sm hover:bg-teal-50 transition-colors shadow-lg active:scale-95">
                    Upgrade Plan
                 </button>
              </div>
           </div>
           
           {/* Abstract Shapes */}
           <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full -mr-20 -mt-20 blur-3xl"></div>
           <div className="absolute bottom-0 left-0 w-32 h-32 bg-black/5 rounded-full -ml-10 -mb-10 blur-2xl"></div>
        </div>

        {/* API Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredApis.length > 0 ? (
            filteredApis.map((api) => (
              <ApiServiceCard
                key={api.id}
                api={api}
                onGetKey={handleGetKey}
              />
            ))
          ) : (
            <div className="col-span-full py-20 flex flex-col items-center justify-center text-gray-400 bg-white rounded-3xl border border-dashed border-gray-200">
               <div className="w-16 h-16 bg-gray-50 rounded-2xl flex items-center justify-center mb-4">
                  <Info className="w-8 h-8" />
               </div>
               <p className="text-lg font-medium">No services match your search</p>
               <button 
                 onClick={() => setSearchQuery("")}
                 className="mt-4 text-[#0FA4A9] font-bold hover:underline"
               >
                 Clear all filters
               </button>
            </div>
          )}
        </div>
      </div>

      {/* API Key Modal */}
      {selectedApi && (
        <ApiKeyModal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          apiName={selectedApi.name}
          apiKey={apiKey}
        />
      )}
    </div>
  );
}
