import { useState } from 'react';
import { Plus, Edit, Trash2, Calendar, Users, Target } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from './ui/dialog';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Textarea } from './ui/textarea';

export function CompetitionManagement() {
  const [showCreateDialog, setShowCreateDialog] = useState(false);
  const [newCompetition, setNewCompetition] = useState({
    name: '',
    date: '',
    location: '',
    roundType: '',
    distance: '',
    maxParticipants: '',
    description: '',
  });

  // Mock data - would come from backend
  const competitions = [
    {
      id: 1,
      name: 'Spring Championship 2024',
      date: '2024-11-05',
      location: 'National Archery Center',
      roundType: '720 Round',
      distance: '70m',
      participants: 45,
      maxParticipants: 50,
      status: 'active',
    },
    {
      id: 2,
      name: 'Indoor Open',
      date: '2024-11-03',
      location: 'City Sports Complex',
      roundType: 'WA 18m',
      distance: '18m',
      participants: 32,
      maxParticipants: 40,
      status: 'active',
    },
    {
      id: 3,
      name: 'Winter Championship 2024',
      date: '2024-12-15',
      location: 'National Archery Center',
      roundType: '720 Round',
      distance: '70m',
      participants: 12,
      maxParticipants: 60,
      status: 'upcoming',
    },
    {
      id: 4,
      name: 'Summer Series Round 3',
      date: '2024-09-15',
      location: 'Regional Sports Ground',
      roundType: 'FITA Round',
      distance: '50m',
      participants: 38,
      maxParticipants: 40,
      status: 'completed',
    },
  ];

  const handleCreate = () => {
    console.log('Creating competition:', newCompetition);
    // In real implementation, this would send to backend
    setShowCreateDialog(false);
    setNewCompetition({
      name: '',
      date: '',
      location: '',
      roundType: '',
      distance: '',
      maxParticipants: '',
      description: '',
    });
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'active':
        return <Badge className="bg-green-100 text-green-700">Active</Badge>;
      case 'upcoming':
        return <Badge className="bg-blue-100 text-blue-700">Upcoming</Badge>;
      case 'completed':
        return <Badge className="bg-gray-100 text-gray-700">Completed</Badge>;
      default:
        return null;
    }
  };

  return (
    <>
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Competition Management</CardTitle>
              <CardDescription>Create and manage archery competitions</CardDescription>
            </div>
            <Button onClick={() => setShowCreateDialog(true)}>
              <Plus className="w-4 h-4 mr-2" />
              New Competition
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {competitions.map((comp) => (
              <div key={comp.id} className="border rounded-lg p-4">
                <div className="flex items-start justify-between mb-3">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h4>{comp.name}</h4>
                      {getStatusBadge(comp.status)}
                    </div>
                    <div className="grid md:grid-cols-2 gap-2 text-gray-600">
                      <div className="flex items-center gap-2">
                        <Calendar className="w-4 h-4" />
                        <span>{comp.date}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Target className="w-4 h-4" />
                        <span>{comp.roundType} - {comp.distance}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Users className="w-4 h-4" />
                        <span>{comp.participants} / {comp.maxParticipants} participants</span>
                      </div>
                      <div>📍 {comp.location}</div>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <Button variant="ghost" size="sm">
                      <Edit className="w-4 h-4" />
                    </Button>
                    <Button variant="ghost" size="sm">
                      <Trash2 className="w-4 h-4 text-red-600" />
                    </Button>
                  </div>
                </div>
                <div className="bg-gray-100 rounded-full h-2">
                  <div
                    className="bg-blue-600 h-2 rounded-full"
                    style={{ width: `${(comp.participants / comp.maxParticipants) * 100}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Create Competition Dialog */}
      <Dialog open={showCreateDialog} onOpenChange={setShowCreateDialog}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Create New Competition</DialogTitle>
            <DialogDescription>
              Set up a new archery competition
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4">
            <div className="space-y-2">
              <Label>Competition Name</Label>
              <Input
                placeholder="e.g., Spring Championship 2024"
                value={newCompetition.name}
                onChange={(e) => setNewCompetition({ ...newCompetition, name: e.target.value })}
              />
            </div>

            <div className="grid md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Date</Label>
                <Input
                  type="date"
                  value={newCompetition.date}
                  onChange={(e) => setNewCompetition({ ...newCompetition, date: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label>Location</Label>
                <Input
                  placeholder="Venue name"
                  value={newCompetition.location}
                  onChange={(e) => setNewCompetition({ ...newCompetition, location: e.target.value })}
                />
              </div>
            </div>

            <div className="grid md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Round Type</Label>
                <Select
                  value={newCompetition.roundType}
                  onValueChange={(value) => setNewCompetition({ ...newCompetition, roundType: value })}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select round type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="720">720 Round</SelectItem>
                    <SelectItem value="1440">1440 Round</SelectItem>
                    <SelectItem value="fita">FITA Round</SelectItem>
                    <SelectItem value="wa">WA Round</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>Distance</Label>
                <Select
                  value={newCompetition.distance}
                  onValueChange={(value) => setNewCompetition({ ...newCompetition, distance: value })}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select distance" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="18m">18 meters</SelectItem>
                    <SelectItem value="30m">30 meters</SelectItem>
                    <SelectItem value="50m">50 meters</SelectItem>
                    <SelectItem value="70m">70 meters</SelectItem>
                    <SelectItem value="90m">90 meters</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="space-y-2">
              <Label>Maximum Participants</Label>
              <Input
                type="number"
                placeholder="e.g., 50"
                value={newCompetition.maxParticipants}
                onChange={(e) => setNewCompetition({ ...newCompetition, maxParticipants: e.target.value })}
              />
            </div>

            <div className="space-y-2">
              <Label>Description (Optional)</Label>
              <Textarea
                placeholder="Add competition details..."
                value={newCompetition.description}
                onChange={(e) => setNewCompetition({ ...newCompetition, description: e.target.value })}
                rows={3}
              />
            </div>

            <div className="flex gap-3">
              <Button
                variant="outline"
                className="flex-1"
                onClick={() => setShowCreateDialog(false)}
              >
                Cancel
              </Button>
              <Button
                className="flex-1"
                onClick={handleCreate}
                disabled={!newCompetition.name || !newCompetition.date || !newCompetition.roundType}
              >
                Create Competition
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
