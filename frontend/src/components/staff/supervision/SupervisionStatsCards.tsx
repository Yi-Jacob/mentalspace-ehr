
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Users, Calendar, FileText, TrendingUp } from 'lucide-react';

const SupervisionStatsCards: React.FC = () => {
  const stats = [
    {
      title: "Active Supervisees",
      value: "12",
      icon: Users,
      color: "blue",
      bgGradient: "from-blue-50 to-cyan-50",
      borderColor: "border-blue-200",
      textColor: "text-blue-600",
      iconBg: "bg-blue-600"
    },
    {
      title: "Sessions This Week",
      value: "8",
      icon: Calendar,
      color: "green",
      bgGradient: "from-green-50 to-emerald-50",
      borderColor: "border-green-200",
      textColor: "text-green-600",
      iconBg: "bg-green-600"
    },
    {
      title: "Pending Reviews",
      value: "5",
      icon: FileText,
      color: "yellow",
      bgGradient: "from-yellow-50 to-orange-50",
      borderColor: "border-yellow-200",
      textColor: "text-yellow-600",
      iconBg: "bg-yellow-600"
    },
    {
      title: "Completion Rate",
      value: "94%",
      icon: TrendingUp,
      color: "purple",
      bgGradient: "from-purple-50 to-indigo-50",
      borderColor: "border-purple-200",
      textColor: "text-purple-600",
      iconBg: "bg-purple-600"
    }
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
      {stats.map((stat, index) => (
        <Card key={index} className={`bg-gradient-to-br ${stat.bgGradient} ${stat.borderColor} hover:shadow-lg transition-all duration-300 hover:scale-105`}>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className={`${stat.textColor} text-sm font-medium`}>{stat.title}</p>
                <p className={`text-3xl font-bold ${stat.textColor.replace('600', '800')}`}>{stat.value}</p>
              </div>
              <div className={`p-3 ${stat.iconBg} rounded-full`}>
                <stat.icon className="h-6 w-6 text-white" />
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};

export default SupervisionStatsCards;
