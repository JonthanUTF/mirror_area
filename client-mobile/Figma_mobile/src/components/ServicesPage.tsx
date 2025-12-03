import { AppLayout } from './AppLayout';
import { Github, Mail, Cloud, MessageSquare, CloudRain, Clock, CheckCircle, Plus } from 'lucide-react';
import { Button } from './ui/button';
import { Card } from './ui/card';
import { Badge } from './ui/badge';
import { useState } from 'react';

type Page = 'dashboard' | 'builder' | 'services' | 'activity' | 'settings';

interface ServicesPageProps {
  onNavigate: (page: Page) => void;
  onLogout: () => void;
}

interface ServiceData {
  id: string;
  name: string;
  description: string;
  icon: any;
  color: string;
  category: string;
  isConnected: boolean;
  triggers: number;
  actions: number;
}

export function ServicesPage({ onNavigate, onLogout }: ServicesPageProps) {
  const [services, setServices] = useState<ServiceData[]>([
    {
      id: 'github',
      name: 'GitHub',
      description: 'Automate your development workflow with pull requests, issues, and commits',
      icon: Github,
      color: 'bg-gray-700',
      category: 'Developer Tools',
      isConnected: true,
      triggers: 4,
      actions: 4
    },
    {
      id: 'gmail',
      name: 'Gmail',
      description: 'Manage your emails, send messages, and organize your inbox automatically',
      icon: Mail,
      color: 'bg-red-500',
      category: 'Email',
      isConnected: true,
      triggers: 4,
      actions: 4
    },
    {
      id: 'drive',
      name: 'Google Drive',
      description: 'Sync files, create folders, and manage your cloud storage',
      icon: Cloud,
      color: 'bg-blue-500',
      category: 'Storage',
      isConnected: false,
      triggers: 3,
      actions: 4
    },
    {
      id: 'discord',
      name: 'Discord',
      description: 'Send messages, manage channels, and automate your Discord server',
      icon: MessageSquare,
      color: 'bg-indigo-500',
      category: 'Communication',
      isConnected: true,
      triggers: 3,
      actions: 4
    },
    {
      id: 'weather',
      name: 'Weather API',
      description: 'Get weather forecasts, temperature alerts, and condition updates',
      icon: CloudRain,
      color: 'bg-cyan-500',
      category: 'Data',
      isConnected: false,
      triggers: 4,
      actions: 0
    },
    {
      id: 'timer',
      name: 'Timer',
      description: 'Schedule automations to run at specific times or intervals',
      icon: Clock,
      color: 'bg-purple-500',
      category: 'Utility',
      isConnected: true,
      triggers: 5,
      actions: 0
    }
  ]);

  const toggleConnection = (id: string) => {
    setServices(services.map(service =>
      service.id === id ? { ...service, isConnected: !service.isConnected } : service
    ));
  };

  const connectedCount = services.filter(s => s.isConnected).length;

  return (
    <AppLayout currentPage="services" onNavigate={onNavigate} onLogout={onLogout}>
      <div className="p-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl text-white mb-2">Services</h1>
          <p className="text-slate-400">
            Connect and manage your integrations • {connectedCount}/{services.length} connected
          </p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card className="p-6 bg-white/5 backdrop-blur-sm border-white/10">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-green-500 flex items-center justify-center">
                <CheckCircle className="w-6 h-6 text-white" />
              </div>
              <div>
                <div className="text-2xl text-white">{connectedCount}</div>
                <div className="text-sm text-slate-400">Connected Services</div>
              </div>
            </div>
          </Card>

          <Card className="p-6 bg-white/5 backdrop-blur-sm border-white/10">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-blue-500 flex items-center justify-center">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </div>
              <div>
                <div className="text-2xl text-white">
                  {services.reduce((acc, s) => acc + s.triggers, 0)}
                </div>
                <div className="text-sm text-slate-400">Available Triggers</div>
              </div>
            </div>
          </Card>

          <Card className="p-6 bg-white/5 backdrop-blur-sm border-white/10">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-purple-500 flex items-center justify-center">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
                </svg>
              </div>
              <div>
                <div className="text-2xl text-white">
                  {services.reduce((acc, s) => acc + s.actions, 0)}
                </div>
                <div className="text-sm text-slate-400">Available Actions</div>
              </div>
            </div>
          </Card>
        </div>

        {/* Services Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {services.map((service) => (
            <Card
              key={service.id}
              className="p-6 bg-white/5 backdrop-blur-sm border-white/10 hover:border-purple-500/50 transition-all"
            >
              {/* Header */}
              <div className="flex items-start justify-between mb-4">
                <div className={`w-14 h-14 rounded-xl ${service.color} flex items-center justify-center`}>
                  <service.icon className="w-7 h-7 text-white" />
                </div>
                {service.isConnected && (
                  <Badge className="bg-green-500/20 text-green-400 border-green-500/50">
                    <CheckCircle className="w-3 h-3 mr-1" />
                    Connected
                  </Badge>
                )}
              </div>

              {/* Info */}
              <h3 className="text-white text-lg mb-2">{service.name}</h3>
              <p className="text-slate-400 text-sm mb-4 line-clamp-2">
                {service.description}
              </p>

              {/* Stats */}
              <div className="flex items-center gap-4 mb-4 text-sm">
                <div className="flex items-center gap-1 text-slate-400">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                  </svg>
                  <span>{service.triggers} triggers</span>
                </div>
                <div className="flex items-center gap-1 text-slate-400">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
                  </svg>
                  <span>{service.actions} actions</span>
                </div>
              </div>

              {/* Action */}
              <Button
                className={`w-full ${
                  service.isConnected
                    ? 'bg-white/5 hover:bg-white/10 text-white border border-white/20'
                    : 'bg-purple-500 hover:bg-purple-600 text-white'
                }`}
                onClick={() => toggleConnection(service.id)}
              >
                {service.isConnected ? (
                  <>
                    <CheckCircle className="w-4 h-4 mr-2" />
                    Disconnect
                  </>
                ) : (
                  <>
                    <Plus className="w-4 h-4 mr-2" />
                    Connect
                  </>
                )}
              </Button>
            </Card>
          ))}
        </div>

        {/* Add More Services CTA */}
        <Card className="mt-8 p-6 sm:p-8 bg-purple-500/20 backdrop-blur-sm border-white/10 text-center">
          <h3 className="text-lg sm:text-xl text-white mb-2">Need more services?</h3>
          <p className="text-sm sm:text-base text-slate-400 mb-4">
            We're constantly adding new integrations. Request a service or build your own.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-4">
            <Button variant="outline" className="border-white/20 text-[rgb(61,0,229)] hover:bg-white/5 w-full sm:w-auto">
              Request Service
            </Button>
            <Button className="bg-purple-500 hover:bg-purple-600 text-white w-full sm:w-auto">
              View API Docs
            </Button>
          </div>
        </Card>
      </div>
    </AppLayout>
  );
}