'use client';

import { useState, useEffect } from 'react';
import ProtectedRoute from '@/components/layout/ProtectedRoute';
import DashboardLayout from '@/components/layout/DashboardLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import Badge from '@/components/ui/Badge';
import { Role } from '@/types';
import apiClient from '@/lib/api/client';
import Link from 'next/link';
import { ClipboardCheck, Plus } from 'lucide-react';

export default function AttendanceSessionsPage() {
  const [sessions, setSessions] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchSessions();
  }, []);

  const fetchSessions = async () => {
    try {
      // TODO: Create backend endpoint for listing sessions
      // const response = await apiClient.get('/attendance/sessions');
      // setSessions(response.data);
      setSessions([]);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to fetch sessions');
    } finally {
      setLoading(false);
    }
  };

  return (
    <ProtectedRoute allowedRoles={[Role.ADMIN, Role.DIRECTOR, Role.TEACHER]}>
      <DashboardLayout>
        <div className="space-y-6">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100">Attendance Sessions</h1>
              <p className="text-gray-600 dark:text-gray-400 mt-1">Manage attendance sessions</p>
            </div>
            <Link href="/attendance/sessions/new">
              <Button>
                <Plus className="w-4 h-4 mr-2" />
                Create Session
              </Button>
            </Link>
          </div>

          {error && (
            <div className="p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg text-red-600 dark:text-red-400">
              {error}
            </div>
          )}

          {loading ? (
            <div className="flex justify-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
            </div>
          ) : sessions.length === 0 ? (
            <Card>
              <CardContent className="py-12 text-center">
                <ClipboardCheck className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100 mb-2">No sessions yet</h3>
                <p className="text-gray-500 dark:text-gray-400 mb-4">Create your first attendance session</p>
                <Link href="/attendance/sessions/new">
                  <Button>Create Session</Button>
                </Link>
              </CardContent>
            </Card>
          ) : (
            <div className="grid grid-cols-1 gap-6">
              {sessions.map((session) => (
                <Card key={session.id} hover>
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <h3 className="font-semibold text-gray-900 dark:text-gray-100">{session.courseName}</h3>
                        <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                          {session.startTime} - {session.endTime}
                        </p>
                      </div>
                      <Badge variant="status" type={session.isActive ? 'PRESENT' : 'ABSENT'}>
                        {session.isActive ? 'Active' : 'Closed'}
                      </Badge>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>
      </DashboardLayout>
    </ProtectedRoute>
  );
}
