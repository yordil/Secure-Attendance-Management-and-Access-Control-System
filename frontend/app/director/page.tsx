'use client';

import ProtectedRoute from '@/components/layout/ProtectedRoute';
import DashboardLayout from '@/components/layout/DashboardLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import { Role } from '@/types';
import { BookOpen, Users, TrendingUp } from 'lucide-react';
import Button from '@/components/ui/Button';
import Link from 'next/link';

export default function DirectorDashboard() {
  const stats = [
    { name: 'Total Courses', value: '0', icon: BookOpen, color: 'bg-blue-500' },
    { name: 'Teachers', value: '0', icon: Users, color: 'bg-green-500' },
    { name: 'Students', value: '0', icon: TrendingUp, color: 'bg-purple-500' },
  ];

  return (
    <ProtectedRoute allowedRoles={[Role.DIRECTOR]}>
      <DashboardLayout>
        <div className="space-y-6">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100">Director Dashboard</h1>
              <p className="text-gray-600 dark:text-gray-400 mt-1">Course and faculty management</p>
            </div>
            <Link href="/courses/new">
              <Button>Create Course</Button>
            </Link>
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

          {/* Courses Overview */}
          <Card>
            <CardHeader>
              <CardTitle>Courses Overview</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-500 dark:text-gray-400 text-center py-8">
                No courses available. Create your first course to get started.
              </p>
            </CardContent>
          </Card>
        </div>
      </DashboardLayout>
    </ProtectedRoute>
  );
}
