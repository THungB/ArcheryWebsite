import { ClipboardCheck, Users, Trophy, CheckCircle, AlertCircle, LogOut, Shield } from 'lucide-react';
import { Button } from './ui/button';
import { Card, CardContent } from './ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { Badge } from './ui/badge';
import { ArcherManagement } from './ArcherManagement';
import { CompetitionManagement } from './CompetitionManagement';
import { ScoreApproval } from './ScoreApproval';
import { AdminPanel } from './AdminPanel';
import { NotificationsPanel } from './NotificationsPanel';

interface RecorderDashboardProps {
  username: string;
  onLogout: () => void;
}

export function RecorderDashboard({ username, onLogout }: RecorderDashboardProps) {
  const isAdmin = username === 'Admin';

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b shadow-sm">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className={`w-10 h-10 ${isAdmin ? 'bg-purple-100' : 'bg-green-100'} rounded-full flex items-center justify-center`}>
              {isAdmin ? (
                <Shield className="w-6 h-6 text-purple-600" />
              ) : (
                <ClipboardCheck className="w-6 h-6 text-green-600" />
              )}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2>{isAdmin ? 'Administrator Portal' : 'Recorder Portal'}</h2>
                {isAdmin && (
                  <Badge variant="outline" className="bg-purple-100 text-purple-800 border-purple-300">
                    Admin
                  </Badge>
                )}
              </div>
              <p className="text-gray-600">Competition Management</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <NotificationsPanel userRole="recorder" />
            <Button variant="outline" onClick={onLogout}>
              <LogOut className="w-4 h-4 mr-2" />
              Logout
            </Button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">
        {/* Quick Stats */}
        <div className="grid md:grid-cols-4 gap-4 mb-8">
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-600">Total Archers</p>
                  <h3>156</h3>
                </div>
                <Users className="w-8 h-8 text-blue-600" />
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-600">Active Competitions</p>
                  <h3>3</h3>
                </div>
                <Trophy className="w-8 h-8 text-yellow-600" />
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-600">Pending Approvals</p>
                  <h3>12</h3>
                </div>
                <AlertCircle className="w-8 h-8 text-orange-600" />
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-600">Approved Today</p>
                  <h3>28</h3>
                </div>
                <CheckCircle className="w-8 h-8 text-green-600" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Main Tabs */}
        <Tabs defaultValue={isAdmin ? "admin" : "approvals"} className="space-y-4">
          <TabsList>
            {isAdmin && (
              <TabsTrigger value="admin">
                <Shield className="w-4 h-4 mr-2" />
                Admin Panel
              </TabsTrigger>
            )}
            <TabsTrigger value="approvals">Score Approvals</TabsTrigger>
            <TabsTrigger value="competitions">Competitions</TabsTrigger>
            <TabsTrigger value="archers">Archers</TabsTrigger>
          </TabsList>

          {isAdmin && (
            <TabsContent value="admin">
              <AdminPanel />
            </TabsContent>
          )}

          <TabsContent value="approvals">
            <ScoreApproval />
          </TabsContent>

          <TabsContent value="competitions">
            <CompetitionManagement />
          </TabsContent>

          <TabsContent value="archers">
            <ArcherManagement />
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
}
