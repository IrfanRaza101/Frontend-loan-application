import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '../components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card';
import { Home, Search, HelpCircle, Sparkles, Star } from 'lucide-react';
import Footer from '@/components/Footer';

const NotFound = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-muted/30 to-background particle-bg morphing-bg flex items-center justify-center px-4">
      <div className="max-w-2xl w-full text-center animate-in fade-in-0 slide-in-from-bottom-4 duration-1000">
        {/* 404 Animation */}
        <div className="mb-8 bounce-in">
          <div className="text-9xl font-bold text-primary/20 mb-4 zoom-in glow-pulse">
            404
          </div>
          <div className="relative">
            <h1 className="text-4xl md:text-6xl font-bold text-foreground mb-4 text-gradient">
              Page Not Found
              <Sparkles className="inline-block ml-2 w-8 h-8 text-yellow-500 neon-glow" />
            </h1>
            <p className="text-xl text-muted-foreground mb-8 slide-in-left">
              Oops! The page you're looking for seems to have wandered off into the digital void.
            </p>
          </div>
        </div>

        {/* Error Card */}
        <Card className="mb-8 shadow-2xl border-0 bg-card/80 backdrop-blur-sm floating-card glass-card magnetic-hover hover-lift stagger-animation" style={{ '--stagger-delay': 1 } as React.CSSProperties}>
          <CardHeader>
            <CardTitle className="text-2xl font-semibold bounce-in text-gradient">
              What happened?
            </CardTitle>
            <CardDescription className="text-lg slide-in-left">
              Don't worry, it happens to the best of us!
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid md:grid-cols-3 gap-4 stagger-animation">
              <div className="p-4 rounded-lg bg-blue-50 border border-blue-200 zoom-in" style={{ '--stagger-delay': 2 } as React.CSSProperties}>
                <Search className="h-8 w-8 text-blue-600 mx-auto mb-2 neon-glow" />
                <h3 className="font-semibold text-blue-900 mb-1">Check the URL</h3>
                <p className="text-sm text-blue-700">Make sure the web address is correct</p>
              </div>
              
              <div className="p-4 rounded-lg bg-green-50 border border-green-200 zoom-in" style={{ '--stagger-delay': 3 } as React.CSSProperties}>
                <Home className="h-8 w-8 text-green-600 mx-auto mb-2 neon-glow" />
                <h3 className="font-semibold text-green-900 mb-1">Go Home</h3>
                <p className="text-sm text-green-700">Return to our homepage</p>
              </div>
              
              <div className="p-4 rounded-lg bg-purple-50 border border-purple-200 zoom-in" style={{ '--stagger-delay': 4 } as React.CSSProperties}>
                <HelpCircle className="h-8 w-8 text-purple-600 mx-auto mb-2 neon-glow" />
                <h3 className="font-semibold text-purple-900 mb-1">Get Help</h3>
                <p className="text-sm text-purple-700">Contact our support team</p>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-4 justify-center pt-6 stagger-animation">
              <Button 
                asChild 
                size="lg" 
                className="liquid-button magnetic-hover subtle-glow zoom-in"
                style={{ '--stagger-delay': 5 } as React.CSSProperties}
              >
                <Link to="/">
                  <Home className="mr-2 h-4 w-4" />
                  Back to Home
                </Link>
              </Button>
              
              <Button 
                asChild 
                variant="outline" 
                size="lg" 
                className="glass-card magnetic-hover hover-lift zoom-in"
                style={{ '--stagger-delay': 6 } as React.CSSProperties}
              >
                <Link to="/contact">
                  <HelpCircle className="mr-2 h-4 w-4" />
                  Contact Support
                </Link>
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Fun Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8 stagger-animation">
          <div className="p-4 rounded-lg bg-gradient-to-br from-blue-500/10 to-blue-600/10 border border-blue-200 floating-card glass-card magnetic-hover hover-lift zoom-in" style={{ '--stagger-delay': 7 } as React.CSSProperties}>
            <div className="text-2xl font-bold text-blue-600 neon-glow">99.9%</div>
            <div className="text-sm text-blue-700">Uptime</div>
          </div>
          
          <div className="p-4 rounded-lg bg-gradient-to-br from-green-500/10 to-green-600/10 border border-green-200 floating-card glass-card magnetic-hover hover-lift zoom-in" style={{ '--stagger-delay': 8 } as React.CSSProperties}>
            <div className="text-2xl font-bold text-green-600 neon-glow">24/7</div>
            <div className="text-sm text-green-700">Support</div>
          </div>
          
          <div className="p-4 rounded-lg bg-gradient-to-br from-purple-500/10 to-purple-600/10 border border-purple-200 floating-card glass-card magnetic-hover hover-lift zoom-in" style={{ '--stagger-delay': 9 } as React.CSSProperties}>
            <div className="text-2xl font-bold text-purple-600 neon-glow">10k+</div>
            <div className="text-sm text-purple-700">Happy Users</div>
          </div>
          
          <div className="p-4 rounded-lg bg-gradient-to-br from-yellow-500/10 to-yellow-600/10 border border-yellow-200 floating-card glass-card magnetic-hover hover-lift zoom-in" style={{ '--stagger-delay': 10 } as React.CSSProperties}>
            <div className="text-2xl font-bold text-yellow-600 neon-glow flex items-center justify-center">
              4.9
              <Star className="ml-1 h-4 w-4 fill-current" />
            </div>
            <div className="text-sm text-yellow-700">Rating</div>
          </div>
        </div>

        {/* Footer Message */}
        <p className="text-sm text-muted-foreground slide-in-left" style={{ '--stagger-delay': 11 } as React.CSSProperties}>
          Lost? Don't worry, even the best explorers sometimes take a wrong turn.
        </p>
      </div>
      <Footer />
    </div>
  );
};

export default NotFound;
