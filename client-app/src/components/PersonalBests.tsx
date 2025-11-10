import { Trophy, TrendingUp, Award } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from './ui/table';

interface PersonalBestsProps {
  userId: string;
}

export function PersonalBests({ userId }: PersonalBestsProps) {
  // Mock data - would come from backend
  const personalBests = [
    {
      id: 1,
      round: '720 Round',
      distance: '70m',
      bestScore: 687,
      date: '2024-11-05',
      competition: 'Spring Championship 2024',
      improvement: '+12',
    },
    {
      id: 2,
      round: 'WA 18m',
      distance: '18m',
      bestScore: 592,
      date: '2024-10-22',
      competition: 'Indoor Championship',
      improvement: '+8',
    },
    {
      id: 3,
      round: 'FITA Round',
      distance: '50m',
      bestScore: 658,
      date: '2024-09-15',
      competition: 'National Open',
      improvement: '+15',
    },
    {
      id: 4,
      round: '1440 Round',
      distance: 'Multiple',
      bestScore: 1287,
      date: '2024-08-20',
      competition: 'Summer Championship',
      improvement: '+23',
    },
  ];

  const averageScores = [
    { round: '720 Round - 70m', average: 645, trend: 'up' },
    { round: 'WA 18m', average: 568, trend: 'up' },
    { round: 'FITA Round - 50m', average: 632, trend: 'down' },
  ];

  return (
    <div className="space-y-6">
      {/* Personal Bests */}
      <Card>
        <CardHeader>
          <div className="flex items-center gap-2">
            <Trophy className="w-5 h-5 text-yellow-600" />
            <CardTitle>Personal Best Scores</CardTitle>
          </div>
          <CardDescription>Your highest scores for each round type</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Round Type</TableHead>
                <TableHead>Distance</TableHead>
                <TableHead>Best Score</TableHead>
                <TableHead>Date Achieved</TableHead>
                <TableHead>Competition</TableHead>
                <TableHead>Improvement</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {personalBests.map((pb) => (
                <TableRow key={pb.id}>
                  <TableCell>{pb.round}</TableCell>
                  <TableCell>{pb.distance}</TableCell>
                  <TableCell>
                    <span className="text-blue-600">{pb.bestScore}</span>
                  </TableCell>
                  <TableCell>{pb.date}</TableCell>
                  <TableCell>{pb.competition}</TableCell>
                  <TableCell>
                    <span className="text-green-600">{pb.improvement}</span>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Average Scores */}
      <Card>
        <CardHeader>
          <div className="flex items-center gap-2">
            <TrendingUp className="w-5 h-5 text-blue-600" />
            <CardTitle>Average Scores</CardTitle>
          </div>
          <CardDescription>Your average performance across round types</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {averageScores.map((avg, index) => (
              <div key={index} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                <div className="flex items-center gap-3">
                  <Award className="w-5 h-5 text-gray-600" />
                  <div>
                    <p>{avg.round}</p>
                    <p className="text-gray-600">Average Score</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <span className="text-blue-600">{avg.average}</span>
                  {avg.trend === 'up' ? (
                    <TrendingUp className="w-4 h-4 text-green-600" />
                  ) : (
                    <TrendingUp className="w-4 h-4 text-red-600 rotate-180" />
                  )}
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
