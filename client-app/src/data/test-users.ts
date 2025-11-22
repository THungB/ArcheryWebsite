// Test user accounts for development and testing only
// ⚠️ NEVER use these credentials in production!

export interface TestArcher {
  id: number;
  username: string;
  password: string;
  name: string;
  email: string;
  phone: string;
  archerNumber: string;
  category: string;
  bowType: string;
  status: string;
}

export interface TestRecorder {
  id: number;
  username: string;
  password: string;
  name: string;
  email: string;
  role: string;
  status: string;
}

export const testUsers = {
  archers: [
    {
      id: 1,
      username: "archer1",
      password: "archer123",
      name: "John Smith",
      email: "john.smith@example.com",
      phone: "+1-555-0101",
      archerNumber: "ARC001",
      category: "Recurve - Senior Men",
      bowType: "Recurve",
      status: "active"
    },
    {
      id: 2,
      username: "archer2",
      password: "archer123",
      name: "Sarah Johnson",
      email: "sarah.johnson@example.com",
      phone: "+1-555-0102",
      archerNumber: "ARC002",
      category: "Recurve - Senior Women",
      bowType: "Recurve",
      status: "active"
    },
    {
      id: 3,
      username: "archer3",
      password: "archer123",
      name: "Michael Chen",
      email: "michael.chen@example.com",
      phone: "+1-555-0103",
      archerNumber: "ARC003",
      category: "Compound - Senior Men",
      bowType: "Compound",
      status: "active"
    },
    {
      id: 4,
      username: "emma.davis",
      password: "archer123",
      name: "Emma Davis",
      email: "emma.davis@example.com",
      phone: "+1-555-0104",
      archerNumber: "ARC004",
      category: "Recurve - Senior Women",
      bowType: "Recurve",
      status: "active"
    },
    {
      id: 5,
      username: "james.wilson",
      password: "archer123",
      name: "James Wilson",
      email: "james.wilson@example.com",
      phone: "+1-555-0105",
      archerNumber: "ARC005",
      category: "Compound - Senior Men",
      bowType: "Compound",
      status: "active"
    }
  ] as TestArcher[],
  
  recorders: [
    {
      id: 1,
      username: "recorder1",
      password: "recorder123",
      name: "David Martinez",
      email: "david.martinez@example.com",
      role: "Head Recorder",
      status: "active"
    },
    {
      id: 2,
      username: "recorder2",
      password: "recorder123",
      name: "Lisa Anderson",
      email: "lisa.anderson@example.com",
      role: "Assistant Recorder",
      status: "active"
    },
    {
      id: 3,
      username: "Admin",
      password: "TechNova",
      name: "System Administrator",
      email: "admin@technova.com",
      role: "Administrator",
      status: "active"
    }
  ] as TestRecorder[],
  
  notes: {
    purpose: "Test user accounts for development and testing only",
    securityWarning: "⚠️ NEVER use these credentials in production!",
    defaultPasswords: {
      archers: "archer123",
      recorders: "recorder123",
      admin: "TechNova"
    },
    quickTestAccounts: {
      archer: {
        username: "archer1",
        password: "archer123"
      },
      recorder: {
        username: "recorder1",
        password: "recorder123"
      }
    }
  }
};

export default testUsers;
