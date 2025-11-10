import { useState } from 'react';
import { Shield, Activity, Database, Settings, FileText, Users, AlertTriangle } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { ScrollArea } from './ui/scroll-area';

// Mock system logs
const mockLogs = [
  {
    id: 1,
    timestamp: '2025-11-09 14:32:15',
    level: 'info',
    user: 'David Martinez',
    action: 'Approved score',
    details: 'Score ID #1247 for John Smith - Spring Championship 2025',
    ip: '192.168.1.45'
  },
  {
    id: 2,
    timestamp: '2025-11-09 14:28:03',
    level: 'info',
    user: 'Lisa Anderson',
    action: 'Created competition',
    details: 'New competition: Summer Regional Tournament 2025',
    ip: '192.168.1.67'
  },
  {
    id: 3,
    timestamp: '2025-11-09 14:15:22',
    level: 'warning',
    user: 'John Smith',
    action: 'Failed login attempt',
    details: 'Invalid password - Account: archer1',
    ip: '192.168.1.123'
  },
  {
    id: 4,
    timestamp: '2025-11-09 14:10:47',
    level: 'info',
    user: 'David Martinez',
    action: 'Updated archer profile',
    details: 'Modified details for Sarah Johnson (ARC002)',
    ip: '192.168.1.45'
  },
  {
    id: 5,
    timestamp: '2025-11-09 13:58:31',
    level: 'error',
    user: 'System',
    action: 'Database connection error',
    details: 'Failed to connect to MySQL database - Timeout after 30s',
    ip: '127.0.0.1'
  },
  {
    id: 6,
    timestamp: '2025-11-09 13:45:19',
    level: 'info',
    user: 'Sarah Johnson',
    action: 'Submitted score',
    details: 'Score: 682/720 - Indoor Championship Qualifier',
    ip: '192.168.1.89'
  },
  {
    id: 7,
    timestamp: '2025-11-09 13:32:08',
    level: 'warning',
    user: 'System',
    action: 'High memory usage',
    details: 'Memory usage at 85% - Consider optimization',
    ip: '127.0.0.1'
  },
  {
    id: 8,
    timestamp: '2025-11-09 13:15:42',
    level: 'info',
    user: 'Admin',
    action: 'System login',
    details: 'Administrator logged in successfully',
    ip: '192.168.1.1'
  }
];

// Mock system stats
const systemStats = {
  totalUsers: 158,
  activeCompetitions: 3,
  totalScores: 1247,
  pendingApprovals: 12,
  databaseSize: '2.4 GB',
  uptime: '45 days, 7 hours',
  lastBackup: '2025-11-09 02:00:00',
  apiCalls24h: 15234
};

