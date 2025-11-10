import { useState } from 'react';
import { Bell, Trophy, TrendingUp, CheckCircle, AlertCircle, X, Settings } from 'lucide-react';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Card, CardContent } from './ui/card';
import { ScrollArea } from './ui/scroll-area';
import { Popover, PopoverContent, PopoverTrigger } from './ui/popover';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { Switch } from './ui/switch';
import { Label } from './ui/label';

interface Notification {
  id: number;
  type: 'record' | 'score_approved' | 'competition' | 'achievement' | 'system';
  title: string;
  message: string;
  timestamp: string;
  read: boolean;
  priority: 'low' | 'medium' | 'high';
}

interface NotificationsPanelProps {
  userRole: 'archer' | 'recorder';
}

// Mock notifications data
const mockArcherNotifications: Notification[] = [
  {
    id: 1,
    type: 'record',
    title: 'New Personal Best!',
    message: 'Congratulations! You set a new personal best of 695/720 in the Indoor Championship Qualifier.',
    timestamp: '2025-11-09 14:30:00',
    read: false,
    priority: 'high'
  },
  {
    id: 2,
    type: 'score_approved',
    title: 'Score Approved',
    message: 'Your score of 682/720 for Spring Championship 2025 has been approved by the recorder.',
    timestamp: '2025-11-09 13:15:00',
    read: false,
    priority: 'medium'
  },
  {
    id: 3,
    type: 'competition',
    title: 'New Competition Available',
    message: 'Summer Regional Tournament 2025 is now open for registration. Registration closes on Nov 30, 2025.',
    timestamp: '2025-11-09 10:00:00',
    read: true,
    priority: 'medium'
  },
  {
    id: 4,
    type: 'achievement',
    title: 'Achievement Unlocked',
    message: 'You\'ve completed 50 competition rounds! Keep up the great work.',
    timestamp: '2025-11-08 16:45:00',
    read: true,
    priority: 'low'
  },
  {
    id: 5,
    type: 'system',
    title: 'Profile Update Required',
    message: 'Please update your contact information to ensure you receive important competition updates.',
    timestamp: '2025-11-07 09:00:00',
    read: true,
    priority: 'medium'
  }
];

const mockRecorderNotifications: Notification[] = [
  {
    id: 1,
    type: 'score_approved',
    title: 'Score Pending Approval',
    message: '12 new scores are waiting for your approval in the Spring Championship 2025.',
    timestamp: '2025-11-09 14:45:00',
    read: false,
    priority: 'high'
  },
  {
    id: 2,
    type: 'competition',
    title: 'Competition Deadline Approaching',
    message: 'Winter Indoor Championship registration closes in 3 days. 45 archers registered.',
    timestamp: '2025-11-09 12:00:00',
    read: false,
    priority: 'medium'
  },
  {
    id: 3,
    type: 'system',
    title: 'New Archer Registration',
    message: 'New archer "Michael Chen" (ARC156) has registered and requires profile verification.',
    timestamp: '2025-11-09 11:30:00',
    read: true,
    priority: 'medium'
  },
  {
    id: 4,
    type: 'achievement',
    title: 'Monthly Report Ready',
    message: 'October 2025 competition statistics report is now available for download.',
    timestamp: '2025-11-08 08:00:00',
    read: true,
    priority: 'low'
  }
];

