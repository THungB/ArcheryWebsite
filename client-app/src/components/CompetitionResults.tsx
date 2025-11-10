import { Trophy, Medal, Calendar, Users } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from './ui/table';

interface CompetitionResultsProps {
  userId: string;
}

export function CompetitionResults({ userId }: CompetitionResultsProps) {
  // Mock data - would come from backend
  const upcomingCompetitions = [
    {
      id: 1,
      name: 'Winter Championship 2024',
      date: '2024-12-15',
      location: 'National Archery Center',
      rounds: ['720 Round', 'WA 70m'],
      registered: true,
    },
    {
      id: 2,
      name: 'Indoor League - Round 5',
      date: '2024-11-22',
      location: 'City Sports Complex',
      rounds: ['WA 18m'],
      registered: false,
    },
  ];

  const leaderboard = [
    { rank: 1, name: 'Sarah Johnson', score: 698, arrows: 72 },
    { rank: 2, name: 'Michael Chen', score: 692, arrows: 72 },
    { rank: 3, name: 'Emma Davis', score: 687, arrows: 72 },
    { rank: 4, name: 'You', score: 687, arrows: 72, isCurrentUser: true },
    { rank: 5, name: 'James Wilson', score: 681, arrows: 72 },
  ];

  const myRankings = [
    {
      competition: 'Spring Championship 2024',
      rank: 3,
      totalParticipants: 45,
      score: 687,
      category: 'Recurve - Senior Men',
    },
    {
      competition: 'Indoor Open',
      rank: 8,
      totalParticipants: 32,
      score: 578,
      category: 'Recurve - Senior Men',
    },
    {
      competition: 'Summer Series Round 3',
      rank: 5,
      totalParticipants: 38,
      score: 645,
      category: 'Recurve - Senior Men',
    },
  ];

  return (
    <Tabs defaultValue="upcoming" className="space-y-4">
      <TabsList>
        <TabsTrigger value="upcoming">Upcoming</TabsTrigger>
        <TabsTrigger value="leaderboard">Leaderboard</TabsTrigger>
        <TabsTrigger value="rankings">My Rankings</TabsTrigger>
      </TabsList>

      {/* Upcoming Competitions */}
      <TabsContent value="upcoming">
        <Card>
          <CardHeader>
            <div className="flex items-center gap-2">
              <Calendar className="w-5 h-5 text-blue-600" />
              <CardTitle>Upcoming Competitions</CardTitle>
            </div>
            <CardDescription>Register for upcoming events</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {upcomingCompetitions.map((comp) => (
              <div key={comp.id} className="border rounded-lg p-4">
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <h4 className="mb-1">{comp.name}</h4>
                    <p className="text-gray-600">{comp.location}</p>
                  </div>
                  {comp.registered ? (
                    <Badge className="bg-green-100 text-green-700">Registered</Badge>
                  ) : (
                    <Badge variant="outline">Not Registered</Badge>
                  )}
                </div>
                <div className="flex items-center gap-4 text-gray-600 mb-3">
                  <div className="flex items-center gap-1">
                    <Calendar className="w-4 h-4" />
                    <span>{comp.date}</span>
                  </div>
                </div>
                <div className="flex flex-wrap gap-2">
                  {comp.rounds.map((round, index) => (
                    <Badge key={index} variant="secondary">{round}</Badge>
                  ))}
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      </TabsContent>

      {/* Leaderboard */}
      <TabsContent value="leaderboard">
        <Card>
          <CardHeader>
            <div className="flex items-center gap-2">
              <Trophy className="w-5 h-5 text-yellow-600" />
              <CardTitle>Current Leaderboard</CardTitle>
            </div>
            <CardDescription>Spring Championship 2024 - 720 Round</CardDescription>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Rank</TableHead>
                  <TableHead>Archer</TableHead>
                  <TableHead>Score</TableHead>
                  <TableHead>Arrows</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {leaderboard.map((entry) => (
                  <TableRow 
                    key={entry.rank}
                    className={entry.isCurrentUser ? 'bg-blue-50' : ''}
                  >
                    <TableCell>
                      <div className="flex items-center gap-2">
                        {entry.rank === 1 && <Medal className="w-4 h-4 text-yellow-500" />}
                        {entry.rank === 2 && <Medal className="w-4 h-4 text-gray-400" />}
                        {entry.rank === 3 && <Medal className="w-4 h-4 text-orange-600" />}
                        <span>{entry.rank}</span>
                      </div>
                    </TableCell>
                    <TableCell className={entry.isCurrentUser ? '' : ''}>
                      {entry.name}
                    </TableCell>
                    <TableCell>{entry.score}</TableCell>
                    <TableCell>{entry.arrows}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </TabsContent>

      {/* My Rankings */}
      <TabsContent value="rankings">
        <Card>
          <CardHeader>
            <div className="flex items-center gap-2">
              <Users className="w-5 h-5 text-purple-600" />
              <CardTitle>My Competition Rankings</CardTitle>
            </div>
            <CardDescription>Your placement in past competitions</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {myRankings.map((ranking, index) => (
                <div key={index} className="border rounded-lg p-4">
                  <div className="flex items-start justify-between mb-3">
                    <div>
                      <h4 className="mb-1">{ranking.competition}</h4>
                      <p className="text-gray-600">{ranking.category}</p>
                    </div>
                    <div className="text-right">
                      <div className="text-blue-600 mb-1">
                        Rank {ranking.rank} / {ranking.totalParticipants}
                      </div>
                      <div className="text-gray-600">Score: {ranking.score}</div>
                    </div>
                  </div>
                  <div className="bg-gray-100 rounded-full h-2">
                    <div 
                      className="bg-blue-600 h-2 rounded-full"
                      style={{ width: `${((ranking.totalParticipants - ranking.rank + 1) / ranking.totalParticipants) * 100}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </TabsContent>
    </Tabs>
  );
}
