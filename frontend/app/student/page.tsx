'use client';

import ProtectedRoute from '@/components/layout/ProtectedRoute';
import DashboardLayout from '@/components/layout/DashboardLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import { Role } from '@/types';
import { BookOpen, ClipboardCheck, TrendingUp } from 'lucide-react';

export default function StudentDashboard() {
  const stats = [
    { name: 'Enrolled Courses', value: '0', icon: BookOpen, color: 'bg-blue-500' },
    { name: 'Attendance Rate', value: '0%', icon: TrendingUp, color: 'bg-green-500' },
    { name: 'Total Sessions', value: '0', icon: ClipboardCheck, color: 'bg-purple-500' },
  ];

  return (
    <ProtectedRoute allowedRoles={[Role.STUDENT]}>
      <DashboardLayout>
        <div className="space-y-6">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100">Student Dashboard</h1>
            <p className="text-gray-600 dark:text-gray-400 mt-1">Track your attendance and courses</p>
          </div>

          {/* Stats Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {stats.map((stat) => (
              <Card key={stat.name} hover>
                <CardContent className="pt-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-600 dark:text-gray-400">{stat.name}</p>
                      <p className="text-3xl font-bold text-gray-900 dark:text-gray-100 mt-2">{stat.value}</p>
                    </div>
                    <div className={`${stat.color} p-3 rounded-lg`}>
                      <stat.icon className="w-6 h-6 text-white" />
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* My Attendance */}
          <Card>
            <CardHeader>
              <CardTitle>My Attendance</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-500 dark:text-gray-400 text-center py-8">
                No attendance records yet
              </p>
            </CardContent>
          </Card>
        </div>
      </DashboardLayout>
    </ProtectedRoute>
  );
}
