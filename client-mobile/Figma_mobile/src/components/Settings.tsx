import { AppLayout } from './AppLayout';
import { User, Shield, Bell, Key, Save } from 'lucide-react';
import { Button } from './ui/button';
import { Card } from './ui/card';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Switch } from './ui/switch';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';

type Page = 'dashboard' | 'builder' | 'services' | 'activity' | 'settings';

interface SettingsProps {
  onNavigate: (page: Page) => void;
  onLogout: () => void;
}

export function Settings({ onNavigate, onLogout }: SettingsProps) {
  return (
    <AppLayout currentPage="settings" onNavigate={onNavigate} onLogout={onLogout}>
      <div className="p-4 sm:p-6 lg:p-8 max-w-4xl">
        {/* Header */}
        <div className="mb-6 sm:mb-8">
          <h1 className="text-2xl sm:text-3xl text-white mb-2">Settings</h1>
          <p className="text-slate-400 text-sm sm:text-base">Manage your account and preferences</p>
        </div>

        {/* Tabs */}
        <Tabs defaultValue="profile" className="w-full">
          <TabsList className="bg-white/5 border border-white/10 mb-6 sm:mb-8 w-full grid grid-cols-2 sm:grid-cols-4 h-auto">
            <TabsTrigger value="profile" className="data-[state=active]:bg-purple-500/20 data-[state=active]:text-purple-400 text-xs sm:text-sm py-2">
              <User className="w-3 h-3 sm:w-4 sm:h-4 sm:mr-2" />
              <span className="hidden sm:inline">Profile</span>
            </TabsTrigger>
            <TabsTrigger value="security" className="data-[state=active]:bg-purple-500/20 data-[state=active]:text-purple-400 text-xs sm:text-sm py-2">
              <Shield className="w-3 h-3 sm:w-4 sm:h-4 sm:mr-2" />
              <span className="hidden sm:inline">Security</span>
            </TabsTrigger>
            <TabsTrigger value="notifications" className="data-[state=active]:bg-purple-500/20 data-[state=active]:text-purple-400 text-xs sm:text-sm py-2">
              <Bell className="w-3 h-3 sm:w-4 sm:h-4 sm:mr-2" />
              <span className="hidden sm:inline">Notifications</span>
            </TabsTrigger>
            <TabsTrigger value="api" className="data-[state=active]:bg-purple-500/20 data-[state=active]:text-purple-400 text-xs sm:text-sm py-2">
              <Key className="w-3 h-3 sm:w-4 sm:h-4 sm:mr-2" />
              <span className="hidden sm:inline">API Keys</span>
            </TabsTrigger>
          </TabsList>

          {/* Profile Tab */}
          <TabsContent value="profile">
            <Card className="p-6 bg-white/5 backdrop-blur-sm border-white/10">
              <h3 className="text-white text-lg mb-6">Profile Information</h3>
              
              <div className="space-y-4">
                <div className="flex items-center gap-6 mb-6">
                  <div className="w-20 h-20 rounded-full bg-gradient-to-br from-purple-500 to-blue-500 flex items-center justify-center text-white text-2xl">
                    JD
                  </div>
                  <div>
                    <Button variant="outline" className="border-white/20 text-white hover:bg-white/5 mr-2">
                      Change Avatar
                    </Button>
                    <Button variant="ghost" className="text-slate-400 hover:text-white">
                      Remove
                    </Button>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="firstName" className="text-white mb-2 block">First Name</Label>
                    <Input
                      id="firstName"
                      type="text"
                      placeholder="John"
                      defaultValue="John"
                      className="bg-white/5 border-white/20 text-white"
                    />
                  </div>
                  <div>
                    <Label htmlFor="lastName" className="text-white mb-2 block">Last Name</Label>
                    <Input
                      id="lastName"
                      type="text"
                      placeholder="Doe"
                      defaultValue="Doe"
                      className="bg-white/5 border-white/20 text-white"
                    />
                  </div>
                </div>

                <div>
                  <Label htmlFor="email" className="text-white mb-2 block">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="john.doe@example.com"
                    defaultValue="john.doe@example.com"
                    className="bg-white/5 border-white/20 text-white"
                  />
                </div>

                <div>
                  <Label htmlFor="timezone" className="text-white mb-2 block">Timezone</Label>
                  <Input
                    id="timezone"
                    type="text"
                    placeholder="UTC"
                    defaultValue="America/New_York (UTC-5)"
                    className="bg-white/5 border-white/20 text-white"
                  />
                </div>
              </div>

              <div className="flex items-center justify-end gap-3 mt-6 pt-6 border-t border-white/10">
                <Button variant="ghost" className="text-slate-400 hover:text-white">
                  Cancel
                </Button>
                <Button className="bg-gradient-to-r from-purple-500 to-blue-500 hover:from-purple-600 hover:to-blue-600 text-white">
                  <Save className="w-4 h-4 mr-2" />
                  Save Changes
                </Button>
              </div>
            </Card>
          </TabsContent>

          {/* Security Tab */}
          <TabsContent value="security">
            <div className="space-y-6">
              <Card className="p-6 bg-white/5 backdrop-blur-sm border-white/10">
                <h3 className="text-white text-lg mb-6">Change Password</h3>
                
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="currentPassword" className="text-white mb-2 block">Current Password</Label>
                    <Input
                      id="currentPassword"
                      type="password"
                      placeholder="••••••••"
                      className="bg-white/5 border-white/20 text-white"
                    />
                  </div>
                  <div>
                    <Label htmlFor="newPassword" className="text-white mb-2 block">New Password</Label>
                    <Input
                      id="newPassword"
                      type="password"
                      placeholder="••••••••"
                      className="bg-white/5 border-white/20 text-white"
                    />
                  </div>
                  <div>
                    <Label htmlFor="confirmPassword" className="text-white mb-2 block">Confirm New Password</Label>
                    <Input
                      id="confirmPassword"
                      type="password"
                      placeholder="••••••••"
                      className="bg-white/5 border-white/20 text-white"
                    />
                  </div>
                </div>

                <div className="flex items-center justify-end gap-3 mt-6 pt-6 border-t border-white/10">
                  <Button className="bg-gradient-to-r from-purple-500 to-blue-500 hover:from-purple-600 hover:to-blue-600 text-white">
                    Update Password
                  </Button>
                </div>
              </Card>

              <Card className="p-6 bg-white/5 backdrop-blur-sm border-white/10">
                <h3 className="text-white text-lg mb-6">Two-Factor Authentication</h3>
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-white mb-1">Enable 2FA</p>
                    <p className="text-slate-400 text-sm">Add an extra layer of security to your account</p>
                  </div>
                  <Switch />
                </div>
              </Card>

              <Card className="p-6 bg-white/5 backdrop-blur-sm border-white/10">
                <h3 className="text-white text-lg mb-4">Connected Accounts</h3>
                <div className="space-y-4">
                  {[
                    { name: 'Google', connected: true },
                    { name: 'GitHub', connected: true },
                    { name: 'Facebook', connected: false }
                  ].map((account) => (
                    <div key={account.name} className="flex items-center justify-between p-4 rounded-lg bg-white/5">
                      <span className="text-white">{account.name}</span>
                      <Button
                        variant="outline"
                        className={account.connected ? "border-red-500/50 text-red-400 hover:bg-red-500/10" : "border-white/20 text-white hover:bg-white/5"}
                      >
                        {account.connected ? 'Disconnect' : 'Connect'}
                      </Button>
                    </div>
                  ))}
                </div>
              </Card>
            </div>
          </TabsContent>

          {/* Notifications Tab */}
          <TabsContent value="notifications">
            <Card className="p-6 bg-white/5 backdrop-blur-sm border-white/10">
              <h3 className="text-white text-lg mb-6">Notification Preferences</h3>
              
              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-white mb-1">Execution Notifications</p>
                    <p className="text-slate-400 text-sm">Get notified when AREAs execute</p>
                  </div>
                  <Switch defaultChecked />
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-white mb-1">Error Alerts</p>
                    <p className="text-slate-400 text-sm">Receive alerts when AREAs fail</p>
                  </div>
                  <Switch defaultChecked />
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-white mb-1">Weekly Summary</p>
                    <p className="text-slate-400 text-sm">Get a weekly summary of your automation activity</p>
                  </div>
                  <Switch defaultChecked />
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-white mb-1">Product Updates</p>
                    <p className="text-slate-400 text-sm">Stay informed about new features and improvements</p>
                  </div>
                  <Switch />
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-white mb-1">Marketing Emails</p>
                    <p className="text-slate-400 text-sm">Receive tips, tricks, and promotional content</p>
                  </div>
                  <Switch />
                </div>
              </div>

              <div className="flex items-center justify-end gap-3 mt-6 pt-6 border-t border-white/10">
                <Button className="bg-gradient-to-r from-purple-500 to-blue-500 hover:from-purple-600 hover:to-blue-600 text-white">
                  <Save className="w-4 h-4 mr-2" />
                  Save Preferences
                </Button>
              </div>
            </Card>
          </TabsContent>

          {/* API Keys Tab */}
          <TabsContent value="api">
            <div className="space-y-6">
              <Card className="p-6 bg-white/5 backdrop-blur-sm border-white/10">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-white text-lg">API Keys</h3>
                  <Button className="bg-gradient-to-r from-purple-500 to-blue-500 hover:from-purple-600 hover:to-blue-600 text-white">
                    Generate New Key
                  </Button>
                </div>

                <div className="space-y-4">
                  {[
                    { name: 'Production Key', key: 'ak_live_••••••••••••••••', created: '2025-11-01' },
                    { name: 'Development Key', key: 'ak_test_••••••••••••••••', created: '2025-10-15' }
                  ].map((apiKey, index) => (
                    <div key={index} className="p-4 rounded-lg bg-white/5 border border-white/10">
                      <div className="flex items-start justify-between mb-2">
                        <div>
                          <p className="text-white mb-1">{apiKey.name}</p>
                          <p className="text-slate-400 text-sm font-mono">{apiKey.key}</p>
                        </div>
                        <Button variant="ghost" className="text-red-400 hover:text-red-300 hover:bg-red-500/10">
                          Revoke
                        </Button>
                      </div>
                      <p className="text-slate-500 text-xs">Created on {apiKey.created}</p>
                    </div>
                  ))}
                </div>
              </Card>

              <Card className="p-6 bg-white/5 backdrop-blur-sm border-white/10">
                <h3 className="text-white text-lg mb-4">API Documentation</h3>
                <p className="text-slate-400 mb-4">
                  Use our API to programmatically manage your AREAs, retrieve execution logs, and integrate with your own applications.
                </p>
                <Button variant="outline" className="border-white/20 text-white hover:bg-white/5">
                  View Documentation
                </Button>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </AppLayout>
  );
}