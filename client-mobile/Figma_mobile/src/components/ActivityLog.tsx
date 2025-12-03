import { AppLayout } from './AppLayout';
import { CheckCircle2, XCircle, Clock, Download, Filter } from 'lucide-react';
import { Button } from './ui/button';
import { Card } from './ui/card';
import { Badge } from './ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from './ui/table';

type Page = 'dashboard' | 'builder' | 'services' | 'activity' | 'settings';

interface ActivityLogProps {
  onNavigate: (page: Page) => void;
  onLogout: () => void;
}

interface LogEntry {
  id: string;
  timestamp: string;
  areaName: string;
  trigger: string;
  action: string;
  status: 'success' | 'error' | 'pending';
  duration: string;
  details: string;
}

const logEntries: LogEntry[] = [
  {
    id: '1',
    timestamp: '2025-11-19 14:32:15',
    areaName: 'GitHub PR to Discord',
    trigger: 'New Pull Request',
    action: 'Send Message',
    status: 'success',
    duration: '0.8s',
    details: 'Message sent to #development'
  },
  {
    id: '2',
    timestamp: '2025-11-19 14:28:42',
    areaName: 'Gmail to Drive Backup',
    trigger: 'New Email with Attachment',
    action: 'Save to Folder',
    status: 'success',
    duration: '1.2s',
    details: 'Saved invoice.pdf to /Backups/2025'
  },
  {
    id: '3',
    timestamp: '2025-11-19 14:15:03',
    areaName: 'Daily Standup Reminder',
    trigger: 'Every Weekday 9 AM',
    action: 'Send Message',
    status: 'success',
    duration: '0.5s',
    details: 'Reminder sent to #team'
  },
  {
    id: '4',
    timestamp: '2025-11-19 13:45:22',
    areaName: 'GitHub PR to Discord',
    trigger: 'New Pull Request',
    action: 'Send Message',
    status: 'error',
    duration: '2.1s',
    details: 'Failed: Discord webhook not found'
  },
  {
    id: '5',
    timestamp: '2025-11-19 12:20:18',
    areaName: 'Gmail to Drive Backup',
    trigger: 'New Email with Attachment',
    action: 'Save to Folder',
    status: 'success',
    duration: '1.5s',
    details: 'Saved report.xlsx to /Backups/2025'
  },
  {
    id: '6',
    timestamp: '2025-11-19 11:33:45',
    areaName: 'Weather Alert',
    trigger: 'Rain Forecast',
    action: 'Send Alert',
    status: 'success',
    duration: '0.9s',
    details: 'Alert sent: 70% rain chance today'
  },
  {
    id: '7',
    timestamp: '2025-11-19 10:15:30',
    areaName: 'GitHub PR to Discord',
    trigger: 'New Pull Request',
    action: 'Send Message',
    status: 'success',
    duration: '0.7s',
    details: 'Message sent to #development'
  },
  {
    id: '8',
    timestamp: '2025-11-19 09:00:12',
    areaName: 'Daily Standup Reminder',
    trigger: 'Every Weekday 9 AM',
    action: 'Send Message',
    status: 'success',
    duration: '0.6s',
    details: 'Reminder sent to #team'
  }
];

