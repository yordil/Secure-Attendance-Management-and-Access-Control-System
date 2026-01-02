'use client';

import { useState, useEffect } from 'react';
import ProtectedRoute from '@/components/layout/ProtectedRoute';
import DashboardLayout from '@/components/layout/DashboardLayout';
import { Card, CardContent } from '@/components/ui/Card';
import Badge from '@/components/ui/Badge';
import Input from '@/components/ui/Input';
import { Role, User } from '@/types';
import apiClient from '@/lib/api/client';
import { formatDateTime, getInitials } from '@/lib/utils/helpers';
import { Users as UsersIcon, Search } from 'lucide-react';

export default function UsersPage() {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      // Note: You may need to create a /users endpoint in the backend
      // For now, this will attempt to fetch from /users
      const response = await apiClient.get('/users');
      setUsers(response.data);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to fetch users');
    } finally {
      setLoading(false);
    }
  };

  const filteredUsers = users.filter(
    (user) =>
      user.firstName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.lastName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.role.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <ProtectedRoute allowedRoles={[Role.ADMIN, Role.DIRECTOR]}>
      <DashboardLayout>
        <div className="space-y-6">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100">User Management</h1>
            <p className="text-gray-600 dark:text-gray-400 mt-1">View and manage system users</p>
          </div>

          {error && (
            <div className="p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg text-red-600 dark:text-red-400">
              {error}
            </div>
          )}

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-4">
                <Search className="w-5 h-5 text-gray-400" />
                <Input
                  placeholder="Search users by name, email, or role..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="flex-1"
                />
              </div>
            </CardContent>
          </Card>

          {loading ? (
            <div className="flex justify-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
            </div>
          ) : filteredUsers.length === 0 ? (
            <Card>
              <CardContent className="py-12 text-center">
                <UsersIcon className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100 mb-2">
                  {searchTerm ? 'No matching users found' : 'No users yet'}
                </h3>
                <p className="text-gray-500 dark:text-gray-400">
                  {searchTerm ? 'Try a different search term' : 'Users will appear here'}
                </p>
              </CardContent>
            </Card>
          ) : (
            <>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredUsers.map((user) => (
                  <Card key={user.id} hover>
                    <CardContent className="p-6">
                      <div className="flex items-start gap-4">
                        <div className="w-12 h-12 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white font-semibold text-lg">
                          {getInitials(user.firstName, user.lastName)}
                        </div>
                        <div className="flex-1 min-w-0">
                          <h3 className="font-semibold text-gray-900 dark:text-gray-100 truncate">
                            {user.firstName} {user.lastName}
                          </h3>
                          <p className="text-sm text-gray-500 dark:text-gray-400 truncate">{user.email}</p>
                          
                          {/* Full User ID with Copy Button */}
                          <div className="mt-2 p-2 bg-gray-50 dark:bg-gray-700 rounded border border-gray-200 dark:border-gray-600">
                            <div className="flex items-center justify-between gap-2">
                              <p className="text-xs text-gray-600 dark:text-gray-300 font-mono truncate flex-1" title={user.id}>
                                {user.id}
                              </p>
                              <button
                                onClick={() => {
                                  navigator.clipboard.writeText(user.id);
                                  alert('User ID copied to clipboard!');
                                }}
                                className="px-2 py-1 text-xs bg-blue-500 hover:bg-blue-600 text-white rounded transition-smooth"
                                title="Copy User ID"
                              >
                                Copy ID
                              </button>
                            </div>
                          </div>

                          <div className="flex items-center gap-2 mt-2">
                            <Badge variant="role" type={user.role}>
                              {user.role}
                            </Badge>
                            {user.isVerified && (
                              <span className="text-xs text-green-600 dark:text-green-400">✓ Verified</span>
                            )}
                            {user.mfaEnabled && (
                              <span className="text-xs text-blue-600 dark:text-blue-400">🔒 MFA</span>
                            )}
                          </div>
                          {user.department && (
                            <p className="text-xs text-gray-500 dark:text-gray-400 mt-2">
                              {user.department}
                            </p>
                          )}
                          <p className="text-xs text-gray-400 dark:text-gray-500 mt-1">
                            Joined {formatDateTime(user.createdAt)}
                          </p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>

              <div className="text-sm text-gray-500 dark:text-gray-400">
                Showing {filteredUsers.length} of {users.length} users
              </div>
            </>
          )}
        </div>
      </DashboardLayout>
    </ProtectedRoute>
  );
}
