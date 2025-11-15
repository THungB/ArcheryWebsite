import { useState } from 'react';
import { Target, Trophy, Calendar, TrendingUp, LogOut, Plus } from 'lucide-react';
import { Button } from './ui/button';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import ScoreEntry from './ScoreEntry';
import { PersonalBests } from './PersonalBests';
import { CompetitionResults } from './CompetitionResults';
import { MyScores } from './MyScores';
import { NotificationsPanel } from './NotificationsPanel';
import { PageLayout, Header, MainContent, CardGrid } from './layout/PageLayout';
import { StatCard } from './ui/stat-card';

interface ArcherDashboardProps {
  userId: string;
  onLogout: () => void;
}

export function ArcherDashboard({ userId, onLogout }: ArcherDashboardProps) {
  const [showScoreEntry, setShowScoreEntry] = useState(false);

  return (
    <PageLayout>
      <Header
        title="Archer Portal"
        description={`Welcome back, ${userId}`}
      >
        <div className="flex items-center gap-3">
          <NotificationsPanel userRole="archer" />
          <Button variant="outline" onClick={onLogout}>
            <LogOut className="w-4 h-4 mr-2" />
            Sign out
          </Button>
        </div>
      </Header>

      <MainContent>
        {/* Quick Stats */}
        <CardGrid cols={4} className="mb-8">
          <StatCard
            title="Total Rounds"
            value="24"
            icon={<Target className="h-5 w-5" />}
            trend={{ value: '+12%', isPositive: true }}
          />
          <StatCard
            title="Average Score"
            value="287"
            icon={<TrendingUp className="h-5 w-5" />}
            trend={{ value: '+5%', isPositive: true }}
          />
          <StatCard
            title="Personal Best"
            value="342"
            icon={<Trophy className="h-5 w-5" />}
            description="30 arrows, 40m"
          />
          <StatCard
            title="Next Competition"
            value="May 15"
            icon={<Calendar className="h-5 w-5" />}
            description="Spring Tournament"
          />
        </CardGrid>

        <Card>
          <CardHeader className="px-6 pt-6 pb-2">
            <div className="flex items-center justify-between">
              <CardTitle>My Performance</CardTitle>
              <Button onClick={() => setShowScoreEntry(true)} size="sm">
                <Plus className="mr-2 h-4 w-4" />
                New Score
              </Button>
            </div>
          </CardHeader>
          <CardContent className="p-6 pt-0">
            <Tabs defaultValue="scores" className="space-y-6">
              <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="scores">My Scores</TabsTrigger>
                <TabsTrigger value="personal-bests">Personal Bests</TabsTrigger>
                <TabsTrigger value="competitions">Competitions</TabsTrigger>
              </TabsList>

              <TabsContent value="scores" className="space-y-4">
                <MyScores userId={userId} />
              </TabsContent>
              <TabsContent value="personal-bests" className="space-y-4">
                <PersonalBests userId={userId} />
              </TabsContent>
              <TabsContent value="competitions" className="space-y-4">
                <CompetitionResults userId={userId} />
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      </MainContent>
      {/* Score Entry Modal */}
      {showScoreEntry && (
        <ScoreEntry
          userId={userId}
          onClose={() => setShowScoreEntry(false)}
          onSubmit={() => {
            setShowScoreEntry(false);
            // Refresh scores
          }}
        />
      )}
    </PageLayout>
  );
}
