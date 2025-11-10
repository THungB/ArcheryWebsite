import { useState } from 'react';
import { Target, ClipboardCheck, Check } from 'lucide-react';
import { Button } from './ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { testUsers } from '../data/test-users';

interface RoleSelectionProps {
  onRoleSelect: (role: 'archer' | 'recorder', userId: string, username: string) => void;
}

export function RoleSelection({ onRoleSelect }: RoleSelectionProps) {
  const [selectedRole, setSelectedRole] = useState<'archer' | 'recorder' | null>(null);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  // Registration fields
  const [regUsername, setRegUsername] = useState('');
  const [regPassword, setRegPassword] = useState('');
  const [regConfirmPassword, setRegConfirmPassword] = useState('');
  const [regName, setRegName] = useState('');
  const [regEmail, setRegEmail] = useState('');
  const [regPhone, setRegPhone] = useState('');
  
  // Archer-specific fields
  const [regArcherNumber, setRegArcherNumber] = useState('');
  const [regBowType, setRegBowType] = useState('Recurve');
  const [regCategory, setRegCategory] = useState('');

  const handleLogin = () => {
    setError('');
    setSuccess('');
    
    if (!username || !password || !selectedRole) {
      setError('Please enter both username and password');
      return;
    }

    // Validate credentials from test users JSON
    const users = selectedRole === 'archer' ? testUsers.archers : testUsers.recorders;
    const user = users.find(u => u.username === username && u.password === password);

    if (user) {
      // Successful login
      onRoleSelect(selectedRole, user.name, username);
    } else {
      setError('Invalid username or password');
    }
  };

  const handleRegister = () => {
    setError('');
    setSuccess('');

    // Validation
    if (!regUsername || !regPassword || !regConfirmPassword || !regName || !regEmail) {
      setError('Please fill in all required fields');
      return;
    }

    if (regPassword !== regConfirmPassword) {
      setError('Passwords do not match');
      return;
    }

    if (regPassword.length < 6) {
      setError('Password must be at least 6 characters');
      return;
    }

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(regEmail)) {
      setError('Please enter a valid email address');
      return;
    }

    // Check if username already exists
    const allUsers = [...testUsers.archers, ...testUsers.recorders];
    if (allUsers.find(u => u.username === regUsername)) {
      setError('Username already exists');
      return;
    }

    // Archer-specific validation
    if (selectedRole === 'archer') {
      if (!regArcherNumber || !regCategory) {
        setError('Please fill in archer number and category');
        return;
      }
    }

    // In production, this would call the API to register the user
    // For now, show success message
    setSuccess('Registration successful! In production, this would save to the database. For testing, please use the test accounts provided.');
    
    // Clear form
    setTimeout(() => {
      setRegUsername('');
      setRegPassword('');
      setRegConfirmPassword('');
      setRegName('');
      setRegEmail('');
      setRegPhone('');
      setRegArcherNumber('');
      setRegCategory('');
      setSuccess('');
    }, 3000);
  };

  const resetForm = () => {
    setSelectedRole(null);
    setError('');
    setSuccess('');
    setUsername('');
    setPassword('');
    setRegUsername('');
    setRegPassword('');
    setRegConfirmPassword('');
    setRegName('');
    setRegEmail('');
    setRegPhone('');
    setRegArcherNumber('');
    setRegCategory('');
  };

  return (
    <div className="flex-1 bg-gradient-to-br from-blue-50 via-white to-green-50 flex items-center justify-center p-4">
      <div className="w-full max-w-4xl">
        <div className="text-center mb-8">
          <h1 className="mb-2">Archery Database Management System</h1>
          <p className="text-gray-600">Select your role to continue</p>
        </div>

        {!selectedRole ? (
          <div className="grid md:grid-cols-2 gap-6">
            <Card 
              className="cursor-pointer hover:shadow-lg transition-shadow border-2 hover:border-blue-500"
              onClick={() => setSelectedRole('archer')}
            >
              <CardHeader className="text-center">
                <div className="mx-auto w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mb-4">
                  <Target className="w-8 h-8 text-blue-600" />
                </div>
                <CardTitle>Archer</CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2 text-gray-600">
                  <li className="flex items-center gap-2">
                    <Check className="w-4 h-4 text-green-600 flex-shrink-0" />
                    Submit competition scores
                  </li>
                  <li className="flex items-center gap-2">
                    <Check className="w-4 h-4 text-green-600 flex-shrink-0" />
                    Track personal records
                  </li>
                  <li className="flex items-center gap-2">
                    <Check className="w-4 h-4 text-green-600 flex-shrink-0" />
                    View leaderboards
                  </li>
                  <li className="flex items-center gap-2">
                    <Check className="w-4 h-4 text-green-600 flex-shrink-0" />
                    Check competition schedules
                  </li>
                </ul>
              </CardContent>
            </Card>

            <Card 
              className="cursor-pointer hover:shadow-lg transition-shadow border-2 hover:border-green-500"
              onClick={() => setSelectedRole('recorder')}
            >
              <CardHeader className="text-center">
                <div className="mx-auto w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mb-4">
                  <ClipboardCheck className="w-8 h-8 text-green-600" />
                </div>
                <CardTitle>Recorder</CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2 text-gray-600">
                  <li className="flex items-center gap-2">
                    <Check className="w-4 h-4 text-green-600 flex-shrink-0" />
                    Manage archer profiles
                  </li>
                  <li className="flex items-center gap-2">
                    <Check className="w-4 h-4 text-green-600 flex-shrink-0" />
                    Create and manage competitions
                  </li>
                  <li className="flex items-center gap-2">
                    <Check className="w-4 h-4 text-green-600 flex-shrink-0" />
                    Approve and verify scores
                  </li>
                  <li className="flex items-center gap-2">
                    <Check className="w-4 h-4 text-green-600 flex-shrink-0" />
                    Ensure rule compliance
                  </li>
                </ul>
              </CardContent>
            </Card>
          </div>
        ) : (
          <Card className="max-w-lg mx-auto">
            <CardHeader>
              <CardTitle>
                {selectedRole === 'archer' ? 'Archer' : 'Recorder'} Account
              </CardTitle>
              <CardDescription>
                Login to your account or register a new one
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Tabs defaultValue="login" className="w-full">
                <TabsList className="grid w-full grid-cols-2">
                  <TabsTrigger value="login">Login</TabsTrigger>
                  <TabsTrigger value="register">Register</TabsTrigger>
                </TabsList>

                {/* Login Tab */}
                <TabsContent value="login" className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="username">Username</Label>
                    <Input
                      id="username"
                      placeholder="Enter username"
                      value={username}
                      onChange={(e) => setUsername(e.target.value)}
                      onKeyDown={(e) => e.key === 'Enter' && handleLogin()}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="password">Password</Label>
                    <Input
                      id="password"
                      type="password"
                      placeholder="Enter password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      onKeyDown={(e) => e.key === 'Enter' && handleLogin()}
                    />
                  </div>

                  {error && (
                    <div className="p-3 bg-red-50 border border-red-200 rounded text-red-700">
                      {error}
                    </div>
                  )}

                  {success && (
                    <div className="p-3 bg-green-50 border border-green-200 rounded text-green-700">
                      {success}
                    </div>
                  )}

                  <div className="p-3 bg-blue-50 border border-blue-200 rounded text-blue-700">
                    <p className="mb-1">Test Credentials:</p>
                    <p>
                      <strong>Username:</strong> {selectedRole === 'archer' ? 'archer1' : 'recorder1'}
                    </p>
                    <p>
                      <strong>Password:</strong> {selectedRole === 'archer' ? 'archer123' : 'recorder123'}
                    </p>
                    {selectedRole === 'recorder' && (
                      <div className="mt-3 pt-3 border-t border-blue-300">
                        <p className="mb-1">Admin Account:</p>
                        <p>
                          <strong>Username:</strong> Admin
                        </p>
                        <p>
                          <strong>Password:</strong> TechNova
                        </p>
                      </div>
                    )}
                  </div>

                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      className="flex-1"
                      onClick={resetForm}
                    >
                      Back
                    </Button>
                    <Button
                      className="flex-1"
                      onClick={handleLogin}
                      disabled={!username || !password}
                    >
                      Login
                    </Button>
                  </div>
                </TabsContent>

                {/* Register Tab */}
                <TabsContent value="register" className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="reg-name">Full Name *</Label>
                    <Input
                      id="reg-name"
                      placeholder="Enter your full name"
                      value={regName}
                      onChange={(e) => setRegName(e.target.value)}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="reg-username">Username *</Label>
                    <Input
                      id="reg-username"
                      placeholder="Choose a username"
                      value={regUsername}
                      onChange={(e) => setRegUsername(e.target.value)}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="reg-email">Email *</Label>
                    <Input
                      id="reg-email"
                      type="email"
                      placeholder="your.email@example.com"
                      value={regEmail}
                      onChange={(e) => setRegEmail(e.target.value)}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="reg-phone">Phone Number</Label>
                    <Input
                      id="reg-phone"
                      type="tel"
                      placeholder="+1-555-0123"
                      value={regPhone}
                      onChange={(e) => setRegPhone(e.target.value)}
                    />
                  </div>

                  {selectedRole === 'archer' && (
                    <>
                      <div className="space-y-2">
                        <Label htmlFor="reg-archer-number">Archer Number *</Label>
                        <Input
                          id="reg-archer-number"
                          placeholder="e.g., ARC006"
                          value={regArcherNumber}
                          onChange={(e) => setRegArcherNumber(e.target.value)}
                        />
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="reg-bow-type">Bow Type</Label>
                        <Select value={regBowType} onValueChange={setRegBowType}>
                          <SelectTrigger id="reg-bow-type">
                            <SelectValue placeholder="Select bow type" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="Recurve">Recurve</SelectItem>
                            <SelectItem value="Compound">Compound</SelectItem>
                            <SelectItem value="Barebow">Barebow</SelectItem>
                            <SelectItem value="Longbow">Longbow</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="reg-category">Category *</Label>
                        <Input
                          id="reg-category"
                          placeholder="e.g., Recurve - Senior Men"
                          value={regCategory}
                          onChange={(e) => setRegCategory(e.target.value)}
                        />
                      </div>
                    </>
                  )}

                  <div className="space-y-2">
                    <Label htmlFor="reg-password">Password *</Label>
                    <Input
                      id="reg-password"
                      type="password"
                      placeholder="At least 6 characters"
                      value={regPassword}
                      onChange={(e) => setRegPassword(e.target.value)}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="reg-confirm-password">Confirm Password *</Label>
                    <Input
                      id="reg-confirm-password"
                      type="password"
                      placeholder="Re-enter password"
                      value={regConfirmPassword}
                      onChange={(e) => setRegConfirmPassword(e.target.value)}
                    />
                  </div>

                  {error && (
                    <div className="p-3 bg-red-50 border border-red-200 rounded text-red-700">
                      {error}
                    </div>
                  )}

                  {success && (
                    <div className="p-3 bg-green-50 border border-green-200 rounded text-green-700">
                      {success}
                    </div>
                  )}

                  <div className="p-3 bg-amber-50 border border-amber-200 rounded text-amber-700">
                    <p>⚠️ <strong>Note:</strong> Registration is for demonstration only. Please use test accounts to login.</p>
                  </div>

                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      className="flex-1"
                      onClick={resetForm}
                    >
                      Back
                    </Button>
                    <Button
                      className="flex-1"
                      onClick={handleRegister}
                    >
                      Register
                    </Button>
                  </div>
                </TabsContent>
              </Tabs>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}