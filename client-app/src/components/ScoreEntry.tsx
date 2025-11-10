import { useState } from 'react';
import { X, Save } from 'lucide-react';
import { Button } from './ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Textarea } from './ui/textarea';

interface ScoreEntryProps {
  userId: string;
  onClose: () => void;
  onSubmit: () => void;
}

export function ScoreEntry({ userId, onClose, onSubmit }: ScoreEntryProps) {
  const [competition, setCompetition] = useState('');
  const [round, setRound] = useState('');
  const [distance, setDistance] = useState('');
  const [scores, setScores] = useState<string[]>(Array(6).fill(''));
  const [notes, setNotes] = useState('');

  const handleScoreChange = (index: number, value: string) => {
    const newScores = [...scores];
    newScores[index] = value;
    setScores(newScores);
  };

  const calculateTotal = () => {
    return scores.reduce((sum, score) => sum + (parseInt(score) || 0), 0);
  };

  const handleSubmit = () => {
    // In real implementation, this would send to backend
    console.log('Submitting score:', {
      userId,
      competition,
      round,
      distance,
      scores,
      total: calculateTotal(),
      notes,
    });
    onSubmit();
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
      <Card className="w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Submit Score</CardTitle>
              <CardDescription>Enter your competition score details</CardDescription>
            </div>
            <Button variant="ghost" size="sm" onClick={onClose}>
              <X className="w-4 h-4" />
            </Button>
          </div>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Competition Details */}
          <div className="grid md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Competition</Label>
              <Select value={competition} onValueChange={setCompetition}>
                <SelectTrigger>
                  <SelectValue placeholder="Select competition" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="spring-championship">Spring Championship 2024</SelectItem>
                  <SelectItem value="indoor-open">Indoor Open</SelectItem>
                  <SelectItem value="summer-series">Summer Series Round 3</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>Round Type</Label>
              <Select value={round} onValueChange={setRound}>
                <SelectTrigger>
                  <SelectValue placeholder="Select round" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="720">720 Round</SelectItem>
                  <SelectItem value="1440">1440 Round</SelectItem>
                  <SelectItem value="fita">FITA Round</SelectItem>
                  <SelectItem value="wa">WA 70m Round</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="space-y-2">
            <Label>Distance</Label>
            <Select value={distance} onValueChange={setDistance}>
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

          {/* Score Entry */}
          <div className="space-y-4">
            <Label>End Scores (6 ends)</Label>
            <div className="grid grid-cols-3 gap-3">
              {scores.map((score, index) => (
                <div key={index} className="space-y-2">
                  <Label>End {index + 1}</Label>
                  <Input
                    type="number"
                    placeholder="0-60"
                    value={score}
                    onChange={(e) => handleScoreChange(index, e.target.value)}
                    min="0"
                    max="60"
                  />
                </div>
              ))}
            </div>
          </div>

          {/* Total */}
          <div className="bg-blue-50 p-4 rounded-lg">
            <div className="flex items-center justify-between">
              <span className="text-gray-700">Total Score:</span>
              <span className="text-blue-600">{calculateTotal()}</span>
            </div>
          </div>

          {/* Notes */}
          <div className="space-y-2">
            <Label>Notes (Optional)</Label>
            <Textarea
              placeholder="Add any notes about this score..."
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              rows={3}
            />
          </div>

          {/* Actions */}
          <div className="flex gap-3">
            <Button variant="outline" className="flex-1" onClick={onClose}>
              Cancel
            </Button>
            <Button 
              className="flex-1" 
              onClick={handleSubmit}
              disabled={!competition || !round || !distance || scores.every(s => !s)}
            >
              <Save className="w-4 h-4 mr-2" />
              Submit Score
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
