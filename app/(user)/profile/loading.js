import {
  User as UserIcon,
  FileText,
  MapPin,
  Heart,
  Tag,
  Settings,
} from "lucide-react";

export default function ProfileLoading() {
  return (
    <main className="min-h-screen bg-gray-50 px-4 py-8 sm:px-6">
      <div className="mx-auto max-w-5xl">
        {/* 1. Header (Static Title) */}
        <div className="mb-8">
          <h1 className="text-3xl font-black text-gray-900 tracking-tight">
            My Account
          </h1>
          <p className="mt-1 text-sm text-gray-500">
            Loading your profile settings and history...
          </p>
        </div>

        {/* 2. Grid layout matching the profile page */}
        <div className="grid grid-cols-1 md:grid-cols-[240px_1fr] gap-8">
          {/* Static Sidebar Navigation */}
          <aside className="flex flex-row overflow-x-auto gap-2 pb-3 scrollbar-none w-full md:flex-col md:pb-0 md:bg-white md:rounded-2xl md:border md:border-gray-200 md:p-4">
            <div className="flex items-center gap-2.5 px-4 py-3 text-sm font-bold text-gray-400 rounded-xl border border-gray-100">
              <UserIcon size={18} /> Personal Info
            </div>
            <div className="flex items-center gap-2.5 px-4 py-3 text-sm font-bold text-gray-400 rounded-xl border border-gray-100">
              <FileText size={18} /> My Orders
            </div>
            <div className="flex items-center gap-2.5 px-4 py-3 text-sm font-bold text-gray-400 rounded-xl border border-gray-100">
              <MapPin size={18} /> Saved Addresses
            </div>
            <div className="flex items-center gap-2.5 px-4 py-3 text-sm font-bold text-gray-400 rounded-xl border border-gray-100">
              <Heart size={18} /> Favorites
            </div>
            <div className="flex items-center gap-2.5 px-4 py-3 text-sm font-bold text-gray-400 rounded-xl border border-gray-100">
              <Tag size={18} /> Active Offers
            </div>
            <div className="flex items-center gap-2.5 px-4 py-3 text-sm font-bold text-gray-400 rounded-xl border border-gray-100">
              <Settings size={18} /> Settings
            </div>
          </aside>

          {/* Right Panel: Content Skeletons */}
          <section className="bg-white rounded-2xl border border-gray-200 p-6 shadow-sm min-h-[400px] space-y-6">
            <div className="border-b border-gray-150 pb-4">
              <div className="h-6 w-48 bg-gray-200 rounded animate-pulse" />
              <div className="h-4 w-64 bg-gray-150 rounded animate-pulse mt-2" />
            </div>

            {/* A. 3 Metrics Cards Skeletons */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              {Array(3)
                .fill(0)
                .map((_, index) => (
                  <div
                    key={index}
                    className="bg-gray-50 border border-gray-150 rounded-2xl p-4 flex items-center gap-4 animate-pulse"
                  >
                    <div className="p-5 bg-gray-250 rounded-xl" />
                    <div className="space-y-2 flex-1">
                      <div className="h-3 w-16 bg-gray-200 rounded" />
                      <div className="h-5 w-8 bg-gray-250 rounded" />
                    </div>
                  </div>
                ))}
            </div>

            {/* B. User Info Header Skeleton */}
            <div className="flex flex-col sm:flex-row items-center gap-4 bg-gray-50/50 border border-gray-100 rounded-2xl p-5 animate-pulse">
              <div className="h-16 w-16 rounded-full bg-gray-200" />
              <div className="space-y-2 text-center sm:text-left">
                <div className="h-5 w-32 bg-gray-250 rounded" />
                <div className="h-4 w-20 bg-gray-200 rounded animate-pulse" />
              </div>
            </div>

            {/* C. Two Profile Fields Skeletons */}
            <div className="grid gap-4 sm:grid-cols-2">
              {Array(2)
                .fill(0)
                .map((_, index) => (
                  <div
                    key={index}
                    className="rounded-xl border border-gray-150 p-4 space-y-2 animate-pulse"
                  >
                    <div className="h-3 w-24 bg-gray-200 rounded" />
                    <div className="h-4 w-40 bg-gray-250 rounded" />
                  </div>
                ))}
            </div>
          </section>
        </div>
      </div>
    </main>
  );
}
