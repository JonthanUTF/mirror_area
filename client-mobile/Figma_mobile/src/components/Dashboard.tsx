import { AppLayout } from './AppLayout';
import { Plus, Activity, CheckCircle2, Zap, ArrowRight, Github, Mail, Cloud, MessageSquare, CloudRain, Clock, ToggleLeft, ToggleRight } from 'lucide-react';
import { Button } from './ui/button';
import { Card } from './ui/card';
import { Badge } from './ui/badge';
import { useState } from 'react';

type Page = 'dashboard' | 'builder' | 'services' | 'activity' | 'settings';

interface DashboardProps {
  onNavigate: (page: Page) => void;
  onLogout: () => void;
  onEditArea: (areaId: string) => void;
  onCreateArea: () => void;
}

interface AreaData {
  id: string;
  name: string;
  action: {
    service: string;
    icon: any;
    event: string;
    color: string;
  };
  reaction: {
    service: string;
    icon: any;
    event: string;
    color: string;
  };
  isActive: boolean;
  lastExecution: string;
  executionCount: number;
}

const serviceIcons = {
  github: { icon: Github, color: 'bg-gray-700' },
  gmail: { icon: Mail, color: 'bg-red-500' },
  drive: { icon: Cloud, color: 'bg-blue-500' },
  discord: { icon: MessageSquare, color: 'bg-indigo-500' },
  weather: { icon: CloudRain, color: 'bg-cyan-500' },
  timer: { icon: Clock, color: 'bg-purple-500' }
};