export function NotificationsPanel({ userRole }: NotificationsPanelProps) {
  const initialNotifications = userRole === 'archer' ? mockArcherNotifications : mockRecorderNotifications;
  const [notifications, setNotifications] = useState<Notification[]>(initialNotifications);
  const [notificationSettings, setNotificationSettings] = useState({
    records: true,
    scoreApprovals: true,
    competitions: true,
    achievements: true,
    systemUpdates: true
  });

  const unreadCount = notifications.filter(n => !n.read).length;

  const markAsRead = (id: number) => {
    setNotifications(notifications.map(n => 
      n.id === id ? { ...n, read: true } : n
    ));
  };

  const markAllAsRead = () => {
    setNotifications(notifications.map(n => ({ ...n, read: true })));
  };

  const deleteNotification = (id: number) => {
    setNotifications(notifications.filter(n => n.id !== id));
  };

  const clearAll = () => {
    setNotifications([]);
  };

  const getNotificationIcon = (type: Notification['type']) => {
    switch (type) {
      case 'record':
        return <TrendingUp className="w-5 h-5 text-blue-600" />;
      case 'score_approved':
        return <CheckCircle className="w-5 h-5 text-green-600" />;
      case 'competition':
        return <Trophy className="w-5 h-5 text-yellow-600" />;
      case 'achievement':
        return <Trophy className="w-5 h-5 text-purple-600" />;
      case 'system':
        return <AlertCircle className="w-5 h-5 text-orange-600" />;
      default:
        return <Bell className="w-5 h-5 text-gray-600" />;
    }
  };

  const getPriorityColor = (priority: Notification['priority']) => {
    switch (priority) {
      case 'high':
        return 'border-l-4 border-l-red-500 bg-red-50';
      case 'medium':
        return 'border-l-4 border-l-yellow-500 bg-yellow-50';
      case 'low':
        return 'border-l-4 border-l-blue-500 bg-blue-50';
      default:
        return 'border-l-4 border-l-gray-500 bg-gray-50';
    }
  };

  const formatTimestamp = (timestamp: string) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 60) {
      return `${diffMins} minute${diffMins !== 1 ? 's' : ''} ago`;
    } else if (diffHours < 24) {
      return `${diffHours} hour${diffHours !== 1 ? 's' : ''} ago`;
    } else if (diffDays < 7) {
      return `${diffDays} day${diffDays !== 1 ? 's' : ''} ago`;
    } else {
      return date.toLocaleDateString();
    }
  };

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button variant="outline" size="icon" className="relative">
          <Bell className="w-5 h-5" />
          {unreadCount > 0 && (
            <Badge 
              variant="destructive" 
              className="absolute -top-2 -right-2 h-5 w-5 p-0 flex items-center justify-center text-xs"
            >
              {unreadCount > 9 ? '9+' : unreadCount}
            </Badge>
          )}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-96 p-0" align="end">
        <Tabs defaultValue="all" className="w-full">
          <div className="p-4 border-b">
            <div className="flex items-center justify-between mb-2">
              <h3 className="flex items-center gap-2">
                <Bell className="w-5 h-5" />
                Notifications
              </h3>
              {unreadCount > 0 && (
                <Badge variant="secondary">{unreadCount} new</Badge>
              )}
            </div>
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="all">All</TabsTrigger>
              <TabsTrigger value="settings">Settings</TabsTrigger>
            </TabsList>
          </div>

          {/* All Notifications Tab */}
          <TabsContent value="all" className="m-0">
            {notifications.length > 0 && (
              <div className="p-2 border-b flex gap-2">
                <Button 
                  size="sm" 
                  variant="ghost" 
                  className="flex-1"
                  onClick={markAllAsRead}
                  disabled={unreadCount === 0}
                >
                  Mark all read
                </Button>
                <Button 
                  size="sm" 
                  variant="ghost" 
                  className="flex-1"
                  onClick={clearAll}
                >
                  Clear all
                </Button>
              </div>
            )}

            <ScrollArea className="h-[400px]">
              {notifications.length === 0 ? (
                <div className="p-8 text-center text-gray-500">
                  <Bell className="w-12 h-12 mx-auto mb-2 opacity-20" />
                  <p>No notifications</p>
                  <p className="text-sm">You're all caught up!</p>
                </div>
              ) : (
                <div className="p-2 space-y-2">
                  {notifications.map((notification) => (
                    <Card 
                      key={notification.id}
                      className={`${!notification.read ? getPriorityColor(notification.priority) : 'border-l-4 border-l-gray-300'} cursor-pointer hover:shadow-md transition-shadow`}
                      onClick={() => markAsRead(notification.id)}
                    >
                      <CardContent className="p-3">
                        <div className="flex items-start gap-3">
                          <div className="mt-0.5">
                            {getNotificationIcon(notification.type)}
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-start justify-between gap-2 mb-1">
                              <p className={`${!notification.read ? 'font-semibold' : ''}`}>
                                {notification.title}
                              </p>
                              <Button
                                size="icon"
                                variant="ghost"
                                className="h-6 w-6 opacity-0 group-hover:opacity-100"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  deleteNotification(notification.id);
                                }}
                              >
                                <X className="w-4 h-4" />
                              </Button>
                            </div>
                            <p className="text-sm text-gray-600 mb-2">
                              {notification.message}
                            </p>
                            <div className="flex items-center justify-between">
                              <p className="text-xs text-gray-500">
                                {formatTimestamp(notification.timestamp)}
                              </p>
                              {!notification.read && (
                                <Badge variant="secondary" className="text-xs">
                                  New
                                </Badge>
                              )}
                            </div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              )}
            </ScrollArea>
          </TabsContent>

          {/* Settings Tab */}
          <TabsContent value="settings" className="m-0">
            <div className="p-4">
              <div className="mb-4">
                <div className="flex items-center gap-2 mb-2">
                  <Settings className="w-5 h-5" />
                  <h4>Notification Preferences</h4>
                </div>
                <p className="text-sm text-gray-600">
                  Choose which notifications you want to receive
                </p>
              </div>

              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <Label htmlFor="records" className="cursor-pointer">
                      Personal Records
                    </Label>
                    <p className="text-sm text-gray-600">
                      Notify when you set new personal bests
                    </p>
                  </div>
                  <Switch
                    id="records"
                    checked={notificationSettings.records}
                    onCheckedChange={(checked) =>
                      setNotificationSettings({ ...notificationSettings, records: checked })
                    }
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <Label htmlFor="scoreApprovals" className="cursor-pointer">
                      Score Approvals
                    </Label>
                    <p className="text-sm text-gray-600">
                      {userRole === 'archer' 
                        ? 'Notify when scores are approved or rejected'
                        : 'Notify when new scores need approval'
                      }
                    </p>
                  </div>
                  <Switch
                    id="scoreApprovals"
                    checked={notificationSettings.scoreApprovals}
                    onCheckedChange={(checked) =>
                      setNotificationSettings({ ...notificationSettings, scoreApprovals: checked })
                    }
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <Label htmlFor="competitions" className="cursor-pointer">
                      Competitions
                    </Label>
                    <p className="text-sm text-gray-600">
                      Updates about new and upcoming competitions
                    </p>
                  </div>
                  <Switch
                    id="competitions"
                    checked={notificationSettings.competitions}
                    onCheckedChange={(checked) =>
                      setNotificationSettings({ ...notificationSettings, competitions: checked })
                    }
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <Label htmlFor="achievements" className="cursor-pointer">
                      Achievements
                    </Label>
                    <p className="text-sm text-gray-600">
                      Milestones and special accomplishments
                    </p>
                  </div>
                  <Switch
                    id="achievements"
                    checked={notificationSettings.achievements}
                    onCheckedChange={(checked) =>
                      setNotificationSettings({ ...notificationSettings, achievements: checked })
                    }
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <Label htmlFor="systemUpdates" className="cursor-pointer">
                      System Updates
                    </Label>
                    <p className="text-sm text-gray-600">
                      Important system announcements
                    </p>
                  </div>
                  <Switch
                    id="systemUpdates"
                    checked={notificationSettings.systemUpdates}
                    onCheckedChange={(checked) =>
                      setNotificationSettings({ ...notificationSettings, systemUpdates: checked })
                    }
                  />
                </div>
              </div>

              <div className="mt-4 p-3 bg-blue-50 border border-blue-200 rounded-lg">
                <p className="text-sm text-blue-800">
                  💡 <strong>Note:</strong> These settings are demonstration only. 
                  In production, preferences will be saved to your account.
                </p>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </PopoverContent>
    </Popover>
  );
}
