import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Separator } from "@/components/ui/separator";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  User, 
  Mail, 
  Phone, 
  MapPin, 
  DollarSign, 
  Calendar, 
  FileText, 
  CheckCircle, 
  ArrowRight, 
  ArrowLeft,
  Star,
  Sparkles,
  Shield,
  Clock,
  TrendingUp,
  Calculator
} from "lucide-react";
import { useAuth } from '@/contexts/ReduxAuthContext';
import { useToast } from '@/hooks/use-toast';

const loanSchema = z.object({
  amount: z.number().min(1000, 'Minimum loan amount is $1,000').max(500000, 'Maximum loan amount is $500,000'),
  term: z.number().min(12, 'Minimum term is 12 months').max(120, 'Maximum term is 120 months'),
  purpose: z.string()
    .min(10, 'Please provide a detailed purpose (minimum 10 characters)')
    .max(500, 'Purpose description cannot exceed 500 characters')
    .refine((val) => val.trim().length >= 10, {
      message: 'Purpose must contain at least 10 meaningful characters'
    }),
  loanType: z.enum(['personal', 'business', 'home', 'auto', 'education'], {
    required_error: 'Please select a loan type',
  }),
});

type LoanFormData = z.infer<typeof loanSchema>;

const Apply = () => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formProgress, setFormProgress] = useState(0);
  const [currentStep, setCurrentStep] = useState(1);
  const [customPurpose, setCustomPurpose] = useState(false);
  const totalSteps = 4;
  const { isAuthenticated, submitLoanApplication } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();

  const commonPurposes = [
    'Home renovation',
    'Debt consolidation', 
    'Business expansion',
    'Education expenses',
    'Medical expenses',
    'Wedding expenses',
    'Vehicle purchase',
    'Emergency expenses',
    'Investment opportunity',
    'Other (please specify)'
  ];

  const form = useForm<LoanFormData>({
    resolver: zodResolver(loanSchema),
    defaultValues: {
      amount: 10000,
      term: 36,
      purpose: '',
      loanType: 'personal',
    },
  });

  const watchedValues = form.watch();

  // Calculate form completion progress
  useEffect(() => {
    const fields = ['loanType', 'amount', 'term', 'purpose'];
    const completedFields = fields.filter(field => {
      const value = watchedValues[field as keyof LoanFormData];
      if (field === 'purpose') {
        // Purpose is complete if it has minimum 10 characters
        return value && value.trim().length >= 10;
      }
      return value !== '' && value !== undefined && value !== null;
    });
    setFormProgress((completedFields.length / fields.length) * 100);
  }, [watchedValues]);

  // Calculate estimated interest rate based on loan type and amount
  const getEstimatedRate = () => {
    const amount = watchedValues.amount || 0;
    const loanType = watchedValues.loanType;
    
    if (loanType === 'personal') {
      if (amount < 10000) return 8.99;
      if (amount < 25000) return 7.99;
      return 6.99;
    } else {
      if (amount < 50000) return 9.99;
      if (amount < 100000) return 8.99;
      return 7.99;
    }
  };

  // Calculate monthly payment with interest
  const calculateMonthlyPayment = () => {
    const amount = watchedValues.amount || 0;
    const term = watchedValues.term || 1;
    const rate = getEstimatedRate() / 100 / 12;
    
    if (rate === 0) return amount / term;
    
    const monthlyPayment = (amount * rate * Math.pow(1 + rate, term)) / (Math.pow(1 + rate, term) - 1);
    return monthlyPayment;
  };

  const onSubmit = async (data: LoanFormData) => {
    if (!isAuthenticated) {
      toast({
        title: 'Authentication Required',
        description: 'Please login to submit a loan application.',
        variant: 'destructive',
      });
      navigate('/login');
      return;
    }

    setIsSubmitting(true);
    
    try {
      const success = await submitLoanApplication({
        amount: data.amount,
        term: data.term,
        purpose: data.purpose,
        loanType: data.loanType,
      });

      if (success) {
        toast({
          title: 'Application Submitted!',
          description: 'Your loan application has been submitted successfully. You will receive a response within 24 hours.',
        });
        navigate('/dashboard');
      } else {
        toast({
          title: 'Submission Failed',
          description: 'There was an error submitting your application. Please try again.',
          variant: 'destructive',
        });
      }
    } catch (error) {
      toast({
        title: 'Submission Error',
        description: 'An unexpected error occurred. Please try again later.',
        variant: 'destructive',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50 particle-bg morphing-bg">
      {/* Hero Section */}
      <section className="relative py-20 overflow-hidden animate-in fade-in-0 slide-in-from-bottom-4 duration-1000">
        <div className="container mx-auto px-4">
          <div className="text-center max-w-4xl mx-auto">
            <div className="inline-flex items-center gap-2 bg-blue-100 text-blue-700 px-4 py-2 rounded-full text-sm font-medium mb-6 zoom-in glow-pulse">
              <FileText className="w-4 h-4" />
              Loan Application
            </div>
            <h1 className="text-5xl md:text-6xl font-bold mb-6 bounce-in text-gradient typing-effect">
              Apply for Your Loan
              <Sparkles className="inline-block ml-2 w-8 h-8 text-yellow-500 neon-glow" />
            </h1>
            <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto slide-in-left">
              Get the funding you need with our simple, secure application process. Quick approval in just minutes.
            </p>
            
            {/* Progress Indicator */}
            <div className="max-w-md mx-auto mb-8 floating-card glass-card p-6 rounded-xl magnetic-hover">
              <div className="flex items-center justify-between mb-4">
                <span className="text-sm font-medium text-gray-600">Application Progress</span>
                <span className="text-sm font-medium text-blue-600">{Math.round((currentStep / totalSteps) * 100)}%</span>
              </div>
              <Progress value={(currentStep / totalSteps) * 100} className="h-2 subtle-glow" />
              <div className="flex justify-between mt-2 text-xs text-gray-500">
                <span>Step {currentStep}</span>
                <span>of {totalSteps}</span>
              </div>
            </div>
          </div>
        </div>
      </section>
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="text-center mb-8">
            <Badge className="mb-4 bg-blue-50 text-blue-600 border-blue-200">
              💼 Loan Application
            </Badge>
            
            <h1 className="text-3xl font-bold tracking-tight text-slate-800 sm:text-4xl lg:text-5xl">
              Apply for Your Loan
            </h1>
            <p className="mt-6 text-lg leading-8 text-muted-foreground max-w-2xl mx-auto">
              Complete your application in minutes. Get instant pre-approval and competitive rates.
            </p>
          </div>

          {/* Progress Bar */}
          <div className="mb-8">
            <div className="flex justify-between items-center mb-2">
              <span className="text-sm font-medium text-muted-foreground">Application Progress</span>
              <span className="text-sm font-medium text-primary">{Math.round(formProgress)}% Complete</span>
            </div>
            <Progress value={formProgress} className="h-2" />
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Main Form */}
            <div className="lg:col-span-2">
              <Card className="shadow-lg border-0 bg-gradient-to-br from-white to-gray-50">
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <FileText className="h-5 w-5 text-primary" />
                    <span>Loan Application Form</span>
                  </CardTitle>
                  <CardDescription>
                    Please provide accurate information to help us process your application quickly.
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                      <FormField
                        control={form.control}
                        name="loanType"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="text-base font-semibold">Loan Type</FormLabel>
                            <Select onValueChange={field.onChange} defaultValue={field.value}>
                              <FormControl>
                                <SelectTrigger className="h-12">
                                  <SelectValue placeholder="Select loan type" />
                                </SelectTrigger>
                              </FormControl>
                              <SelectContent>
                                <SelectItem value="personal">Personal Loan</SelectItem>
                                <SelectItem value="business">Business Loan</SelectItem>
                              </SelectContent>
                            </Select>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="amount"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="text-base font-semibold">Loan Amount</FormLabel>
                            <FormControl>
                              <div className="relative">
                                <DollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                                <Input
                                  type="number"
                                  placeholder="Enter amount"
                                  className="pl-10 h-12"
                                  {...field}
                                  onChange={(e) => field.onChange(Number(e.target.value))}
                                />
                              </div>
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="term"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="text-base font-semibold">Loan Term (Months)</FormLabel>
                            <FormControl>
                              <div className="relative">
                                <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                                <Input
                                  type="number"
                                  placeholder="Enter term in months"
                                  className="pl-10 h-12"
                                  {...field}
                                  onChange={(e) => field.onChange(Number(e.target.value))}
                                />
                              </div>
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="purpose"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="text-base font-semibold">Loan Purpose</FormLabel>
                            <FormControl>
                              <div className="space-y-4">
                                {/* Quick Purpose Selection */}
                                <div>
                                  <Label className="text-sm font-medium mb-2 block">Quick Selection (Optional)</Label>
                                  <div className="grid grid-cols-2 gap-2">
                                    {commonPurposes.slice(0, -1).map((purpose) => (
                                      <Button
                                        key={purpose}
                                        type="button"
                                        variant={field.value === purpose ? "default" : "outline"}
                                        size="sm"
                                        className="justify-start text-left h-auto py-2 px-3 text-xs"
                                        onClick={() => {
                                          field.onChange(purpose);
                                          setCustomPurpose(false);
                                        }}
                                      >
                                        {purpose}
                                      </Button>
                                    ))}
                                  </div>
                                </div>
                                
                                {/* OR Divider */}
                                <div className="flex items-center gap-4">
                                  <div className="flex-1 h-px bg-gray-200"></div>
                                  <span className="text-xs text-gray-500 font-medium">OR</span>
                                  <div className="flex-1 h-px bg-gray-200"></div>
                                </div>
                                
                                {/* Custom Purpose Text Area - Always Visible */}
                                <div>
                                  <Label className="text-sm font-medium mb-2 block">Custom Purpose Description</Label>
                                  <div className="relative">
                                    <FileText className="absolute left-3 top-3 text-muted-foreground h-4 w-4" />
                                    <Textarea
                                      placeholder="Describe your loan purpose in detail (minimum 10 characters)..."
                                      className="min-h-[120px] resize-none pl-10 pt-3"
                                      value={customPurpose ? field.value || '' : ''}
                                      onChange={(e) => {
                                        field.onChange(e.target.value);
                                        setCustomPurpose(true);
                                      }}
                                      onFocus={() => setCustomPurpose(true)}
                                    />
                                    <div className="absolute bottom-2 right-2 text-xs text-muted-foreground">
                                      {(customPurpose ? field.value?.length : 0) || 0}/500
                                    </div>
                                  </div>
                                </div>
                                
                                {/* Show selected purpose if it's from quick selection */}
                                {!customPurpose && field.value && commonPurposes.slice(0, -1).includes(field.value) && (
                                  <div className="p-3 bg-blue-50 border border-blue-200 rounded-lg">
                                    <div className="flex items-center justify-between">
                                      <div className="flex items-center gap-2">
                                        <CheckCircle className="h-4 w-4 text-blue-600" />
                                        <span className="text-sm font-medium text-blue-800">Selected:</span>
                                        <span className="text-sm text-blue-700">{field.value}</span>
                                      </div>
                                      <Button
                                        type="button"
                                        variant="ghost"
                                        size="sm"
                                        onClick={() => {
                                          field.onChange('');
                                          setCustomPurpose(false);
                                        }}
                                        className="h-6 px-2 text-xs text-blue-600 hover:text-blue-800"
                                      >
                                        Clear
                                      </Button>
                                    </div>
                                  </div>
                                )}
                              </div>
                            </FormControl>
                            <FormDescription className="text-sm text-muted-foreground">
                              Choose a quick option above or write a detailed custom description below.
                            </FormDescription>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <Button
                        type="submit"
                        className="w-full h-12 text-base font-semibold"
                        disabled={isSubmitting}
                      >
                        {isSubmitting ? (
                          'Submitting Application...'
                        ) : (
                          <>
                            Submit Application
                            <ArrowRight className="ml-2 h-4 w-4" />
                          </>
                        )}
                      </Button>
                    </form>
                  </Form>
                </CardContent>
              </Card>
            </div>

            {/* Loan Calculator Sidebar */}
            <div className="lg:col-span-1">
              <Card className="shadow-lg border-0 bg-gradient-to-br from-blue-50 to-indigo-50 sticky top-8">
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2 text-blue-800">
                    <Calculator className="h-5 w-5" />
                    <span>Loan Calculator</span>
                  </CardTitle>
                  <CardDescription className="text-blue-600">
                    Estimated monthly payment based on your inputs
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-3">
                    <div className="flex justify-between items-center p-3 bg-white rounded-lg">
                      <span className="text-sm font-medium text-muted-foreground">Loan Amount</span>
                      <span className="font-semibold text-lg">
                        ${(watchedValues.amount || 0).toLocaleString()}
                      </span>
                    </div>
                    
                    <div className="flex justify-between items-center p-3 bg-white rounded-lg">
                      <span className="text-sm font-medium text-muted-foreground">Term</span>
                      <span className="font-semibold text-lg">
                        {watchedValues.term || 0} months
                      </span>
                    </div>
                    
                    <div className="flex justify-between items-center p-3 bg-white rounded-lg">
                      <span className="text-sm font-medium text-muted-foreground">Est. Interest Rate</span>
                      <span className="font-semibold text-lg text-blue-600">
                        {getEstimatedRate()}% APR
                      </span>
                    </div>
                    
                    <div className="flex justify-between items-center p-4 bg-gradient-to-r from-blue-500 to-blue-600 rounded-lg text-white">
                      <span className="text-sm font-medium">Monthly Payment</span>
                      <span className="font-bold text-xl">
                        ${calculateMonthlyPayment().toLocaleString('en-US', {
                          minimumFractionDigits: 2,
                          maximumFractionDigits: 2
                        })}
                      </span>
                    </div>
                  </div>

                  <div className="mt-6 p-4 bg-green-50 rounded-lg border border-green-200">
                    <div className="flex items-center space-x-2 mb-2">
                      <CheckCircle className="h-4 w-4 text-green-600" />
                      <span className="text-sm font-medium text-green-800">Pre-qualification Benefits</span>
                    </div>
                    <ul className="text-xs text-green-700 space-y-1">
                      <li>• No impact on credit score</li>
                      <li>• Instant decision</li>
                      <li>• Competitive rates</li>
                      <li>• Flexible terms</li>
                    </ul>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Apply;