export function Dashboard({ onNavigate, onLogout, onEditArea, onCreateArea }: DashboardProps) {
  const [areas, setAreas] = useState<AreaData[]>([
    {
      id: '1',
      name: 'GitHub PR to Discord',
      action: {
        service: 'GitHub',
        icon: Github,
        event: 'New Pull Request',
        color: 'bg-gray-700'
      },
      reaction: {
        service: 'Discord',
        icon: MessageSquare,
        event: 'Send Message',
        color: 'bg-indigo-500'
      },
      isActive: true,
      lastExecution: '5 minutes ago',
      executionCount: 142
    },
    {
      id: '2',
      name: 'Gmail to Drive Backup',
      action: {
        service: 'Gmail',
        icon: Mail,
        event: 'New Email with Attachment',
        color: 'bg-red-500'
      },
      reaction: {
        service: 'Drive',
        icon: Cloud,
        event: 'Save to Folder',
        color: 'bg-blue-500'
      },
      isActive: true,
      lastExecution: '1 hour ago',
      executionCount: 89
    },
    {
      id: '3',
      name: 'Weather Alert to Discord',
      action: {
        service: 'Weather',
        icon: CloudRain,
        event: 'Rain Forecast',
        color: 'bg-cyan-500'
      },
      reaction: {
        service: 'Discord',
        icon: MessageSquare,
        event: 'Send Alert',
        color: 'bg-indigo-500'
      },
      isActive: false,
      lastExecution: '3 hours ago',
      executionCount: 24
    },
    {
      id: '4',
      name: 'Daily Standup Reminder',
      action: {
        service: 'Timer',
        icon: Clock,
        event: 'Every Weekday 9 AM',
        color: 'bg-purple-500'
      },
      reaction: {
        service: 'Discord',
        icon: MessageSquare,
        event: 'Send Message',
        color: 'bg-indigo-500'
      },
      isActive: true,
      lastExecution: 'Today at 9:00 AM',
      executionCount: 156
    }
  ]);

  const toggleArea = (id: string) => {
    setAreas(areas.map(area =>
      area.id === id ? { ...area, isActive: !area.isActive } : area
    ));
  };

  const stats = [
    {
      label: 'Total AREAs',
      value: areas.length,
      icon: Workflow,
      color: 'bg-purple-500',
      trend: '+2 this week'
    },
    {
      label: 'Active',
      value: areas.filter(a => a.isActive).length,
      icon: CheckCircle2,
      color: 'bg-green-500',
      trend: '75% active'
    },
    {
      label: 'Executions',
      value: '1.2K',
      icon: Activity,
      color: 'bg-blue-500',
      trend: '+15% vs yesterday'
    },
    {
      label: 'Success Rate',
      value: '99.8%',
      icon: Zap,
      color: 'bg-orange-500',
      trend: 'Last 30 days'
    }
  ];

  return (
    <AppLayout currentPage="dashboard" onNavigate={onNavigate} onLogout={onLogout}>
      <div className="p-4 sm:p-6 lg:p-8">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-6 sm:mb-8 gap-4">
          <div>
            <h1 className="text-2xl sm:text-3xl text-white mb-2">Dashboard</h1>
            <p className="text-slate-400 text-sm sm:text-base">Manage and monitor your automations</p>
          </div>
          <Button
            className="bg-purple-500 hover:bg-purple-600 text-white w-full sm:w-auto"
            onClick={onCreateArea}
          >
            <Plus className="w-5 h-5 mr-2" />
            Create AREA
          </Button>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-6 mb-6 sm:mb-8">
          {stats.map((stat, index) => (
            <Card key={index} className="p-4 sm:p-6 bg-white/5 backdrop-blur-sm border-white/10">
              <div className="flex items-start justify-between mb-3 sm:mb-4">
                <div className={`w-10 h-10 sm:w-12 sm:h-12 rounded-xl ${stat.color} flex items-center justify-center`}>
                  <stat.icon className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
                </div>
              </div>
              <div className="text-2xl sm:text-3xl text-white mb-1">{stat.value}</div>
              <div className="text-xs sm:text-sm text-slate-400 mb-2">{stat.label}</div>
              <div className="text-xs text-purple-400">{stat.trend}</div>
            </Card>
          ))}
        </div>

        {/* AREAs Grid */}
        <div className="mb-4">
          <h2 className="text-lg sm:text-xl text-white mb-4">Your AREAs</h2>
        </div>

        {areas.length === 0 ? (
          <Card className="p-8 sm:p-12 bg-white/5 backdrop-blur-sm border-white/10 text-center">
            <div className="w-16 h-16 rounded-full bg-white/5 flex items-center justify-center mx-auto mb-4">
              <Workflow className="w-8 h-8 text-slate-400" />
            </div>
            <h3 className="text-lg sm:text-xl text-white mb-2">No AREAs Yet</h3>
            <p className="text-sm sm:text-base text-slate-400 mb-6">Create your first automation to get started</p>
            <Button
              className="bg-purple-500 hover:bg-purple-600 text-white w-full sm:w-auto"
              onClick={onCreateArea}
            >
              <Plus className="w-5 h-5 mr-2" />
              Create Your First AREA
            </Button>
          </Card>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
            {areas.map((area) => (
              <Card 
                key={area.id} 
                className="p-4 sm:p-6 bg-white/5 backdrop-blur-sm border-white/10 hover:border-purple-500/50 transition-all cursor-pointer group"
                onClick={() => onEditArea(area.id)}
              >
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1 min-w-0">
                    <h3 className="text-white mb-1 truncate">{area.name}</h3>
                    <p className="text-xs sm:text-sm text-slate-400">
                      {area.executionCount} executions • {area.lastExecution}
                    </p>
                  </div>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      toggleArea(area.id);
                    }}
                    className="p-2 rounded-lg hover:bg-white/5 transition-colors flex-shrink-0 ml-2"
                  >
                    {area.isActive ? (
                      <ToggleRight className="w-6 h-6 text-green-500" />
                    ) : (
                      <ToggleLeft className="w-6 h-6 text-slate-500" />
                    )}
                  </button>
                </div>

                {/* Visual Flow */}
                <div className="flex items-center gap-2 sm:gap-4">
                  {/* Action */}
                  <div className="flex-1 p-3 sm:p-4 rounded-xl bg-white/5 border-2 border-green-500/50 min-w-0">
                    <div className="flex items-center gap-2 sm:gap-3 mb-2">
                      <div className={`w-6 h-6 sm:w-8 sm:h-8 rounded-lg ${area.action.color} flex items-center justify-center flex-shrink-0`}>
                        <area.action.icon className="w-3 h-3 sm:w-5 sm:h-5 text-white" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="text-xs text-green-400 mb-1">IF</div>
                        <div className="text-xs sm:text-sm text-white truncate">{area.action.service}</div>
                      </div>
                    </div>
                    <div className="text-xs text-slate-400 truncate">{area.action.event}</div>
                  </div>

                  {/* Arrow */}
                  <ArrowRight className="w-5 h-5 sm:w-6 sm:h-6 text-purple-400 flex-shrink-0" />

                  {/* Reaction */}
                  <div className="flex-1 p-3 sm:p-4 rounded-xl bg-white/5 border-2 border-purple-500/50 min-w-0">
                    <div className="flex items-center gap-2 sm:gap-3 mb-2">
                      <div className={`w-6 h-6 sm:w-8 sm:h-8 rounded-lg ${area.reaction.color} flex items-center justify-center flex-shrink-0`}>
                        <area.reaction.icon className="w-3 h-3 sm:w-5 sm:h-5 text-white" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="text-xs text-purple-400 mb-1">THEN</div>
                        <div className="text-xs sm:text-sm text-white truncate">{area.reaction.service}</div>
                      </div>
                    </div>
                    <div className="text-xs text-slate-400 truncate">{area.reaction.event}</div>
                  </div>
                </div>

                {/* Status Badge */}
                <div className="mt-4 flex items-center gap-2">
                  <Badge 
                    variant={area.isActive ? "default" : "secondary"}
                    className={area.isActive ? "bg-green-500/20 text-green-400 border-green-500/50 text-xs" : "bg-slate-500/20 text-slate-400 border-slate-500/50 text-xs"}
                  >
                    {area.isActive ? 'Active' : 'Inactive'}
                  </Badge>
                </div>
              </Card>
            ))}
          </div>
        )}
      </div>
    </AppLayout>
  );
}

function Workflow(props: any) {
  return (
    <svg {...props} fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 5a1 1 0 011-1h4a1 1 0 011 1v7a1 1 0 01-1 1H5a1 1 0 01-1-1V5zM14 5a1 1 0 011-1h4a1 1 0 011 1v7a1 1 0 01-1 1h-4a1 1 0 01-1-1V5zM4 17a1 1 0 011-1h4a1 1 0 011 1v2a1 1 0 01-1 1H5a1 1 0 01-1-1v-2zM14 17a1 1 0 011-1h4a1 1 0 011 1v2a1 1 0 01-1 1h-4a1 1 0 01-1-1v-2z" />
    </svg>
  );
}