export function ActivityLog({ onNavigate, onLogout }: ActivityLogProps) {
  const successCount = logEntries.filter(e => e.status === 'success').length;
  const errorCount = logEntries.filter(e => e.status === 'error').length;
  const successRate = ((successCount / logEntries.length) * 100).toFixed(1);

  return (
    <AppLayout currentPage="activity" onNavigate={onNavigate} onLogout={onLogout}>
      <div className="p-4 sm:p-6 lg:p-8">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-6 sm:mb-8 gap-4">
          <div>
            <h1 className="text-2xl sm:text-3xl text-white mb-2">Activity Log</h1>
            <p className="text-slate-400 text-sm sm:text-base">Monitor your automation execution history</p>
          </div>
          <div className="flex items-center gap-3">
            <Button variant="outline" className="border-white/20 text-black hover:bg-white/5 flex-1 sm:flex-none">
              <Filter className="w-5 h-5 sm:mr-2" />
              <span className="hidden sm:inline">Filter</span>
            </Button>
            <Button variant="outline" className="border-white/20 text-black hover:bg-white/5 flex-1 sm:flex-none">
              <Download className="w-5 h-5 sm:mr-2" />
              <span className="hidden sm:inline">Export</span>
            </Button>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-6 mb-6 sm:mb-8">
          <Card className="p-4 sm:p-6 bg-white/5 backdrop-blur-sm border-white/10">
            <div className="flex items-center gap-3 mb-2">
              <div className="w-10 h-10 rounded-lg bg-blue-500 flex items-center justify-center">
                <Clock className="w-5 h-5 text-white" />
              </div>
              <div>
                <div className="text-xl sm:text-2xl text-white">{logEntries.length}</div>
                <div className="text-xs sm:text-sm text-slate-400">Total</div>
              </div>
            </div>
          </Card>

          <Card className="p-4 sm:p-6 bg-white/5 backdrop-blur-sm border-white/10">
            <div className="flex items-center gap-3 mb-2">
              <div className="w-10 h-10 rounded-lg bg-green-500 flex items-center justify-center">
                <CheckCircle2 className="w-5 h-5 text-white" />
              </div>
              <div>
                <div className="text-xl sm:text-2xl text-white">{successCount}</div>
                <div className="text-xs sm:text-sm text-slate-400">Successful</div>
              </div>
            </div>
          </Card>

          <Card className="p-4 sm:p-6 bg-white/5 backdrop-blur-sm border-white/10">
            <div className="flex items-center gap-3 mb-2">
              <div className="w-10 h-10 rounded-lg bg-red-500 flex items-center justify-center">
                <XCircle className="w-5 h-5 text-white" />
              </div>
              <div>
                <div className="text-xl sm:text-2xl text-white">{errorCount}</div>
                <div className="text-xs sm:text-sm text-slate-400">Failed</div>
              </div>
            </div>
          </Card>

          <Card className="p-4 sm:p-6 bg-white/5 backdrop-blur-sm border-white/10">
            <div className="flex items-center gap-3 mb-2">
              <div className="w-10 h-10 rounded-lg bg-purple-500 flex items-center justify-center">
                <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                </svg>
              </div>
              <div>
                <div className="text-xl sm:text-2xl text-white">{successRate}%</div>
                <div className="text-xs sm:text-sm text-slate-400">Success</div>
              </div>
            </div>
          </Card>
        </div>

        {/* Activity Table - Desktop */}
        <Card className="bg-white/5 backdrop-blur-sm border-white/10 overflow-hidden hidden md:block">
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow className="border-white/10 hover:bg-transparent">
                  <TableHead className="text-slate-300">Timestamp</TableHead>
                  <TableHead className="text-slate-300">AREA</TableHead>
                  <TableHead className="text-slate-300">Trigger</TableHead>
                  <TableHead className="text-slate-300">Action</TableHead>
                  <TableHead className="text-slate-300">Status</TableHead>
                  <TableHead className="text-slate-300">Duration</TableHead>
                  <TableHead className="text-slate-300">Details</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {logEntries.map((entry) => (
                  <TableRow key={entry.id} className="border-white/10 hover:bg-white/5">
                    <TableCell className="text-slate-400">{entry.timestamp}</TableCell>
                    <TableCell className="text-white">{entry.areaName}</TableCell>
                    <TableCell className="text-slate-400">{entry.trigger}</TableCell>
                    <TableCell className="text-slate-400">{entry.action}</TableCell>
                    <TableCell>
                      {entry.status === 'success' && (
                        <Badge className="bg-green-500/20 text-green-400 border-green-500/50">
                          <CheckCircle2 className="w-3 h-3 mr-1" />
                          Success
                        </Badge>
                      )}
                      {entry.status === 'error' && (
                        <Badge className="bg-red-500/20 text-red-400 border-red-500/50">
                          <XCircle className="w-3 h-3 mr-1" />
                          Error
                        </Badge>
                      )}
                      {entry.status === 'pending' && (
                        <Badge className="bg-yellow-500/20 text-yellow-400 border-yellow-500/50">
                          <Clock className="w-3 h-3 mr-1" />
                          Pending
                        </Badge>
                      )}
                    </TableCell>
                    <TableCell className="text-slate-400">{entry.duration}</TableCell>
                    <TableCell className="text-slate-400">{entry.details}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </Card>

        {/* Activity Cards - Mobile */}
        <div className="md:hidden space-y-4">
          {logEntries.map((entry) => (
            <Card key={entry.id} className="p-4 bg-white/5 backdrop-blur-sm border-white/10">
              <div className="flex items-start justify-between mb-3">
                <div className="flex-1 min-w-0">
                  <h3 className="text-white mb-1 truncate">{entry.areaName}</h3>
                  <p className="text-xs text-slate-400">{entry.timestamp}</p>
                </div>
                <div>
                  {entry.status === 'success' && (
                    <Badge className="bg-green-500/20 text-green-400 border-green-500/50 text-xs">
                      <CheckCircle2 className="w-3 h-3 mr-1" />
                      Success
                    </Badge>
                  )}
                  {entry.status === 'error' && (
                    <Badge className="bg-red-500/20 text-red-400 border-red-500/50 text-xs">
                      <XCircle className="w-3 h-3 mr-1" />
                      Error
                    </Badge>
                  )}
                </div>
              </div>
              <div className="space-y-2 text-sm">
                <div className="flex items-center justify-between">
                  <span className="text-slate-400">Trigger:</span>
                  <span className="text-white truncate ml-2">{entry.trigger}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-slate-400">Action:</span>
                  <span className="text-white truncate ml-2">{entry.action}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-slate-400">Duration:</span>
                  <span className="text-white">{entry.duration}</span>
                </div>
                <div className="pt-2 border-t border-white/10">
                  <p className="text-xs text-slate-400">{entry.details}</p>
                </div>
              </div>
            </Card>
          ))}
        </div>

        {/* Pagination */}
        <div className="flex flex-col sm:flex-row items-center justify-between mt-6 gap-4">
          <p className="text-slate-400 text-sm">
            Showing {logEntries.length} entries
          </p>
          <div className="flex items-center gap-2">
            <Button variant="outline" className="border-white/20 text-white hover:bg-white/5" disabled>
              Previous
            </Button>
            <Button variant="outline" className="border-white/20 text-white hover:bg-white/5">
              Next
            </Button>
          </div>
        </div>
      </div>
    </AppLayout>
  );
}