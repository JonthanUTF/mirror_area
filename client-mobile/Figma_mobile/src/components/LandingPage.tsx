import { ArrowRight, Zap, Shield, LineChart, Github, Mail, Cloud, MessageSquare, CloudRain, Clock } from 'lucide-react';
import { Button } from './ui/button';

interface LandingPageProps {
  onNavigateToAuth: () => void;
  onNavigateToDashboard: () => void;
}

export function LandingPage({ onNavigateToAuth, onNavigateToDashboard }: LandingPageProps) {
  return (
    <div className="min-h-screen">
      {/* Navigation */}
      <nav className="fixed top-0 left-0 right-0 z-50 backdrop-blur-xl bg-slate-950/50 border-b border-white/5">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center gap-2">
              <div className="w-10 h-10 rounded-xl bg-purple-500 flex items-center justify-center">
                <Zap className="w-6 h-6 text-white" />
              </div>
              <span className="text-white text-xl">AREA</span>
            </div>
            <div className="flex items-center gap-2 sm:gap-4">
              <Button 
                variant="ghost" 
                className="text-white hover:text-purple-400 hidden sm:flex" 
                onClick={onNavigateToDashboard}
              >
                Dashboard
              </Button>
              <Button 
                className="bg-purple-500 hover:bg-purple-600 text-white text-sm sm:text-base px-4 sm:px-6"
                onClick={onNavigateToAuth}
              >
                Get Started
              </Button>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="pt-24 sm:pt-32 pb-12 sm:pb-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 px-3 sm:px-4 py-2 rounded-full bg-white/5 backdrop-blur-sm border border-white/10 mb-6 sm:mb-8 text-sm">
            <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></span>
            <span className="text-xs sm:text-sm text-slate-300">Trusted by 10,000+ users worldwide</span>
          </div>
          
          <h1 className="text-3xl sm:text-5xl md:text-6xl lg:text-7xl text-white mb-4 sm:mb-6 max-w-4xl mx-auto leading-tight px-4">
            Automate Your <span className="text-purple-400">Digital Life</span>
          </h1>
          
          <p className="text-base sm:text-xl text-slate-400 mb-8 sm:mb-12 max-w-2xl mx-auto px-4">
            Connect your favorite services and create powerful automations. No coding required. 
            Save time and focus on what matters.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center items-center px-4">
            <Button 
              size="lg"
              className="bg-purple-500 hover:bg-purple-600 text-white px-6 sm:px-8 w-full sm:w-auto"
              onClick={onNavigateToAuth}
            >
              Start Free Trial <ArrowRight className="ml-2 w-4 h-4 sm:w-5 sm:h-5" />
            </Button>
            <Button 
              size="lg"
              variant="outline"
              className="border-white/20 text-[rgb(39,0,254)] hover:bg-white/5 w-full sm:w-auto"
            >
              Watch Demo
            </Button>
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl text-white mb-4">Why Choose AREA?</h2>
            <p className="text-slate-400 text-lg">Powerful features to supercharge your workflow</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              {
                icon: Zap,
                title: 'Lightning Fast',
                description: 'Your automations execute in milliseconds, ensuring real-time responses to triggers.'
              },
              {
                icon: Shield,
                title: 'Secure & Private',
                description: 'Bank-level encryption keeps your data safe. We never share your information.'
              },
              {
                icon: LineChart,
                title: 'Analytics Built-in',
                description: 'Track execution history, success rates, and optimize your automation workflows.'
              }
            ].map((feature, index) => (
              <div 
                key={index}
                className="p-8 rounded-2xl bg-white/5 backdrop-blur-sm border border-white/10 hover:border-purple-500/50 transition-all"
              >
                <div className="w-12 h-12 rounded-xl bg-purple-500/20 flex items-center justify-center mb-4">
                  <feature.icon className="w-6 h-6 text-purple-400" />
                </div>
                <h3 className="text-white text-xl mb-3">{feature.title}</h3>
                <p className="text-slate-400">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-b from-transparent via-purple-950/10 to-transparent">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl text-white mb-4">How It Works</h2>
            <p className="text-slate-400 text-lg">Create automations in three simple steps</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              { step: '01', title: 'Choose Trigger', description: 'Select an event from any connected service that starts your automation' },
              { step: '02', title: 'Set Action', description: 'Define what happens automatically when your trigger condition is met' },
              { step: '03', title: 'Activate & Relax', description: 'Turn on your AREA and let automation handle the rest' }
            ].map((item, index) => (
              <div key={index} className="text-center">
                <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-purple-500 text-white text-2xl mb-4">
                  {item.step}
                </div>
                <h3 className="text-white text-xl mb-3">{item.title}</h3>
                <p className="text-slate-400">{item.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Services Showcase */}
      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl text-white mb-4">Connect Your Favorite Services</h2>
            <p className="text-slate-400 text-lg">Integrate with 100+ popular platforms</p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-6 gap-4">
            {[
              { icon: Github, name: 'GitHub', color: 'bg-gray-700' },
              { icon: Mail, name: 'Gmail', color: 'bg-red-500' },
              { icon: Cloud, name: 'Drive', color: 'bg-blue-500' },
              { icon: MessageSquare, name: 'Discord', color: 'bg-indigo-500' },
              { icon: CloudRain, name: 'Weather', color: 'bg-cyan-500' },
              { icon: Clock, name: 'Timer', color: 'bg-purple-500' }
            ].map((service, index) => (
              <div 
                key={index}
                className="p-6 rounded-2xl bg-white/5 backdrop-blur-sm border border-white/10 hover:border-purple-500/50 transition-all flex flex-col items-center justify-center gap-3"
              >
                <div className={`w-12 h-12 rounded-xl ${service.color} flex items-center justify-center`}>
                  <service.icon className="w-6 h-6 text-white" />
                </div>
                <span className="text-white text-sm">{service.name}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto">
          <div className="p-12 rounded-3xl bg-purple-500/20 backdrop-blur-sm border border-white/10 text-center">
            <h2 className="text-3xl sm:text-4xl text-white mb-4">Ready to Automate?</h2>
            <p className="text-slate-300 text-lg mb-8">
              Join thousands of users saving time every day with AREA
            </p>
            <Button 
              size="lg"
              className="bg-purple-500 hover:bg-purple-600 text-white px-8"
              onClick={onNavigateToAuth}
            >
              Get Started Free
            </Button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-white/5 py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto text-center text-slate-500">
          <p>&copy; 2025 AREA. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}