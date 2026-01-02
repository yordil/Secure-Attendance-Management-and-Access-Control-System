'use client';

import ProtectedRoute from '@/components/layout/ProtectedRoute';
import DashboardLayout from '@/components/layout/DashboardLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import { Role } from '@/types';
import { BookOpen, ClipboardCheck, Users } from 'lucide-react';
import Button from '@/components/ui/Button';
import Link from 'next/link';

export default function TeacherDashboard() {
  const stats = [
    { name: 'My Courses', value: '0', icon: BookOpen, color: 'bg-blue-500' },
    { name: 'Active Sessions', value: '0', icon: ClipboardCheck, color: 'bg-green-500' },
    { name: 'Total Students', value: '0', icon: Users, color: 'bg-purple-500' },
  ];

  return (
    <ProtectedRoute allowedRoles={[Role.TEACHER]}>
      <DashboardLayout>
        <div className="space-y-6">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100">Teacher Dashboard</h1>
              <p className="text-gray-600 dark:text-gray-400 mt-1">Manage your courses and attendance</p>
            </div>
            <Link href="/attendance/session/new">
              <Button>Create Session</Button>
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

          {/* My Courses */}
          <Card>
            <CardHeader>
              <CardTitle>My Courses</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-500 dark:text-gray-400 text-center py-8">
                No courses assigned yet
              </p>
            </CardContent>
          </Card>
        </div>
      </DashboardLayout>
    </ProtectedRoute>
  );
}
