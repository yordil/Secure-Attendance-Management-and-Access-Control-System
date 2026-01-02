'use client';

import { useState, useEffect } from 'react';
import ProtectedRoute from '@/components/layout/ProtectedRoute';
import DashboardLayout from '@/components/layout/DashboardLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import { Role } from '@/types';
import { Users, BookOpen, Shield, Activity } from 'lucide-react';
import apiClient from '@/lib/api/client';

export default function AdminDashboard() {
  const [stats, setStats] = useState({
    totalUsers: 0,
    totalCourses: 0,
    activeSessions: 0,
    permissions: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      const [usersRes, coursesRes, permissionsRes] = await Promise.all([
        apiClient.get('/users'),
        apiClient.get('/courses'),
        apiClient.get('/permissions'),
      ]);

      setStats({
        totalUsers: usersRes.data.length || 0,
        totalCourses: coursesRes.data.length || 0,
        activeSessions: 0, // TODO: Add active sessions endpoint
        permissions: permissionsRes.data.length || 0,
      });
    } catch (error) {
      console.error('Failed to fetch stats:', error);
    } finally {
      setLoading(false);
    }
  };

  const statsDisplay = [
    { name: 'Total Users', value: stats.totalUsers.toString(), icon: Users, color: 'bg-blue-500' },
    { name: 'Total Courses', value: stats.totalCourses.toString(), icon: BookOpen, color: 'bg-green-500' },
    { name: 'Active Sessions', value: stats.activeSessions.toString(), icon: Activity, color: 'bg-purple-500' },
    { name: 'Permissions', value: stats.permissions.toString(), icon: Shield, color: 'bg-orange-500' },
  ];

  return (
    <ProtectedRoute allowedRoles={[Role.ADMIN]}>
      <DashboardLayout>
        <div className="space-y-6">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100">Admin Dashboard</h1>
            <p className="text-gray-600 dark:text-gray-400 mt-1">System overview and management</p>
          </div>

          {/* Stats Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {statsDisplay.map((stat) => (
              <Card key={stat.name} hover>
                <CardContent className="pt-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-600 dark:text-gray-400">{stat.name}</p>
                      <p className="text-3xl font-bold text-gray-900 dark:text-gray-100 mt-2">
                        {loading ? '...' : stat.value}
                      </p>
                    </div>
                    <div className={`${stat.color} p-3 rounded-lg`}>
                      <stat.icon className="w-6 h-6 text-white" />
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Recent Activity */}
          <Card>
            <CardHeader>
              <CardTitle>Recent Activity</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-500 dark:text-gray-400 text-center py-8">
                No recent activity to display
              </p>
            </CardContent>
          </Card>
        </div>
      </DashboardLayout>
    </ProtectedRoute>
  );
}
