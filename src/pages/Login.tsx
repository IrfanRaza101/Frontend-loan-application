import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Link, useNavigate } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { Eye, EyeOff, Mail, Lock, User, Shield, CheckCircle, ArrowRight, Sparkles, Star, Award, TrendingUp, Clock, LogIn } from "lucide-react";
import { useAuth } from '@/contexts/ReduxAuthContext';
import { useToast } from '@/hooks/use-toast';
import Footer from '@/components/Footer';

const loginSchema = z.object({
  email: z.string().email('Please enter a valid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
  adminToken: z.string().optional(),
  rememberMe: z.boolean().optional(),
});

type LoginFormData = z.infer<typeof loginSchema>;

const Login = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showAdminToken, setShowAdminToken] = useState(false);
  const [isAdminMode, setIsAdminMode] = useState(false);
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    adminToken: '',
    rememberMe: false,
  });
  const { login, adminLogin } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();

  const checkIfAdmin = (email: string) => {
    const adminEmails = ['admin@loanportal.com', 'admin@example.com', 'superadmin@loanportal.com'];
    return adminEmails.includes(email.toLowerCase());
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    try {
      const isAdminEmail = checkIfAdmin(formData.email);
      
      if (isAdminEmail) {
        if (!formData.adminToken) {
          toast({
            title: 'Admin Token Required',
            description: 'Please enter your admin secret token to continue.',
            variant: 'destructive',
          });
          setIsLoading(false);
          return;
        }
        
        const success = await adminLogin(formData.email, formData.adminToken);
        
        if (success) {
          toast({
            title: 'Welcome Admin! 👑',
            description: 'You have been successfully logged in as administrator.',
          });
          navigate('/admin');
        } else {
          toast({
            title: 'Admin Login Failed',
            description: 'Invalid admin credentials or secret token.',
            variant: 'destructive',
          });
        }
      } else {
        const success = await login(formData.email, formData.password);
        
        if (success) {
          toast({
            title: 'Welcome back! 🎉',
            description: 'You have been successfully logged in.',
          });
          navigate('/dashboard');
        } else {
          toast({
            title: 'Login failed',
            description: 'Please check your credentials and try again.',
            variant: 'destructive',
          });
        }
      }
    } catch (error) {
      toast({
        title: 'Login failed',
        description: 'An error occurred. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Check if admin token should be shown
  const shouldShowAdminToken = checkIfAdmin(formData.email);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50 particle-bg morphing-bg flex">
      {/* Left Side - Login Form */}
      <div className="flex-1 flex items-center justify-center p-8 animate-in fade-in-0 slide-in-from-left-4 duration-1000">
        <div className="w-full max-w-md space-y-8">
          {/* Header */}
          <div className="text-center bounce-in">
            <div className="inline-flex items-center gap-2 bg-blue-100 text-blue-700 px-4 py-2 rounded-full text-sm font-medium mb-6 zoom-in glow-pulse">
              <User className="w-4 h-4" />
              Welcome Back
            </div>
            <h1 className="text-4xl font-bold mb-2 text-gradient">
              Sign In
              <Sparkles className="inline-block mb-5 ml-2 w-6 h-6 text-yellow-500 neon-glow" />
            </h1>
            <p className="text-gray-600 slide-in-left">
              Access your loan dashboard and manage your applications
            </p>
          </div>

          {/* Login Form */}
          <Card className="floating-card glass-card magnetic-hover hover-lift">
            <CardContent className="p-8">
              <form onSubmit={handleSubmit} className="space-y-6 stagger-animation">
                <div className="space-y-2 zoom-in" style={{ '--stagger-delay': 1 } as React.CSSProperties}>
                  <Label htmlFor="email" className="text-sm font-medium text-gray-700">
                    Email Address
                  </Label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                    <Input
                      id="email"
                      type="email"
                      value={formData.email}
                      onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
                      className="pl-10 magnetic-hover"
                      placeholder="Enter your email"
                      required
                    />
                  </div>
                </div>

                <div className="space-y-2 zoom-in" style={{ '--stagger-delay': 2 } as React.CSSProperties}>
                  <Label htmlFor="password" className="text-sm font-medium text-gray-700">
                    Password
                  </Label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                    <Input
                      id="password"
                      type={showPassword ? "text" : "password"}
                      value={formData.password}
                      onChange={(e) => setFormData(prev => ({ ...prev, password: e.target.value }))}
                      className="pl-10 pr-10 magnetic-hover"
                      placeholder="Enter your password"
                      required
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                    >
                      {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </div>

                {shouldShowAdminToken && (
                  <div className="space-y-2 zoom-in" style={{ '--stagger-delay': 3 } as React.CSSProperties}>
                    <Label htmlFor="adminToken" className="text-sm font-medium text-gray-700">
                      Admin Token
                    </Label>
                    <div className="relative">
                      <Shield className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                      <Input
                        id="adminToken"
                        type="password"
                        value={formData.adminToken}
                        onChange={(e) => setFormData(prev => ({ ...prev, adminToken: e.target.value }))}
                        className="pl-10 magnetic-hover"
                        placeholder="Enter admin token"
                      />
                    </div>
                  </div>
                )}

                <Button 
                  type="submit" 
                  className="w-full liquid-button magnetic-hover subtle-glow"
                  disabled={isLoading}
                  style={{ '--stagger-delay': 4 } as React.CSSProperties}
                >
                  {isLoading ? 'Signing in...' : 'Sign In'}
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
              </form>

              <div className="mt-6 text-center zoom-in" style={{ '--stagger-delay': 5 } as React.CSSProperties}>
                <p className="text-sm text-gray-600">
                  Don't have an account?{' '}
                  <Link to="/register" className="font-medium text-blue-600 hover:text-blue-500 magnetic-hover">
                    Sign up here
                  </Link>
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
      {/* Right Side - Features */}
      <div className="hidden lg:flex lg:flex-1 bg-gradient-to-br from-blue-100 to-indigo-100 relative overflow-hidden animate-in fade-in-0 slide-in-from-right-4 duration-1000">
        <div className="flex flex-col justify-center px-12 relative z-10">
          <div className="max-w-md p-8 rounded-2xl floating-card glass-card magnetic-hover">
            <div className="bounce-in">
              <h2 className="text-3xl font-bold text-gray-900 mb-6 text-gradient typing-effect">
                Your Financial Partner
                <Star className="inline-block ml-2 w-6 h-6 text-yellow-500 neon-glow" />
              </h2>
              <p className="text-lg text-gray-600 mb-8 slide-in-left">
                Join thousands of satisfied customers who trust us with their financial needs.
              </p>
            </div>

            <div className="space-y-6 stagger-animation">
              <div className="flex items-center space-x-4 zoom-in" style={{ '--stagger-delay': 1 } as React.CSSProperties}>
                <div className="w-12 h-12 bg-blue-500/20 rounded-full flex items-center justify-center glow-pulse">
                  <CheckCircle className="h-6 w-6 text-blue-600" />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900">Quick Approval</h3>
                  <p className="text-sm text-gray-600">Get approved in minutes, not days</p>
                </div>
              </div>

              <div className="flex items-center space-x-4 zoom-in" style={{ '--stagger-delay': 2 } as React.CSSProperties}>
                <div className="w-12 h-12 bg-green-500/20 rounded-full flex items-center justify-center glow-pulse">
                  <Shield className="h-6 w-6 text-green-600" />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900">Secure & Safe</h3>
                  <p className="text-sm text-gray-600">Bank-level security for your data</p>
                </div>
              </div>

              <div className="flex items-center space-x-4 zoom-in" style={{ '--stagger-delay': 3 } as React.CSSProperties}>
                <div className="w-12 h-12 bg-purple-500/20 rounded-full flex items-center justify-center glow-pulse">
                  <TrendingUp className="h-6 w-6 text-purple-600" />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900">Competitive Rates</h3>
                  <p className="text-sm text-gray-600">Best rates in the market</p>
                </div>
              </div>
            </div>

            <div className="mt-12 p-6 bg-white/50 backdrop-blur-sm rounded-xl border border-blue-200 floating-card glass-card magnetic-hover hover-lift" style={{ '--stagger-delay': 4 } as React.CSSProperties}>
              <div className="flex items-center space-x-2 mb-4">
                <Award className="h-5 w-5 text-blue-600 neon-glow" />
                <h3 className="font-semibold text-gray-900">Trusted by 10,000+ customers</h3>
              </div>
              <div className="grid grid-cols-3 gap-4 text-center stagger-animation">
                <div className="zoom-in" style={{ '--stagger-delay': 5 } as React.CSSProperties}>
                  <div className="text-2xl font-bold text-blue-600 neon-glow">98%</div>
                  <div className="text-xs text-gray-600">Approval Rate</div>
                </div>
                <div className="zoom-in" style={{ '--stagger-delay': 6 } as React.CSSProperties}>
                  <div className="text-2xl font-bold text-green-600 neon-glow">24h</div>
                  <div className="text-xs text-gray-600">Avg. Processing</div>
                </div>
                <div className="zoom-in" style={{ '--stagger-delay': 7 } as React.CSSProperties}>
                  <div className="text-2xl font-bold text-yellow-600 neon-glow">4.9★</div>
                  <div className="text-xs text-gray-600">Customer Rating</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;