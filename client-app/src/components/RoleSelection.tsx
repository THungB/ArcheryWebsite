import { useState } from 'react';
import { Target, ClipboardCheck, Check, AlertCircle, Eye, EyeOff, User, Mail, Phone, Shield } from 'lucide-react';
import { Button } from './ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Alert, AlertDescription } from './ui/alert';
import { testUsers } from '../data/test-users';

interface RoleSelectionProps {
  onRoleSelect: (role: 'archer' | 'recorder', userId: string, username: string) => void;
}

export function RoleSelection({ onRoleSelect }: RoleSelectionProps) {
  const [selectedRole, setSelectedRole] = useState<'archer' | 'recorder' | null>(null);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [isLoading, setIsLoading] = useState(false);

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

  const handleLogin = async () => {
    setError('');
    setSuccess('');
    setIsLoading(true);

    if (!username || !password || !selectedRole) {
      setError('Please enter both username and password');
      setIsLoading(false);
      return;
    }

    // Simulate API call delay
    await new Promise(resolve => setTimeout(resolve, 1000));

    // Validate credentials from test users JSON
    const users = selectedRole === 'archer' ? testUsers.archers : testUsers.recorders;
    const user = users.find(u => u.username === username && u.password === password);

    setIsLoading(false);

    if (user) {
      // Successful login - pass the numeric user ID, not the name
      onRoleSelect(selectedRole, user.id.toString(), username);
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
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
            <Card
              className="cursor-pointer hover:shadow-lg transition-all duration-200 border-2 hover:border-blue-500 hover:scale-[1.02] active:scale-[0.98]"
              onClick={() => setSelectedRole('archer')}
              role="button"
              tabIndex={0}
              onKeyDown={(e) => e.key === 'Enter' && setSelectedRole('archer')}
              aria-label="Select Archer role"
            >
              <CardHeader className="text-center pb-4">
                <div className="mx-auto w-12 h-12 sm:w-16 sm:h-16 bg-blue-100 rounded-full flex items-center justify-center mb-3 sm:mb-4">
                  <Target className="w-6 h-6 sm:w-8 sm:h-8 text-blue-600" />
                </div>
                <CardTitle className="text-lg sm:text-xl">Archer</CardTitle>
                <CardDescription className="text-sm">Compete and track your scores</CardDescription>
              </CardHeader>
              <CardContent className="pt-0">
                <ul className="space-y-2 text-gray-600 text-sm">
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
              className="cursor-pointer hover:shadow-lg transition-all duration-200 border-2 hover:border-green-500 hover:scale-[1.02] active:scale-[0.98]"
              onClick={() => setSelectedRole('recorder')}
              role="button"
              tabIndex={0}
              onKeyDown={(e) => e.key === 'Enter' && setSelectedRole('recorder')}
              aria-label="Select Recorder role"
            >
              <CardHeader className="text-center pb-4">
                <div className="mx-auto w-12 h-12 sm:w-16 sm:h-16 bg-green-100 rounded-full flex items-center justify-center mb-3 sm:mb-4">
                  <ClipboardCheck className="w-6 h-6 sm:w-8 sm:h-8 text-green-600" />
                </div>
                <CardTitle className="text-lg sm:text-xl">Recorder</CardTitle>
                <CardDescription className="text-sm">Manage competitions and archers</CardDescription>
              </CardHeader>
              <CardContent className="pt-0">
                <ul className="space-y-2 text-gray-600 text-sm">
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
                <TabsContent value="login" className="space-y-6">
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="username" className="text-sm font-medium flex items-center gap-2">
                        <User className="w-4 h-4" />
                        Username
                      </Label>
                      <Input
                        id="username"
                        placeholder="Enter your username"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        onKeyDown={(e) => e.key === 'Enter' && !isLoading && handleLogin()}
                        className={`h-11 ${error && !username ? 'border-red-500 focus:border-red-500' : ''}`}
                        disabled={isLoading}
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="password" className="text-sm font-medium flex items-center gap-2">
                        <Shield className="w-4 h-4" />
                        Password
                      </Label>
                      <div className="relative">
                        <Input
                          id="password"
                          type={showPassword ? "text" : "password"}
                          placeholder="Enter your password"
                          value={password}
                          onChange={(e) => setPassword(e.target.value)}
                          onKeyDown={(e) => e.key === 'Enter' && !isLoading && handleLogin()}
                          className={`h-11 pr-10 ${error && !password ? 'border-red-500 focus:border-red-500' : ''}`}
                          disabled={isLoading}
                        />
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                          onClick={() => setShowPassword(!showPassword)}
                          disabled={isLoading}
                        >
                          {showPassword ? (
                            <EyeOff className="h-4 w-4 text-gray-400" />
                          ) : (
                            <Eye className="h-4 w-4 text-gray-400" />
                          )}
                        </Button>
                      </div>
                    </div>
                  </div>

                  {error && (
                    <Alert variant="destructive">
                      <AlertCircle className="h-4 w-4" />
                      <AlertDescription>{error}</AlertDescription>
                    </Alert>
                  )}

                  {success && (
                    <Alert className="border-green-200 bg-green-50 text-green-800">
                      <Check className="h-4 w-4" />
                      <AlertDescription>{success}</AlertDescription>
                    </Alert>
                  )}

                  <div className="bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200 rounded-lg p-4">
                    <div className="flex items-start gap-3">
                      <div className="w-2 h-2 bg-blue-500 rounded-full mt-2 flex-shrink-0"></div>
                      <div className="space-y-2">
                        <p className="text-sm font-medium text-blue-900">Test Credentials</p>
                        <div className="text-sm text-blue-800 space-y-1">
                          <p><strong>Username:</strong> {selectedRole === 'archer' ? 'archer1' : 'recorder1'}</p>
                          <p><strong>Password:</strong> {selectedRole === 'archer' ? 'archer123' : 'recorder123'}</p>
                          {selectedRole === 'recorder' && (
                            <div className="mt-3 pt-3 border-t border-blue-300">
                              <p className="font-medium">Admin Account:</p>
                              <p><strong>Username:</strong> Admin</p>
                              <p><strong>Password:</strong> TechNova</p>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="flex gap-3 pt-2">
                    <Button
                      variant="outline"
                      className="flex-1 h-11"
                      onClick={resetForm}
                      disabled={isLoading}
                    >
                      Back
                    </Button>
                    <Button
                      className="flex-1 h-11"
                      onClick={handleLogin}
                      disabled={!username || !password || isLoading}
                    >
                      {isLoading ? (
                        <div className="flex items-center gap-2">
                          <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                          Signing in...
                        </div>
                      ) : (
                        'Sign In'
                      )}
                    </Button>
                  </div>
                </TabsContent>

                {/* Register Tab */}
                <TabsContent value="register" className="space-y-6">
                  {/* Personal Information Section */}
                  <div className="space-y-4">
                    <div className="flex items-center gap-2 pb-2 border-b">
                      <User className="w-5 h-5 text-blue-600" />
                      <h3 className="text-lg font-medium">Personal Information</h3>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="reg-name" className="text-sm font-medium">
                          Full Name <span className="text-red-500">*</span>
                        </Label>
                        <Input
                          id="reg-name"
                          placeholder="Enter your full name"
                          value={regName}
                          onChange={(e) => setRegName(e.target.value)}
                          className="h-11"
                        />
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="reg-username" className="text-sm font-medium">
                          Username <span className="text-red-500">*</span>
                        </Label>
                        <Input
                          id="reg-username"
                          placeholder="Choose a username"
                          value={regUsername}
                          onChange={(e) => setRegUsername(e.target.value)}
                          className="h-11"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="reg-email" className="text-sm font-medium flex items-center gap-2">
                          <Mail className="w-4 h-4" />
                          Email <span className="text-red-500">*</span>
                        </Label>
                        <Input
                          id="reg-email"
                          type="email"
                          placeholder="your.email@example.com"
                          value={regEmail}
                          onChange={(e) => setRegEmail(e.target.value)}
                          className="h-11"
                        />
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="reg-phone" className="text-sm font-medium flex items-center gap-2">
                          <Phone className="w-4 h-4" />
                          Phone Number
                        </Label>
                        <Input
                          id="reg-phone"
                          type="tel"
                          placeholder="+1-555-0123"
                          value={regPhone}
                          onChange={(e) => setRegPhone(e.target.value)}
                          className="h-11"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Archer-Specific Information */}
                  {selectedRole === 'archer' && (
                    <div className="space-y-4">
                      <div className="flex items-center gap-2 pb-2 border-b">
                        <Target className="w-5 h-5 text-green-600" />
                        <h3 className="text-lg font-medium">Archery Information</h3>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor="reg-archer-number" className="text-sm font-medium">
                            Archer Number <span className="text-red-500">*</span>
                          </Label>
                          <Input
                            id="reg-archer-number"
                            placeholder="e.g., ARC006"
                            value={regArcherNumber}
                            onChange={(e) => setRegArcherNumber(e.target.value)}
                            className="h-11"
                          />
                        </div>

                        <div className="space-y-2">
                          <Label htmlFor="reg-bow-type" className="text-sm font-medium">
                            Bow Type
                          </Label>
                          <Select value={regBowType} onValueChange={setRegBowType}>
                            <SelectTrigger id="reg-bow-type" className="h-11">
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
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="reg-category" className="text-sm font-medium">
                          Category <span className="text-red-500">*</span>
                        </Label>
                        <Input
                          id="reg-category"
                          placeholder="e.g., Recurve - Senior Men"
                          value={regCategory}
                          onChange={(e) => setRegCategory(e.target.value)}
                          className="h-11"
                        />
                      </div>
                    </div>
                  )}

                  {/* Security Section */}
                  <div className="space-y-4">
                    <div className="flex items-center gap-2 pb-2 border-b">
                      <Shield className="w-5 h-5 text-orange-600" />
                      <h3 className="text-lg font-medium">Security</h3>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="reg-password" className="text-sm font-medium">
                          Password <span className="text-red-500">*</span>
                        </Label>
                        <Input
                          id="reg-password"
                          type="password"
                          placeholder="At least 6 characters"
                          value={regPassword}
                          onChange={(e) => setRegPassword(e.target.value)}
                          className="h-11"
                        />
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="reg-confirm-password" className="text-sm font-medium">
                          Confirm Password <span className="text-red-500">*</span>
                        </Label>
                        <Input
                          id="reg-confirm-password"
                          type="password"
                          placeholder="Re-enter password"
                          value={regConfirmPassword}
                          onChange={(e) => setRegConfirmPassword(e.target.value)}
                          className="h-11"
                        />
                      </div>
                    </div>
                  </div>

                  {error && (
                    <Alert variant="destructive">
                      <AlertCircle className="h-4 w-4" />
                      <AlertDescription>{error}</AlertDescription>
                    </Alert>
                  )}

                  {success && (
                    <Alert className="border-green-200 bg-green-50 text-green-800">
                      <Check className="h-4 w-4" />
                      <AlertDescription>{success}</AlertDescription>
                    </Alert>
                  )}

                  <Alert className="border-amber-200 bg-amber-50 text-amber-800">
                    <AlertCircle className="h-4 w-4" />
                    <AlertDescription>
                      <strong>Note:</strong> Registration is for demonstration only. Please use test accounts to login.
                    </AlertDescription>
                  </Alert>

                  <div className="flex gap-3 pt-2">
                    <Button
                      variant="outline"
                      className="flex-1 h-11"
                      onClick={resetForm}
                    >
                      Back
                    </Button>
                    <Button
                      className="flex-1 h-11"
                      onClick={handleRegister}
                    >
                      Create Account
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