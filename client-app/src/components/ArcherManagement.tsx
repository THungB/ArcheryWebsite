import { useState } from 'react';
import { Plus, Edit, Trash2, Search, Mail, Phone, Award } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Badge } from './ui/badge';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from './ui/dialog';
import { Label } from './ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from './ui/table';

export function ArcherManagement() {
  const [searchTerm, setSearchTerm] = useState('');
  const [showCreateDialog, setShowCreateDialog] = useState(false);
  const [newArcher, setNewArcher] = useState({
    name: '',
    email: '',
    phone: '',
    archerNumber: '',
    category: '',
    bowType: '',
  });

  // Mock data - would come from backend
  const archers = [
    {
      id: 1,
      name: 'John Smith',
      archerNumber: 'A-2345',
      email: 'john.smith@email.com',
      phone: '+1234567890',
      category: 'Recurve - Senior Men',
      bowType: 'Recurve',
      personalBest: 687,
      competitions: 12,
      status: 'active',
    },
    {
      id: 2,
      name: 'Emma Davis',
      archerNumber: 'A-1289',
      email: 'emma.davis@email.com',
      phone: '+1234567891',
      category: 'Compound - Senior Women',
      bowType: 'Compound',
      personalBest: 692,
      competitions: 8,
      status: 'active',
    },
    {
      id: 3,
      name: 'Michael Chen',
      archerNumber: 'A-3456',
      email: 'michael.chen@email.com',
      phone: '+1234567892',
      category: 'Recurve - Senior Men',
      bowType: 'Recurve',
      personalBest: 658,
      competitions: 15,
      status: 'active',
    },
    {
      id: 4,
      name: 'Sarah Johnson',
      archerNumber: 'A-4567',
      email: 'sarah.j@email.com',
      phone: '+1234567893',
      category: 'Recurve - Senior Women',
      bowType: 'Recurve',
      personalBest: 698,
      competitions: 20,
      status: 'active',
    },
  ];

  const filteredArchers = archers.filter(
    (archer) =>
      archer.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      archer.archerNumber.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleCreate = () => {
    console.log('Creating archer:', newArcher);
    // In real implementation, this would send to backend
    setShowCreateDialog(false);
    setNewArcher({
      name: '',
      email: '',
      phone: '',
      archerNumber: '',
      category: '',
      bowType: '',
    });
  };

  return (
    <>
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between mb-4">
            <div>
              <CardTitle>Archer Management</CardTitle>
              <CardDescription>Manage registered archers</CardDescription>
            </div>
            <Button onClick={() => setShowCreateDialog(true)}>
              <Plus className="w-4 h-4 mr-2" />
              Add Archer
            </Button>
          </div>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <Input
              placeholder="Search by name or archer number..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Archer</TableHead>
                <TableHead>Contact</TableHead>
                <TableHead>Category</TableHead>
                <TableHead>Bow Type</TableHead>
                <TableHead>Personal Best</TableHead>
                <TableHead>Competitions</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredArchers.map((archer) => (
                <TableRow key={archer.id}>
                  <TableCell>
                    <div>
                      <div>{archer.name}</div>
                      <div className="text-gray-500">{archer.archerNumber}</div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="space-y-1">
                      <div className="flex items-center gap-1 text-gray-600">
                        <Mail className="w-3 h-3" />
                        <span>{archer.email}</span>
                      </div>
                      <div className="flex items-center gap-1 text-gray-600">
                        <Phone className="w-3 h-3" />
                        <span>{archer.phone}</span>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>{archer.category}</TableCell>
                  <TableCell>
                    <Badge variant="outline">{archer.bowType}</Badge>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-1">
                      <Award className="w-4 h-4 text-yellow-600" />
                      <span>{archer.personalBest}</span>
                    </div>
                  </TableCell>
                  <TableCell>{archer.competitions}</TableCell>
                  <TableCell className="text-right">
                    <div className="flex gap-2 justify-end">
                      <Button variant="ghost" size="sm">
                        <Edit className="w-4 h-4" />
                      </Button>
                      <Button variant="ghost" size="sm">
                        <Trash2 className="w-4 h-4 text-red-600" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Create Archer Dialog */}
      <Dialog open={showCreateDialog} onOpenChange={setShowCreateDialog}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Add New Archer</DialogTitle>
            <DialogDescription>
              Register a new archer in the system
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4">
            <div className="grid md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Full Name</Label>
                <Input
                  placeholder="Enter full name"
                  value={newArcher.name}
                  onChange={(e) => setNewArcher({ ...newArcher, name: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label>Archer Number</Label>
                <Input
                  placeholder="e.g., A-1234"
                  value={newArcher.archerNumber}
                  onChange={(e) => setNewArcher({ ...newArcher, archerNumber: e.target.value })}
                />
              </div>
            </div>

            <div className="grid md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Email</Label>
                <Input
                  type="email"
                  placeholder="archer@email.com"
                  value={newArcher.email}
                  onChange={(e) => setNewArcher({ ...newArcher, email: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label>Phone</Label>
                <Input
                  type="tel"
                  placeholder="+1234567890"
                  value={newArcher.phone}
                  onChange={(e) => setNewArcher({ ...newArcher, phone: e.target.value })}
                />
              </div>
            </div>

            <div className="grid md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Bow Type</Label>
                <Select
                  value={newArcher.bowType}
                  onValueChange={(value) => setNewArcher({ ...newArcher, bowType: value })}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select bow type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="recurve">Recurve</SelectItem>
                    <SelectItem value="compound">Compound</SelectItem>
                    <SelectItem value="barebow">Barebow</SelectItem>
                    <SelectItem value="longbow">Longbow</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>Category</Label>
                <Select
                  value={newArcher.category}
                  onValueChange={(value) => setNewArcher({ ...newArcher, category: value })}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select category" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="recurve-senior-men">Recurve - Senior Men</SelectItem>
                    <SelectItem value="recurve-senior-women">Recurve - Senior Women</SelectItem>
                    <SelectItem value="compound-senior-men">Compound - Senior Men</SelectItem>
                    <SelectItem value="compound-senior-women">Compound - Senior Women</SelectItem>
                    <SelectItem value="recurve-junior-men">Recurve - Junior Men</SelectItem>
                    <SelectItem value="recurve-junior-women">Recurve - Junior Women</SelectItem>
                  </SelectContent>
                </Select>
              </div>
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
                disabled={!newArcher.name || !newArcher.archerNumber || !newArcher.bowType}
              >
                Add Archer
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
