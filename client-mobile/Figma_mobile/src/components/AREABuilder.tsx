import { useState } from 'react';
import { AppLayout } from './AppLayout';
import { ArrowRight, Save, Play, Github, Mail, Cloud, MessageSquare, CloudRain, Clock, ChevronDown } from 'lucide-react';
import { Button } from './ui/button';
import { Card } from './ui/card';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';

type Page = 'dashboard' | 'builder' | 'services' | 'activity' | 'settings';

interface AREABuilderProps {
  onNavigate: (page: Page) => void;
  onLogout: () => void;
  editingAreaId: string | null;
}

interface Service {
  id: string;
  name: string;
  icon: any;
  color: string;
  triggers: string[];
  actions: string[];
}

const services = [
  {
    id: 'github',
    name: 'GitHub',
    icon: Github,
    color: 'bg-gray-700',
    triggers: ['New Pull Request', 'New Issue', 'Push to Repository', 'New Star'],
    actions: ['Create Issue', 'Add Comment', 'Close Pull Request', 'Add Label']
  },
  {
    id: 'gmail',
    name: 'Gmail',
    icon: Mail,
    color: 'bg-red-500',
    triggers: ['New Email', 'New Email with Attachment', 'Email from Specific Sender', 'Label Added'],
    actions: ['Send Email', 'Add Label', 'Mark as Read', 'Move to Folder']
  },
  {
    id: 'drive',
    name: 'Google Drive',
    icon: Cloud,
    color: 'bg-blue-500',
    triggers: ['New File in Folder', 'File Modified', 'File Shared with Me'],
    actions: ['Upload File', 'Create Folder', 'Share File', 'Move File']
  },
  {
    id: 'discord',
    name: 'Discord',
    icon: MessageSquare,
    color: 'bg-indigo-500',
    triggers: ['New Message in Channel', 'User Joined Server', 'Reaction Added'],
    actions: ['Send Message', 'Create Channel', 'Add Role', 'Send Direct Message']
  },
  {
    id: 'weather',
    name: 'Weather API',
    icon: CloudRain,
    color: 'bg-cyan-500',
    triggers: ['Temperature Above', 'Temperature Below', 'Rain Forecast', 'Weather Condition'],
    actions: []
  },
  {
    id: 'timer',
    name: 'Timer',
    icon: Clock,
    color: 'bg-purple-500',
    triggers: ['Every Hour', 'Every Day at Time', 'Every Week', 'Every Month', 'Custom Schedule'],
    actions: []
  }
];

