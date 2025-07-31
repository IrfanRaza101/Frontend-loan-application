import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card';
import { Label } from '../components/ui/label';
import { Checkbox } from '../components/ui/checkbox';
import { Separator } from '../components/ui/separator';
import { Badge } from '../components/ui/badge';
import { Eye, EyeOff, Mail, Lock, User, Shield, CheckCircle, ArrowRight, Sparkles, Star, Award, TrendingUp, Clock, UserPlus, Check, X } from 'lucide-react';
import { useAuth } from '../contexts/ReduxAuthContext';
import Footer from '@/components/Footer';

const Register = () => {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    confirmPassword: '',
    agreeToTerms: false
  });
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [passwordStrength, setPasswordStrength] = useState(0);
  const { register: registerUser } = useAuth();
  const navigate = useNavigate();

  const calculatePasswordStrength = (password: string) => {
    let strength = 0;
    if (password.length >= 6) strength += 25;
    if (password.length >= 8) strength += 25;
    if (/[A-Z]/.test(password)) strength += 25;
    if (/[0-9]/.test(password)) strength += 25;
    return strength;
  };

  const getPasswordStrengthText = (strength: number) => {
    if (strength < 25) return { text: 'Very Weak', color: 'text-red-500' };
    if (strength < 50) return { text: 'Weak', color: 'text-orange-500' };
    if (strength < 75) return { text: 'Good', color: 'text-yellow-500' };
    return { text: 'Strong', color: 'text-green-500' };
  };

  const getPasswordStrengthColor = (strength: number) => {
    if (strength < 25) return 'bg-red-500';
    if (strength < 50) return 'bg-orange-500';
    if (strength < 75) return 'bg-yellow-500';
    return 'bg-green-500';
  };

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate that terms are agreed to
    if (!formData.agreeToTerms) {
      alert('Please agree to the Terms of Service and Privacy Policy to continue.');
      return;
    }
    
    // Validate password match
    if (formData.password !== formData.confirmPassword) {
      alert('Passwords do not match.');
      return;
    }
    
    setIsLoading(true);
    
    try {
      // Create full name from firstName and lastName for backward compatibility
      const fullName = `${formData.firstName} ${formData.lastName}`.trim();
      const success = await registerUser(fullName, formData.email, formData.password);
      
      if (success) {
        navigate('/dashboard');
      }
    } catch (error: unknown) {
      console.error('Registration failed:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
    
    if (name === 'password') {
      setPasswordStrength(calculatePasswordStrength(value));
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-muted/30 to-background particle-bg morphing-bg">
      <div className="flex min-h-screen">
        {/* Left Side - Registration Form */}
        <div className="flex-1 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8 animate-in fade-in-0 slide-in-from-left-4 duration-1000">
          <div className="max-w-md w-full">
            {/* Header */}
            <div className="text-center mb-8 bounce-in">
              <div className="mx-auto w-16 h-16 bg-gradient-to-br from-primary to-primary/80 rounded-2xl flex items-center justify-center mb-6 shadow-lg zoom-in glow-pulse">
                <UserPlus className="h-8 w-8 text-primary-foreground" />
              </div>
              <h1 className="text-4xl font-bold tracking-tight text-foreground mb-2 text-gradient">
                Join Us Today
                <Sparkles className="inline-block ml-2 w-6 h-6 text-yellow-500 neon-glow" />
              </h1>
              <p className="text-muted-foreground text-lg slide-in-left">
                Create your account and start your financial journey
              </p>
            </div>

            {/* Registration Card */}
            <Card className="shadow-2xl border-0 bg-card/80 backdrop-blur-sm floating-card glass-card magnetic-hover hover-lift stagger-animation" style={{ '--stagger-delay': 1 } as React.CSSProperties}>
              <CardHeader className="space-y-1 pb-6">
                <CardTitle className="text-2xl font-semibold text-center bounce-in text-gradient">Create Account</CardTitle>
                <CardDescription className="text-center slide-in-left">
                  Fill in your details to get started
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <form onSubmit={onSubmit} className="space-y-5 stagger-animation">
                  <div className="zoom-in" style={{ '--stagger-delay': 2 } as React.CSSProperties}>
                    <Label className="flex items-center space-x-2 text-sm font-medium">
                      <User className="h-4 w-4 text-primary neon-glow" />
                      <span>Name</span>
                    </Label>
                    <div className="grid grid-cols-2 gap-4 mt-2">
                      <div className="relative">
                        <Input
                          name="firstName"
                          placeholder="First Name"
                          className="pl-10 h-11 glass-card magnetic-hover"
                          value={formData.firstName}
                          onChange={handleInputChange}
                          required
                        />
                        <User className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                      </div>
                      <div className="relative">
                        <Input
                          name="lastName"
                          placeholder="Last Name"
                          className="pl-3 h-11 glass-card magnetic-hover"
                          value={formData.lastName}
                          onChange={handleInputChange}
                        />
                      </div>
                    </div>
                  </div>

                  <div className="zoom-in" style={{ '--stagger-delay': 3 } as React.CSSProperties}>
                    <Label className="flex items-center space-x-2 text-sm font-medium">
                      <Mail className="h-4 w-4 text-primary neon-glow" />
                      <span>Email Address</span>
                    </Label>
                    <div className="relative mt-2">
                      <Input
                        name="email"
                        type="email"
                        placeholder="your@email.com"
                        className="pl-10 h-11 glass-card magnetic-hover"
                        value={formData.email}
                        onChange={handleInputChange}
                        required
                      />
                      <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    </div>
                  </div>

                  <div className="zoom-in" style={{ '--stagger-delay': 4 } as React.CSSProperties}>
                    <Label className="flex items-center space-x-2 text-sm font-medium">
                      <Lock className="h-4 w-4 text-primary neon-glow" />
                      <span>Password</span>
                    </Label>
                    <div className="relative mt-2">
                      <Input
                        name="password"
                        type={showPassword ? "text" : "password"}
                        placeholder="••••••••"
                        className="pl-10 pr-10 h-11 glass-card magnetic-hover"
                        value={formData.password}
                        onChange={handleInputChange}
                        required
                      />
                      <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        className="absolute right-1 top-1/2 transform -translate-y-1/2 h-8 w-8 p-0 hover-lift"
                        onClick={() => setShowPassword(!showPassword)}
                      >
                        {showPassword ? (
                          <EyeOff className="h-4 w-4" />
                        ) : (
                          <Eye className="h-4 w-4" />
                        )}
                      </Button>
                    </div>
                    {formData.password && (
                      <div className="mt-2 space-y-2 slide-in-left">
                        <div className="flex items-center justify-between text-xs">
                          <span className="text-muted-foreground">Password strength:</span>
                          <span className={getPasswordStrengthText(passwordStrength).color}>
                            {getPasswordStrengthText(passwordStrength).text}
                          </span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-2">
                          <div 
                            className={`h-2 rounded-full transition-all duration-300 ${getPasswordStrengthColor(passwordStrength)}`}
                            style={{ width: `${passwordStrength}%` }}
                          />
                        </div>
                      </div>
                    )}
                  </div>

                  <div className="zoom-in" style={{ '--stagger-delay': 5 } as React.CSSProperties}>
                    <Label className="flex items-center space-x-2 text-sm font-medium">
                      <Lock className="h-4 w-4 text-primary neon-glow" />
                      <span>Confirm Password</span>
                    </Label>
                    <div className="relative mt-2">
                      <Input
                        name="confirmPassword"
                        type={showConfirmPassword ? "text" : "password"}
                        placeholder="••••••••"
                        className="pl-10 pr-10 h-11 glass-card magnetic-hover"
                        value={formData.confirmPassword}
                        onChange={handleInputChange}
                        required
                      />
                      <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        className="absolute right-1 top-1/2 transform -translate-y-1/2 h-8 w-8 p-0 hover-lift"
                        onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                      >
                        {showConfirmPassword ? (
                          <EyeOff className="h-4 w-4" />
                        ) : (
                          <Eye className="h-4 w-4" />
                        )}
                      </Button>
                      {formData.confirmPassword && formData.password && (
                        <div className="absolute right-10 top-1/2 transform -translate-y-1/2">
                          {formData.confirmPassword === formData.password ? (
                            <Check className="h-4 w-4 text-green-500 neon-glow" />
                          ) : (
                            <X className="h-4 w-4 text-red-500" />
                          )}
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="flex items-start space-x-3 zoom-in" style={{ '--stagger-delay': 6 } as React.CSSProperties}>
                    <Checkbox
                      id="agreeToTerms"
                      checked={formData.agreeToTerms}
                      onCheckedChange={(checked) => {
                        setFormData(prev => ({
                          ...prev,
                          agreeToTerms: checked === true
                        }));
                      }}
                      className="mt-1"
                      required
                    />
                    <Label htmlFor="agreeToTerms" className="text-sm font-normal leading-5 cursor-pointer">
                      I agree to the{' '}
                      <Link to="/terms" className="text-primary hover:underline neon-glow">
                        Terms of Service
                      </Link>{' '}
                      and{' '}
                      <Link to="/privacy" className="text-primary hover:underline neon-glow">
                        Privacy Policy
                      </Link>
                    </Label>
                  </div>

                  <Button 
                    type="submit" 
                    className="w-full h-11 text-base font-medium liquid-button magnetic-hover subtle-glow zoom-in" 
                    disabled={isLoading || !formData.agreeToTerms || formData.password !== formData.confirmPassword || !formData.firstName || !formData.email || !formData.password}
                    style={{ '--stagger-delay': 7 } as React.CSSProperties}
                  >
                    {isLoading ? (
                      <div className="flex items-center space-x-2">
                        <div className="w-4 h-4 border-2 border-primary-foreground/30 border-t-primary-foreground rounded-full animate-spin" />
                        <span>Creating account...</span>
                      </div>
                    ) : (
                      <>
                        Create Account
                        <ArrowRight className="ml-2 h-4 w-4" />
                      </>
                    )}
                  </Button>
                </form>

                <Separator className="my-6" />

                <div className="text-center slide-in-left" style={{ '--stagger-delay': 8 } as React.CSSProperties}>
                  <p className="text-sm text-muted-foreground">
                    Already have an account?{' '}
                    <Link to="/login" className="text-primary hover:underline font-medium neon-glow">
                      Sign in here
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
                  Join Our Community
                  <Star className="inline-block ml-2 w-6 h-6 text-yellow-500 neon-glow" />
                </h2>
                <p className="text-lg text-gray-600 mb-8 slide-in-left">
                  Become part of a growing community of successful borrowers.
                </p>
              </div>

              <div className="space-y-6 stagger-animation">
                <div className="flex items-center space-x-4 zoom-in" style={{ '--stagger-delay': 1 } as React.CSSProperties}>
                  <div className="w-12 h-12 bg-blue-500/20 rounded-full flex items-center justify-center glow-pulse">
                    <CheckCircle className="h-6 w-6 text-blue-600" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900">Instant Verification</h3>
                    <p className="text-sm text-gray-600">Get verified in real-time</p>
                  </div>
                </div>

                <div className="flex items-center space-x-4 zoom-in" style={{ '--stagger-delay': 2 } as React.CSSProperties}>
                  <div className="w-12 h-12 bg-green-500/20 rounded-full flex items-center justify-center glow-pulse">
                    <Shield className="h-6 w-6 text-green-600" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900">Data Protection</h3>
                    <p className="text-sm text-gray-600">Your information is always secure</p>
                  </div>
                </div>

                <div className="flex items-center space-x-4 zoom-in" style={{ '--stagger-delay': 3 } as React.CSSProperties}>
                  <div className="w-12 h-12 bg-purple-500/20 rounded-full flex items-center justify-center glow-pulse">
                    <TrendingUp className="h-6 w-6 text-purple-600" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900">Build Credit</h3>
                    <p className="text-sm text-gray-600">Improve your credit score</p>
                  </div>
                </div>
              </div>

              <div className="mt-12 p-6 bg-white/50 backdrop-blur-sm rounded-xl border border-blue-200 floating-card glass-card magnetic-hover hover-lift" style={{ '--stagger-delay': 4 } as React.CSSProperties}>
                <div className="flex items-center space-x-2 mb-4">
                  <Award className="h-5 w-5 text-blue-600 neon-glow" />
                  <h3 className="font-semibold text-gray-900">Join 15,000+ members</h3>
                </div>
                <div className="grid grid-cols-3 gap-4 text-center stagger-animation">
                  <div className="zoom-in" style={{ '--stagger-delay': 5 } as React.CSSProperties}>
                    <div className="text-2xl font-bold text-blue-600 neon-glow">99%</div>
                    <div className="text-xs text-gray-600">Satisfaction</div>
                  </div>
                  <div className="zoom-in" style={{ '--stagger-delay': 6 } as React.CSSProperties}>
                    <div className="text-2xl font-bold text-green-600 neon-glow">5min</div>
                    <div className="text-xs text-gray-600">Setup Time</div>
                  </div>
                  <div className="zoom-in" style={{ '--stagger-delay': 7 } as React.CSSProperties}>
                    <div className="text-2xl font-bold text-yellow-600 neon-glow">24/7</div>
                    <div className="text-xs text-gray-600">Support</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    
    </div>
  );
};

export default Register;