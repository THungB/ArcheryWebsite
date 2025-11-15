import { Users, Trophy, CheckCircle, AlertCircle, LogOut, Shield, FileText, UserCheck } from 'lucide-react';
import { PageLayout, Header, MainContent, CardGrid } from './layout/PageLayout';
import { StatCard } from './ui/stat-card';
import { Button } from './ui/button';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { Badge } from './ui/badge';
import ArcherManagement from './ArcherManagement';
import CompetitionManagement from './CompetitionManagement';
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
    <PageLayout>
      <Header
        title={isAdmin ? 'Administrator Portal' : 'Recorder Portal'}
        description="Competition Management"
      >
        <div className="flex items-center gap-3">
          {isAdmin && (
            <Badge variant="outline" className="bg-purple-100 text-purple-800 border-purple-300">
              Admin
            </Badge>
          )}
          <NotificationsPanel userRole="recorder" />
          <Button variant="outline" onClick={onLogout}>
            <LogOut className="w-4 h-4 mr-2" />
            Sign out
          </Button>
        </div>
      </Header>

      {/* Main Content */}
      <MainContent>
        {/* Quick Stats */}
        <CardGrid cols={4} className="mb-8">
          <StatCard
            title="Pending Approvals"
            value="12"
            icon={<AlertCircle className="h-5 w-5" />}
            trend={{ value: '+3 new', isPositive: false }}
            className="border-l-4 border-yellow-400"
          />
          <StatCard
            title="Archers Registered"
            value="48"
            icon={<Users className="h-5 w-5" />}
            trend={{ value: '+5%', isPositive: true }}
            className="border-l-4 border-blue-400"
          />
          <StatCard
            title="Scores Recorded"
            value="156"
            icon={<CheckCircle className="h-5 w-5" />}
            description="This month"
            className="border-l-4 border-green-400"
          />
          <StatCard
            title="Active Competitions"
            value="3"
            icon={<Trophy className="h-5 w-5" />}
            className="border-l-4 border-purple-400"
          />
        </CardGrid>

        {/* Main Tabs */}
        <Card>
          <CardHeader className="px-6 pt-6 pb-2">
            <CardTitle>Competition Management</CardTitle>
          </CardHeader>
          <CardContent className="p-6 pt-0">
            <Tabs defaultValue="scores" className="space-y-6">
              <TabsList className="grid w-full grid-cols-4">
                <TabsTrigger value="scores" className="flex items-center gap-2">
                  <FileText className="h-4 w-4" />
                  Score Approval
                </TabsTrigger>
                <TabsTrigger value="archers" className="flex items-center gap-2">
                  <UserCheck className="h-4 w-4" />
                  Archers
                </TabsTrigger>
                <TabsTrigger value="competitions" className="flex items-center gap-2">
                  <Trophy className="h-4 w-4" />
                  Competitions
                </TabsTrigger>
                {isAdmin && (
                  <TabsTrigger value="admin" className="flex items-center gap-2">
                    <Shield className="h-4 w-4" />
                    Admin
                  </TabsTrigger>
                )}
              </TabsList>

              <TabsContent value="scores" className="space-y-4">
                <ScoreApproval />
              </TabsContent>
              <TabsContent value="archers" className="space-y-4">
                <ArcherManagement />
              </TabsContent>
              <TabsContent value="competitions" className="space-y-4">
                <CompetitionManagement />
              </TabsContent>
              {isAdmin && (
                <TabsContent value="admin" className="space-y-4">
                  <AdminPanel />
                </TabsContent>
              )}
            </Tabs>
          </CardContent>
        </Card>
      </MainContent>
    </PageLayout>
  );
}
