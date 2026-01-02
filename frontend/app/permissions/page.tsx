'use client';

import { useState, useEffect } from 'react';
import ProtectedRoute from '@/components/layout/ProtectedRoute';
import DashboardLayout from '@/components/layout/DashboardLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import Input from '@/components/ui/Input';
import { Role, Permission } from '@/types';
import apiClient from '@/lib/api/client';
import { formatDateTime } from '@/lib/utils/helpers';
import { Shield, Trash2 } from 'lucide-react';

export default function PermissionsPage() {
  const [permissions, setPermissions] = useState<Permission[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showGrantForm, setShowGrantForm] = useState(false);

  const [formData, setFormData] = useState({
    userId: '',
    resource: '',
    action: 'READ',
  });

  useEffect(() => {
    fetchPermissions();
  }, []);

  const fetchPermissions = async () => {
    try {
      const response = await apiClient.get('/permissions');
      setPermissions(response.data);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to fetch permissions');
    } finally {
      setLoading(false);
    }
  };

  const handleGrant = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    try {
      await apiClient.post('/permissions/grant', formData);
      setShowGrantForm(false);
      setFormData({ userId: '', resource: '', action: 'READ' });
      fetchPermissions();
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to grant permission');
    }
  };

  const handleRevoke = async (id: string) => {
    if (!confirm('Are you sure you want to revoke this permission?')) return;

    try {
      await apiClient.delete(`/permissions/${id}`);
      fetchPermissions();
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to revoke permission');
    }
  };

  return (
    <ProtectedRoute allowedRoles={[Role.ADMIN, Role.DIRECTOR]}>
      <DashboardLayout>
        <div className="space-y-6">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100">Permission Management</h1>
              <p className="text-gray-600 dark:text-gray-400 mt-1">Manage user permissions (DAC)</p>
            </div>
            <Button onClick={() => setShowGrantForm(!showGrantForm)}>
              {showGrantForm ? 'Cancel' : 'Grant Permission'}
            </Button>
          </div>

          {error && (
            <div className="p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg text-red-600 dark:text-red-400">
              {error}
            </div>
          )}

          {showGrantForm && (
            <Card>
              <CardHeader>
                <CardTitle>Grant New Permission</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="mb-4 p-4 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg">
                  <h4 className="font-medium text-blue-900 dark:text-blue-100 mb-2">How to grant permissions:</h4>
                  <ul className="text-sm text-blue-800 dark:text-blue-200 space-y-1 list-disc list-inside">
                    <li><strong>User ID:</strong> Go to Users page and click "Copy ID" button</li>
                    <li><strong>Resource:</strong> Go to course detail page and click "Copy Resource ID" button</li>
                    <li><strong>Format:</strong> Resource ID is automatically formatted as <code className="bg-blue-100 dark:bg-blue-800 px-1 rounded">course:courseId</code></li>
                    <li><strong>Action:</strong> READ (view only) or WRITE (edit/delete)</li>
                  </ul>
                  <div className="mt-2 p-2 bg-blue-100 dark:bg-blue-800 rounded text-xs">
                    <strong>Example:</strong> To let a user view CS101 course, copy the user ID from Users page, copy the resource ID from CS101 detail page, and select READ action.
                  </div>
                </div>

                <form onSubmit={handleGrant} className="space-y-4">
                  <Input
                    label="User ID"
                    value={formData.userId}
                    onChange={(e) => setFormData({ ...formData, userId: e.target.value })}
                    placeholder="e.g., clh1234567890abcdef"
                    helperText="Get the user ID from the Users page"
                    required
                  />
                  <Input
                    label="Resource"
                    value={formData.resource}
                    onChange={(e) => setFormData({ ...formData, resource: e.target.value })}
                    placeholder="e.g., course:CS101 or report:2024-Q1"
                    helperText="Format: resourceType:resourceId"
                    required
                  />
                  <div>
                    <label className="block text-sm font-medium mb-1.5 text-gray-700 dark:text-gray-300">
                      Action
                    </label>
                    <select
                      value={formData.action}
                      onChange={(e) => setFormData({ ...formData, action: e.target.value })}
                      className="w-full px-4 py-2 rounded-lg border bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 border-gray-300 dark:border-gray-600"
                    >
                      <option value="READ">READ (View only)</option>
                      <option value="WRITE">WRITE (Edit/Delete)</option>
                    </select>
                    <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
                      READ allows viewing, WRITE allows modifications
                    </p>
                  </div>
                  <Button type="submit">Grant Permission</Button>
                </form>
              </CardContent>
            </Card>
          )}

          {loading ? (
            <div className="flex justify-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
            </div>
          ) : permissions.length === 0 ? (
            <Card>
              <CardContent className="py-12 text-center">
                <Shield className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100 mb-2">No permissions granted</h3>
                <p className="text-gray-500 dark:text-gray-400">Start by granting permissions to users</p>
              </CardContent>
            </Card>
          ) : (
            <Card>
              <CardContent className="p-0">
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead className="bg-gray-50 dark:bg-gray-700">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                          User ID
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                          Resource
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                          Action
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                          Granted At
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                          Actions
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                      {permissions.map((permission) => (
                        <tr key={permission.id}>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-gray-100">
                            {permission.userId}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-gray-100">
                            {permission.resource}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-gray-100">
                            {permission.action}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                            {formatDateTime(permission.createdAt)}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm">
                            <Button
                              variant="destructive"
                              size="sm"
                              onClick={() => handleRevoke(permission.id)}
                            >
                              <Trash2 className="w-4 h-4 mr-1" />
                              Revoke
                            </Button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </DashboardLayout>
    </ProtectedRoute>
  );
}
