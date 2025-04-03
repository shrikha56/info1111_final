import { HomeIcon, UsersIcon, BuildingOfficeIcon, CurrencyDollarIcon } from '@heroicons/react/24/outline';

interface StatCardProps {
  title: string;
  value: string;
  change: string;
  changeColor: string;
  icon: React.ReactNode;
}

function StatCard({ title, value, change, changeColor, icon }: StatCardProps) {
  return (
    <div className="bg-white rounded-lg p-6">
      <div className="flex items-center">
        <div className="p-3 rounded-full bg-burgundy-100">
          {icon}
        </div>
        <div className="ml-4">
          <p className="text-sm font-medium text-gray-600">{title}</p>
          <p className="text-lg font-semibold text-gray-900">{value}</p>
        </div>
      </div>
      <div className="mt-4">
        <p className={`text-sm ${changeColor}`}>{change}</p>
      </div>
    </div>
  );
}

interface ActivityItemProps {
  iconColor: string;
  icon: React.ReactNode;
  title: string;
  description: string;
  time: string;
  statusColor: string;
  statusText: string;
}

function ActivityItem({ iconColor, icon, title, description, time, statusColor, statusText }: ActivityItemProps) {
  return (
    <div className="flex items-start">
      <div className={`p-2 rounded-full ${iconColor}`}>
        {icon}
      </div>
      <div className="ml-4 flex-1">
        <p className="text-sm font-medium text-gray-900">{title}</p>
        <p className="text-sm text-gray-500">{description}</p>
      </div>
      <div className="ml-4">
        <p className="text-sm text-gray-500">{time}</p>
        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${statusColor}`}>
          {statusText}
        </span>
      </div>
    </div>
  );
}

export default function Home() {
  const statIcon1 = <HomeIcon className="h-6 w-6 text-burgundy-700" />;
  const statIcon2 = <UsersIcon className="h-6 w-6 text-burgundy-700" />;
  const statIcon3 = <BuildingOfficeIcon className="h-6 w-6 text-burgundy-700" />;
  const statIcon4 = <CurrencyDollarIcon className="h-6 w-6 text-burgundy-700" />;
  const activityIcon1 = <HomeIcon className="h-5 w-5 text-burgundy-700" />;

  return (
    <div className="space-y-8">
      <div className="bg-white rounded-xl shadow-sm border border-gray-100">
        <div className="relative">
          <div className="absolute inset-0 bg-gradient-to-r from-burgundy-800 to-burgundy-600 opacity-95 rounded-t-xl"></div>
          <div className="absolute inset-0 bg-[url('/pattern.svg')] opacity-10 rounded-t-xl"></div>
          <div className="relative px-8 py-12">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between">
              <div>
                <h1 className="text-4xl font-bold text-white">Welcome back, Admin</h1>
                <p className="mt-2 text-burgundy-100 text-lg">Here's what's happening with your properties today</p>
              </div>
              <div className="mt-4 md:mt-0">
                <a href="/api/generate-report" target="_blank" className="inline-block bg-white text-burgundy-700 px-6 py-2 rounded-lg font-medium hover:bg-burgundy-50 transition-colors">
                  View Strata Laws
                </a>
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 p-6">
          <StatCard
            title="Total Units"
            value="24"
            change="+2 from last month"
            changeColor="text-green-600"
            icon={statIcon1}
          />
          <StatCard
            title="Total Residents"
            value="48"
            change="+4 from last month"
            changeColor="text-green-600"
            icon={statIcon2}
          />
          <StatCard
            title="Active Properties"
            value="3"
            change="No change"
            changeColor="text-gray-600"
            icon={statIcon3}
          />
          <StatCard
            title="Total Revenue"
            value="$12,450"
            change="+$1,200 from last month"
            changeColor="text-green-600"
            icon={statIcon4}
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="bg-white rounded-xl shadow-sm border border-gray-100">
          <div className="px-6 py-4 border-b border-gray-100">
            <h2 className="text-lg font-semibold text-gray-900">Recent Activity</h2>
          </div>
          <div className="p-6">
            <div className="space-y-6">
              <ActivityItem
                iconColor="bg-burgundy-100"
                icon={activityIcon1}
                title="New maintenance request submitted"
                description="Unit 12B - Water Leak"
                time="2 hours ago"
                statusColor="bg-yellow-100 text-yellow-800"
                statusText="Pending"
              />
              <ActivityItem
                iconColor="bg-green-100"
                icon={activityIcon1}
                title="Levy payment received"
                description="Unit 8A - Q1 2024 Levy"
                time="4 hours ago"
                statusColor="bg-green-100 text-green-800"
                statusText="Completed"
              />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-100">
          <div className="px-6 py-4 border-b border-gray-100">
            <h2 className="text-lg font-semibold text-gray-900">Upcoming Tasks</h2>
          </div>
          <div className="p-6">
            <div className="space-y-6">
              <ActivityItem
                iconColor="bg-blue-100"
                icon={activityIcon1}
                title="Annual General Meeting"
                description="Prepare agenda and documents"
                time="In 2 days"
                statusColor="bg-blue-100 text-blue-800"
                statusText="Upcoming"
              />
              <ActivityItem
                iconColor="bg-purple-100"
                icon={activityIcon1}
                title="Insurance Renewal"
                description="Review and update coverage"
                time="In 1 week"
                statusColor="bg-purple-100 text-purple-800"
                statusText="Pending"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
