import { useState } from 'react';
import { RoleSelection } from './components/RoleSelection';
import { ArcherDashboard } from './components/ArcherDashboard';
import { RecorderDashboard } from './components/RecorderDashboard';
import { Footer } from './components/Footer';

export default function App() {
    // Start with role selection screen
    const [role, setRole] = useState<'archer' | 'recorder' | null>(null);
    const [userId, setUserId] = useState<string | null>(null);
    const [username, setUsername] = useState<string | null>(null);

    const handleRoleSelect = (selectedRole: 'archer' | 'recorder', id: string, user: string) => {
        setRole(selectedRole);
        setUserId(id);
        setUsername(user);
    };

    const handleLogout = () => {
        setRole(null);
        setUserId(null);
        setUsername(null);
    };

    if (!role) {
        return (
            <div className="min-h-screen flex flex-col">
                <RoleSelection onRoleSelect={handleRoleSelect} />
                <Footer />
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50 flex flex-col">
            {role === 'archer' && <ArcherDashboard userId={userId!} onLogout={handleLogout} />}
            {role === 'recorder' && <RecorderDashboard username={username!} onLogout={handleLogout} />}
            <Footer />
        </div>
    );
}