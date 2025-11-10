import { useState } from 'react';
import { Target, Trophy, Calendar, TrendingUp, LogOut, Plus } from 'lucide-react';
import { Button } from './ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { ScoreEntry } from './ScoreEntry';
import { PersonalBests } from './PersonalBests';
import { CompetitionResults } from './CompetitionResults';
import { MyScores } from './MyScores';
import { NotificationsPanel } from './NotificationsPanel';

interface ArcherDashboardProps {
  userId: string;
  onLogout: () => void;
}

export function ArcherDashboard({ userId, onLogout }: ArcherDashboardProps) {
  const [showScoreEntry, setShowScoreEntry] = useState(false);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b shadow-sm">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
              <Target className="w-6 h-6 text-blue-600" />
            </div>
            <div>
              <h2>Archer Portal</h2>
              <p className="text-gray-600">Welcome, {userId}</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <NotificationsPanel userRole="archer" />
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
                  <p className="text-gray-600">Total Scores</p>
                  <h3>24</h3>
                </div>
                <Target className="w-8 h-8 text-blue-600" />
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-600">Personal Best</p>
                  <h3>687</h3>
                </div>
                <Trophy className="w-8 h-8 text-yellow-600" />
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-600">Competitions</p>
                  <h3>8</h3>
                </div>
                <Calendar className="w-8 h-8 text-green-600" />
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-600">Avg Score</p>
                  <h3>645</h3>
                </div>
                <TrendingUp className="w-8 h-8 text-purple-600" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Main Tabs */}
        <Tabs defaultValue="scores" className="space-y-4">
          <div className="flex items-center justify-between">
            <TabsList>
              <TabsTrigger value="scores">My Scores</TabsTrigger>
              <TabsTrigger value="competitions">Competitions</TabsTrigger>
              <TabsTrigger value="bests">Personal Bests</TabsTrigger>
            </TabsList>
            <Button onClick={() => setShowScoreEntry(true)}>
              <Plus className="w-4 h-4 mr-2" />
              Submit Score
            </Button>
          </div>

          <TabsContent value="scores">
            <MyScores userId={userId} />
          </TabsContent>

          <TabsContent value="competitions">
            <CompetitionResults userId={userId} />
          </TabsContent>

          <TabsContent value="bests">
            <PersonalBests userId={userId} />
          </TabsContent>
        </Tabs>
      </main>

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
    </div>
  );
}