export function AdminPanel() {
  const [selectedLog, setSelectedLog] = useState<typeof mockLogs[0] | null>(null);

  const getLogLevelColor = (level: string) => {
    switch (level) {
      case 'error':
        return 'bg-red-100 text-red-800 border-red-200';
      case 'warning':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'info':
      default:
        return 'bg-blue-100 text-blue-800 border-blue-200';
    }
  };

  const getLogLevelIcon = (level: string) => {
    switch (level) {
      case 'error':
        return <AlertTriangle className="w-4 h-4" />;
      case 'warning':
        return <AlertTriangle className="w-4 h-4" />;
      case 'info':
      default:
        return <Activity className="w-4 h-4" />;
    }
  };

  return (
    <div className="space-y-6">
      {/* Admin Header */}
      <div className="bg-gradient-to-r from-purple-600 to-indigo-600 text-white p-6 rounded-lg shadow-lg">
        <div className="flex items-center gap-3 mb-2">
          <Shield className="w-8 h-8" />
          <h2>Administrator Panel</h2>
        </div>
        <p className="text-purple-100">System monitoring, logs, and administrative controls</p>
      </div>

      {/* System Overview Cards */}
      <div className="grid md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600">Total Users</p>
                <h3>{systemStats.totalUsers}</h3>
              </div>
              <Users className="w-8 h-8 text-purple-600" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600">Database Size</p>
                <h3>{systemStats.databaseSize}</h3>
              </div>
              <Database className="w-8 h-8 text-blue-600" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600">System Uptime</p>
                <p className="text-sm mt-1">{systemStats.uptime}</p>
              </div>
              <Activity className="w-8 h-8 text-green-600" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600">API Calls (24h)</p>
                <h3>{systemStats.apiCalls24h.toLocaleString()}</h3>
              </div>
              <FileText className="w-8 h-8 text-orange-600" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Main Admin Tabs */}
      <Tabs defaultValue="logs" className="space-y-4">
        <TabsList>
          <TabsTrigger value="logs">System Logs</TabsTrigger>
          <TabsTrigger value="database">Database</TabsTrigger>
          <TabsTrigger value="settings">System Settings</TabsTrigger>
        </TabsList>

        {/* System Logs Tab */}
        <TabsContent value="logs">
          <Card>
            <CardHeader>
              <CardTitle>System Activity Logs</CardTitle>
              <CardDescription>
                Real-time system events, user actions, and security logs
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex gap-2 mb-4">
                  <Button size="sm" variant="outline">
                    <FileText className="w-4 h-4 mr-2" />
                    Export Logs
                  </Button>
                  <Button size="sm" variant="outline">
                    Clear Old Logs
                  </Button>
                  <Button size="sm" variant="outline">
                    Refresh
                  </Button>
                </div>

                <ScrollArea className="h-[500px] border rounded-lg">
                  <div className="p-4 space-y-2">
                    {mockLogs.map((log) => (
                      <div
                        key={log.id}
                        className={`p-3 rounded-lg border cursor-pointer hover:shadow-md transition-shadow ${
                          selectedLog?.id === log.id ? 'ring-2 ring-purple-500' : ''
                        }`}
                        onClick={() => setSelectedLog(log)}
                      >
                        <div className="flex items-start justify-between gap-4">
                          <div className="flex items-start gap-3 flex-1">
                            <Badge
                              variant="outline"
                              className={`${getLogLevelColor(log.level)} flex items-center gap-1`}
                            >
                              {getLogLevelIcon(log.level)}
                              {log.level.toUpperCase()}
                            </Badge>
                            <div className="flex-1 min-w-0">
                              <div className="flex items-center gap-2 mb-1">
                                <span className="text-sm text-gray-500">{log.timestamp}</span>
                                <span className="text-sm text-gray-400">•</span>
                                <span className="text-sm">{log.user}</span>
                              </div>
                              <p className="mb-1">{log.action}</p>
                              <p className="text-sm text-gray-600">{log.details}</p>
                              <p className="text-xs text-gray-400 mt-1">IP: {log.ip}</p>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </ScrollArea>

                {selectedLog && (
                  <div className="mt-4 p-4 bg-purple-50 border border-purple-200 rounded-lg">
                    <h4 className="mb-2">Selected Log Details</h4>
                    <div className="space-y-2 text-sm">
                      <div className="grid grid-cols-2 gap-2">
                        <span className="text-gray-600">Log ID:</span>
                        <span>#{selectedLog.id}</span>
                        <span className="text-gray-600">Timestamp:</span>
                        <span>{selectedLog.timestamp}</span>
                        <span className="text-gray-600">Level:</span>
                        <span className="capitalize">{selectedLog.level}</span>
                        <span className="text-gray-600">User:</span>
                        <span>{selectedLog.user}</span>
                        <span className="text-gray-600">Action:</span>
                        <span>{selectedLog.action}</span>
                        <span className="text-gray-600">IP Address:</span>
                        <span>{selectedLog.ip}</span>
                      </div>
                      <div className="pt-2 border-t border-purple-200">
                        <span className="text-gray-600">Details:</span>
                        <p className="mt-1">{selectedLog.details}</p>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Database Tab */}
        <TabsContent value="database">
          <Card>
            <CardHeader>
              <CardTitle>Database Management</CardTitle>
              <CardDescription>
                Monitor and manage database operations
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                <div className="grid md:grid-cols-2 gap-4">
                  <div className="p-4 bg-gray-50 rounded-lg">
                    <h4 className="mb-3">Database Information</h4>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span className="text-gray-600">Database Size:</span>
                        <span>{systemStats.databaseSize}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Total Records:</span>
                        <span>{systemStats.totalScores.toLocaleString()}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Last Backup:</span>
                        <span>{systemStats.lastBackup}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Connection Status:</span>
                        <Badge variant="outline" className="bg-green-100 text-green-800">
                          Connected
                        </Badge>
                      </div>
                    </div>
                  </div>

                  <div className="p-4 bg-gray-50 rounded-lg">
                    <h4 className="mb-3">Quick Actions</h4>
                    <div className="space-y-2">
                      <Button className="w-full" variant="outline">
                        <Database className="w-4 h-4 mr-2" />
                        Backup Database
                      </Button>
                      <Button className="w-full" variant="outline">
                        <Activity className="w-4 h-4 mr-2" />
                        Optimize Tables
                      </Button>
                      <Button className="w-full" variant="outline">
                        <FileText className="w-4 h-4 mr-2" />
                        Export Data
                      </Button>
                    </div>
                  </div>
                </div>

                <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
                  <h4 className="mb-2">Database Tables</h4>
                  <div className="space-y-2">
                    {['archers', 'recorders', 'competitions', 'scores', 'rounds', 'categories'].map((table) => (
                      <div key={table} className="flex items-center justify-between p-2 bg-white rounded">
                        <span className="capitalize">{table}</span>
                        <div className="flex gap-2">
                          <Badge variant="outline">
                            {Math.floor(Math.random() * 1000) + 100} rows
                          </Badge>
                          <Button size="sm" variant="ghost">View</Button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* System Settings Tab */}
        <TabsContent value="settings">
          <Card>
            <CardHeader>
              <CardTitle>System Settings</CardTitle>
              <CardDescription>
                Configure system parameters and preferences
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                <div className="p-4 bg-gray-50 rounded-lg">
                  <h4 className="mb-3">Security Settings</h4>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <div>
                        <p>Two-Factor Authentication</p>
                        <p className="text-sm text-gray-600">Require 2FA for all admin accounts</p>
                      </div>
                      <Button variant="outline" size="sm">Enable</Button>
                    </div>
                    <div className="flex items-center justify-between">
                      <div>
                        <p>Session Timeout</p>
                        <p className="text-sm text-gray-600">Auto-logout after inactivity</p>
                      </div>
                      <Badge variant="outline">30 minutes</Badge>
                    </div>
                    <div className="flex items-center justify-between">
                      <div>
                        <p>Password Policy</p>
                        <p className="text-sm text-gray-600">Minimum password requirements</p>
                      </div>
                      <Button variant="outline" size="sm">Configure</Button>
                    </div>
                  </div>
                </div>

                <div className="p-4 bg-gray-50 rounded-lg">
                  <h4 className="mb-3">System Maintenance</h4>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <div>
                        <p>Automatic Backups</p>
                        <p className="text-sm text-gray-600">Daily at 2:00 AM</p>
                      </div>
                      <Badge variant="outline" className="bg-green-100 text-green-800">
                        Active
                      </Badge>
                    </div>
                    <div className="flex items-center justify-between">
                      <div>
                        <p>Log Retention</p>
                        <p className="text-sm text-gray-600">Keep logs for 90 days</p>
                      </div>
                      <Button variant="outline" size="sm">Change</Button>
                    </div>
                    <div className="flex items-center justify-between">
                      <div>
                        <p>System Updates</p>
                        <p className="text-sm text-gray-600">Check for updates automatically</p>
                      </div>
                      <Button variant="outline" size="sm">Check Now</Button>
                    </div>
                  </div>
                </div>

                <div className="p-4 bg-amber-50 border border-amber-200 rounded-lg">
                  <div className="flex items-start gap-3">
                    <Settings className="w-5 h-5 text-amber-600 mt-0.5" />
                    <div>
                      <h4 className="mb-1">Advanced Settings</h4>
                      <p className="text-sm text-gray-600 mb-3">
                        These settings require careful consideration and may affect system performance.
                      </p>
                      <Button variant="outline" size="sm">
                        Access Advanced Settings
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