export function AREABuilder({ onNavigate, onLogout, editingAreaId }: AREABuilderProps) {
  const [areaName, setAreaName] = useState(editingAreaId ? 'GitHub PR to Discord' : '');
  const [selectedAction, setSelectedAction] = useState<Service | null>(editingAreaId ? services[0] : null);
  const [selectedActionTrigger, setSelectedActionTrigger] = useState(editingAreaId ? 'New Pull Request' : '');
  const [selectedReaction, setSelectedReaction] = useState<Service | null>(editingAreaId ? services[3] : null);
  const [selectedReactionAction, setSelectedReactionAction] = useState(editingAreaId ? 'Send Message' : '');

  const handleSave = () => {
    // Simulate save
    onNavigate('dashboard');
  };

  const handleTest = () => {
    // Simulate test
    alert('Testing AREA... Check your activity log for results.');
  };

  return (
    <AppLayout currentPage="builder" onNavigate={onNavigate} onLogout={onLogout}>
      <div className="p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-6 sm:mb-8">
          <h1 className="text-2xl sm:text-3xl text-white mb-2">
            {editingAreaId ? 'Edit AREA' : 'Create New AREA'}
          </h1>
          <p className="text-slate-400 text-sm sm:text-base">Build your automation workflow</p>
        </div>

        {/* AREA Name */}
        <Card className="p-4 sm:p-6 bg-white/5 backdrop-blur-sm border-white/10 mb-6 sm:mb-8">
          <Label htmlFor="area-name" className="text-white mb-2 block">AREA Name</Label>
          <Input
            id="area-name"
            type="text"
            placeholder="e.g., GitHub PR to Discord"
            value={areaName}
            onChange={(e) => setAreaName(e.target.value)}
            className="bg-white/5 border-white/20 text-white placeholder:text-slate-500 h-12"
          />
        </Card>

        {/* Visual Workflow Builder */}
        <div className="flex flex-col items-center gap-6 mb-6 sm:mb-8">
          {/* IF/Action Card */}
          <Card className="w-full p-6 sm:p-8 bg-white/5 backdrop-blur-sm border-2 border-green-500/50 hover:border-green-500 transition-all">
            <div className="flex items-center gap-2 mb-6">
              <div className="px-3 py-1 rounded-lg bg-green-500/20 border border-green-500/50">
                <span className="text-green-400">IF</span>
              </div>
              <span className="text-white text-sm sm:text-base">Action / Trigger</span>
            </div>

            {/* Service Selector */}
            <div className="mb-6">
              <Label className="text-white mb-3 block">Select Service</Label>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                {services.filter(s => s.triggers.length > 0).map((service) => (
                  <button
                    key={service.id}
                    onClick={() => {
                      setSelectedAction(service);
                      setSelectedActionTrigger('');
                    }}
                    className={`p-3 sm:p-4 rounded-xl border-2 transition-all ${
                      selectedAction?.id === service.id
                        ? 'border-green-500 bg-green-500/10'
                        : 'border-white/10 bg-white/5 hover:border-green-500/50'
                    }`}
                  >
                    <div className={`w-10 h-10 sm:w-12 sm:h-12 rounded-lg ${service.color} flex items-center justify-center mx-auto mb-2`}>
                      <service.icon className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
                    </div>
                    <div className="text-xs text-white text-center">{service.name}</div>
                  </button>
                ))}
              </div>
            </div>

            {/* Trigger Selector */}
            {selectedAction && (
              <div>
                <Label className="text-white mb-2 block">When this happens</Label>
                <Select value={selectedActionTrigger} onValueChange={setSelectedActionTrigger}>
                  <SelectTrigger className="bg-white/5 border-white/20 text-white h-12">
                    <SelectValue placeholder="Select a trigger" />
                  </SelectTrigger>
                  <SelectContent className="bg-slate-900 border-white/20">
                    {selectedAction.triggers.map((trigger) => (
                      <SelectItem key={trigger} value={trigger} className="text-white">
                        {trigger}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>

                {selectedActionTrigger && (
                  <div className="mt-4 p-4 rounded-lg bg-green-500/10 border border-green-500/30">
                    <div className="flex items-center gap-3">
                      <div className={`w-10 h-10 rounded-lg ${selectedAction.color} flex items-center justify-center flex-shrink-0`}>
                        <selectedAction.icon className="w-5 h-5 text-white" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="text-white truncate">{selectedAction.name}</div>
                        <div className="text-sm text-green-400 truncate">{selectedActionTrigger}</div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            )}
          </Card>

          {/* Arrow */}
          <div className="flex-shrink-0">
            <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-full bg-purple-500 flex items-center justify-center">
              <ArrowRight className="w-7 h-7 sm:w-8 sm:h-8 text-white rotate-90" />
            </div>
          </div>

          {/* THEN/Reaction Card */}
          <Card className="w-full p-6 sm:p-8 bg-white/5 backdrop-blur-sm border-2 border-purple-500/50 hover:border-purple-500 transition-all">
            <div className="flex items-center gap-2 mb-6">
              <div className="px-3 py-1 rounded-lg bg-purple-500/20 border border-purple-500/50">
                <span className="text-purple-400">THEN</span>
              </div>
              <span className="text-white text-sm sm:text-base">Reaction / Action</span>
            </div>

            {/* Service Selector */}
            <div className="mb-6">
              <Label className="text-white mb-3 block">Select Service</Label>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                {services.filter(s => s.actions.length > 0).map((service) => (
                  <button
                    key={service.id}
                    onClick={() => {
                      setSelectedReaction(service);
                      setSelectedReactionAction('');
                    }}
                    className={`p-3 sm:p-4 rounded-xl border-2 transition-all ${
                      selectedReaction?.id === service.id
                        ? 'border-purple-500 bg-purple-500/10'
                        : 'border-white/10 bg-white/5 hover:border-purple-500/50'
                    }`}
                  >
                    <div className={`w-10 h-10 sm:w-12 sm:h-12 rounded-lg ${service.color} flex items-center justify-center mx-auto mb-2`}>
                      <service.icon className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
                    </div>
                    <div className="text-xs text-white text-center">{service.name}</div>
                  </button>
                ))}
              </div>
            </div>

            {/* Action Selector */}
            {selectedReaction && (
              <div>
                <Label className="text-white mb-2 block">Do this</Label>
                <Select value={selectedReactionAction} onValueChange={setSelectedReactionAction}>
                  <SelectTrigger className="bg-white/5 border-white/20 text-white h-12">
                    <SelectValue placeholder="Select an action" />
                  </SelectTrigger>
                  <SelectContent className="bg-slate-900 border-white/20">
                    {selectedReaction.actions.map((action) => (
                      <SelectItem key={action} value={action} className="text-white">
                        {action}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>

                {selectedReactionAction && (
                  <div className="mt-4 p-4 rounded-lg bg-purple-500/10 border border-purple-500/30">
                    <div className="flex items-center gap-3">
                      <div className={`w-10 h-10 rounded-lg ${selectedReaction.color} flex items-center justify-center flex-shrink-0`}>
                        <selectedReaction.icon className="w-5 h-5 text-white" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="text-white truncate">{selectedReaction.name}</div>
                        <div className="text-sm text-purple-400 truncate">{selectedReactionAction}</div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            )}
          </Card>
        </div>

        {/* Configuration */}
        {selectedActionTrigger && selectedReactionAction && (
          <Card className="p-4 sm:p-6 bg-white/5 backdrop-blur-sm border-white/10 mb-6 sm:mb-8">
            <h3 className="text-white mb-4">Configuration</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label className="text-white mb-2 block">Repository (Optional)</Label>
                <Input
                  type="text"
                  placeholder="username/repository"
                  className="bg-white/5 border-white/20 text-white placeholder:text-slate-500"
                />
              </div>
              <div>
                <Label className="text-white mb-2 block">Discord Channel</Label>
                <Input
                  type="text"
                  placeholder="#general"
                  className="bg-white/5 border-white/20 text-white placeholder:text-slate-500"
                />
              </div>
              <div className="md:col-span-2">
                <Label className="text-white mb-2 block">Message Template</Label>
                <Input
                  type="text"
                  placeholder="New PR: {title} by {author}"
                  className="bg-white/5 border-white/20 text-white placeholder:text-slate-500"
                />
              </div>
            </div>
          </Card>
        )}

        {/* Actions */}
        <div className="flex flex-col sm:flex-row items-center gap-3 sm:gap-4">
          <Button
            size="lg"
            className="bg-purple-500 hover:bg-purple-600 text-white w-full sm:w-auto"
            onClick={handleSave}
            disabled={!areaName || !selectedActionTrigger || !selectedReactionAction}
          >
            <Save className="w-5 h-5 mr-2" />
            {editingAreaId ? 'Update AREA' : 'Save AREA'}
          </Button>
          <Button
            size="lg"
            variant="outline"
            className="border-white/20 text-white hover:bg-white/5 w-full sm:w-auto"
            onClick={handleTest}
            disabled={!selectedActionTrigger || !selectedReactionAction}
          >
            <Play className="w-5 h-5 mr-2" />
            Test
          </Button>
          <Button
            size="lg"
            variant="ghost"
            className="text-slate-400 hover:text-white w-full sm:w-auto"
            onClick={() => onNavigate('dashboard')}
          >
            Cancel
          </Button>
        </div>
      </div>
    </AppLayout>
  );
}