import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/ReduxAuthContext';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Link } from 'react-router-dom';
import Footer from '@/components/Footer';
import { 
  Plus, 
  FileText, 
  Clock, 
  CheckCircle, 
  XCircle, 
  DollarSign, 
  Calendar,
  TrendingUp,
  User,
  CreditCard,
  BarChart3,
  PieChart,
  Activity,
  Target,
  Wallet,
  AlertCircle,
  Download,
  Eye,
  Settings,
  Star,
  Sparkles,
  Shield,
  Award,
  Bell,
  RefreshCw
} from 'lucide-react';
import { format } from 'date-fns';
import { toast } from 'sonner';
import PaymentDialog from '@/components/PaymentDialog';
import { 
  useGetUserWalletQuery,
  useGetUserNotificationsQuery,
  useGetUserInstallmentsQuery,
  useMarkNotificationAsReadMutation
} from '@/store/api/loanApi';
import { useAppDispatch } from '@/store/hooks';
import { addNotification } from '@/store/slices/uiSlice';

interface AnimatedValues {
  totalAmount: number;
  pendingCount: number;
  totalCount: number;
}

interface Installment {
  _id: string;
  amount: number;
  dueDate: string;
  status: string;
  loanId: string;
}

interface Notification {
  _id: string;
  title: string;
  message: string;
  type: string;
  read: boolean;
  createdAt: string;
}

const Dashboard = () => {
  const { user, loanApplications } = useAuth();
  const dispatch = useAppDispatch();
  
  // Demo data for when no real applications exist
  const demoApplications = [
    {
      _id: 'demo-1',
      id: 'demo-1',
      amount: 25000,
      term: 12,
      purpose: 'Home Improvement',
      status: 'approved' as const,
      createdAt: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString(),
      userId: user?.id || '',
      loanType: 'personal',
      type: 'personal'
    },
    {
      _id: 'demo-2',
      id: 'demo-2',
      amount: 15000,
      term: 24,
      purpose: 'Car Purchase',
      status: 'pending' as const,
      createdAt: new Date(Date.now() - 15 * 24 * 60 * 60 * 1000).toISOString(),
      userId: user?.id || '',
      loanType: 'auto',
      type: 'auto'
    },
    {
      _id: 'demo-3',
      id: 'demo-3',
      amount: 50000,
      term: 36,
      purpose: 'Business Expansion',
      status: 'approved' as const,
      createdAt: new Date(Date.now() - 45 * 24 * 60 * 60 * 1000).toISOString(),
      userId: user?.id || '',
      loanType: 'business',
      type: 'business'
    }
  ];

  // Use real data if available, otherwise use demo data
  const displayApplications = loanApplications.length > 0 ? loanApplications : demoApplications;
  
  const [animatedValues, setAnimatedValues] = useState<AnimatedValues>({
    totalAmount: 0,
    pendingCount: 0,
    totalCount: 0
  });
  const [selectedInstallment, setSelectedInstallment] = useState<Installment | null>(null);
  const [paymentDialogOpen, setPaymentDialogOpen] = useState<boolean>(false);

  // RTK Query hooks
  const { data: walletData, isLoading: walletLoading, refetch: refetchWallet } = useGetUserWalletQuery();
  const { data: notificationsData, isLoading: notificationsLoading, refetch: refetchNotifications } = useGetUserNotificationsQuery({ limit: 5 });
  const { data: installmentsData, isLoading: installmentsLoading, refetch: refetchInstallments } = useGetUserInstallmentsQuery({ limit: 5 });
  const [markNotificationAsRead] = useMarkNotificationAsReadMutation();

  // Extract data from API responses
  const wallet = walletData?.data;
  const notifications = notificationsData?.data?.notifications || [];
  const unreadCount = notificationsData?.data?.unreadCount || 0;
  const installments = installmentsData?.data?.installments || [];
  const loading = walletLoading || notificationsLoading || installmentsLoading;

  const getStatusIcon = (status: string): JSX.Element => {
    switch (status) {
      case 'pending':
        return <Clock className="h-4 w-4" />;
      case 'approved':
        return <CheckCircle className="h-4 w-4" />;
      case 'rejected':
        return <XCircle className="h-4 w-4" />;
      default:
        return <FileText className="h-4 w-4" />;
    }
  };

  const getStatusVariant = (status: string): "default" | "secondary" | "destructive" => {
    switch (status) {
      case 'pending':
        return 'secondary';
      case 'approved':
        return 'default';
      case 'rejected':
        return 'destructive';
      default:
        return 'secondary';
    }
  };

  const totalLoanAmount = displayApplications
    .filter(app => app.status === 'approved')
    .reduce((sum, app) => sum + app.amount, 0);

  const pendingApplications = displayApplications.filter(app => app.status === 'pending').length;
  const approvedApplications = displayApplications.filter(app => app.status === 'approved').length;
  const rejectedApplications = displayApplications.filter(app => app.status === 'rejected').length;

  // Animate numbers on mount
  useEffect(() => {
    const animateNumber = (target: number, setter: (value: number) => void): void => {
      let current = 0;
      const increment = target / 50;
      const timer = setInterval(() => {
        current += increment;
        if (current >= target) {
          current = target;
          clearInterval(timer);
        }
        setter(Math.floor(current));
      }, 20);
    };

    animateNumber(totalLoanAmount, (value) => 
      setAnimatedValues(prev => ({ ...prev, totalAmount: value }))
    );
    animateNumber(pendingApplications, (value) => 
      setAnimatedValues(prev => ({ ...prev, pendingCount: value }))
    );
    animateNumber(displayApplications.length, (value) => 
      setAnimatedValues(prev => ({ ...prev, totalCount: value }))
    );
  }, [totalLoanAmount, pendingApplications, displayApplications.length]);

  // Refresh all dashboard data
  const refreshDashboardData = (): void => {
    refetchWallet();
    refetchNotifications();
    refetchInstallments();
  };

  // Handle notification read
const handleMarkNotificationAsRead = async (notificationId: string): Promise<void> => {
  try {
    const result = await markNotificationAsRead(notificationId).unwrap();
    
    if (result) {
      dispatch(addNotification({
        id: Date.now().toString(),
        type: 'success',
        message: 'Notification marked as read successfully',
        duration: 2000
      }));
      
      // Refetch notifications to update the UI
      refetchNotifications();
    }
  } catch (error: unknown) {
    console.error('Error marking notification as read:', error);
    
    let errorMessage = 'Failed to mark notification as read';
    if (error instanceof Error) {
      errorMessage = error.message;
    }

    dispatch(addNotification({
      id: Date.now().toString(),
      type: 'error',
      message: errorMessage,
      duration: 3000
    }));
  }
};

  const formatCurrency = (amount: number): string => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(amount);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50 particle-bg morphing-bg py-8">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 animate-in fade-in-0 slide-in-from-bottom-4 duration-600">
        {/* Header */}
        <div className="mb-8 animate-in fade-in-0 slide-in-from-bottom-4 duration-600 delay-100">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl bounce-in text-gradient">
                Welcome back, {user?.firstName ? `${user.firstName} ${user.lastName || ''}` : 'User'}! 
                <Sparkles className="inline-block ml-2 w-8 h-8 text-yellow-500 neon-glow" />
              </h1>
              <p className="text-muted-foreground mt-2 slide-in-left">
                Here's an overview of your loan applications and account activity
              </p>
            </div>
            <div className="hidden md:flex items-center space-x-2">
              <Button 
                variant="outline" 
                size="sm" 
                className="magnetic-hover"
                onClick={refreshDashboardData}
                disabled={loading}
              >
                <RefreshCw className={`h-4 w-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
                Refresh
              </Button>
              <Button variant="outline" size="sm" className="magnetic-hover">
                <Settings className="h-4 w-4 mr-2" />
                Settings
              </Button>
              <Button variant="outline" size="sm" className="magnetic-hover">
                <Download className="h-4 w-4 mr-2" />
                Export
              </Button>
            </div>
          </div>
        </div>

        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6 mb-8 animate-in fade-in-0 slide-in-from-bottom-4 duration-600 delay-200 stagger-animation">
          <div className="hover:scale-105 transition-transform duration-200 floating-card glass-card magnetic-hover hover-lift" style={{ '--stagger-delay': 1 } as React.CSSProperties}>
            <Card className="border-0 shadow-lg bg-gradient-to-br from-indigo-50 to-indigo-100 dark:from-indigo-950 dark:to-indigo-900 glow-pulse">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Wallet Balance</CardTitle>
                <div className="p-2 bg-indigo-500/20 rounded-full zoom-in">
                  <Wallet className="h-4 w-4 text-indigo-600" />
                </div>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-indigo-700 dark:text-indigo-300 neon-glow">
                  {wallet ? formatCurrency(wallet.balance) : '$0.00'}
                </div>
                <p className="text-xs text-indigo-600 dark:text-indigo-400 flex items-center mt-1">
                  <TrendingUp className="h-3 w-3 mr-1" />
                  Available balance
                </p>
              </CardContent>
            </Card>
          </div>
          <div className="hover:scale-105 transition-transform duration-200 floating-card glass-card magnetic-hover hover-lift" style={{ '--stagger-delay': 2 } as React.CSSProperties}>
            <Card className="border-0 shadow-lg bg-gradient-to-br from-green-50 to-green-100 dark:from-green-950 dark:to-green-900 glow-pulse">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Approved</CardTitle>
                <div className="p-2 bg-green-500/20 rounded-full zoom-in">
                  <DollarSign className="h-4 w-4 text-green-600" />
                </div>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-green-700 dark:text-green-300 neon-glow">
                  ${animatedValues.totalAmount.toLocaleString()}
                </div>
                <p className="text-xs text-green-600 dark:text-green-400 flex items-center mt-1">
                  <TrendingUp className="h-3 w-3 mr-1" />
                  Approved loan amount
                </p>
              </CardContent>
            </Card>
          </div>

          <div className="hover:scale-105 transition-transform duration-200 floating-card glass-card magnetic-hover hover-lift" style={{ '--stagger-delay': 3 } as React.CSSProperties}>
            <Card className="border-0 shadow-lg bg-gradient-to-br from-yellow-50 to-yellow-100 dark:from-yellow-950 dark:to-yellow-900 glow-pulse">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Pending Review</CardTitle>
                <div className="p-2 bg-yellow-500/20 rounded-full zoom-in">
                  <Clock className="h-4 w-4 text-yellow-600" />
                </div>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-yellow-700 dark:text-yellow-300 neon-glow">
                  {animatedValues.pendingCount}
                </div>
                <p className="text-xs text-yellow-600 dark:text-yellow-400 flex items-center mt-1">
                  <Activity className="h-3 w-3 mr-1" />
                  Awaiting review
                </p>
              </CardContent>
            </Card>
          </div>

          <div className="hover:scale-105 transition-transform duration-200 floating-card glass-card magnetic-hover hover-lift" style={{ '--stagger-delay': 4 } as React.CSSProperties}>
            <Card className="border-0 shadow-lg bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-950 dark:to-blue-900 glow-pulse">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Applications</CardTitle>
                <div className="p-2 bg-blue-500/20 rounded-full zoom-in">
                  <FileText className="h-4 w-4 text-blue-600" />
                </div>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-blue-700 dark:text-blue-300 neon-glow">
                  {animatedValues.totalCount}
                </div>
                <p className="text-xs text-blue-600 dark:text-blue-400 flex items-center mt-1">
                  <BarChart3 className="h-3 w-3 mr-1" />
                  All time applications
                </p>
              </CardContent>
            </Card>
          </div>

          <div className="hover:scale-105 transition-transform duration-200 floating-card glass-card magnetic-hover hover-lift" style={{ '--stagger-delay': 5 } as React.CSSProperties}>
            <Card className="border-0 shadow-lg bg-gradient-to-br from-purple-50 to-purple-100 dark:from-purple-950 dark:to-purple-900 glow-pulse">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Success Rate</CardTitle>
                <div className="p-2 bg-purple-500/20 rounded-full zoom-in">
                  <Target className="h-4 w-4 text-purple-600" />
                </div>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-purple-700 dark:text-purple-300 neon-glow">
                  {displayApplications.length > 0 ? Math.round((approvedApplications / displayApplications.length) * 100) : 0}%
                </div>
                <p className="text-xs text-purple-600 dark:text-purple-400 flex items-center mt-1">
                  <PieChart className="h-3 w-3 mr-1" />
                  Approval rate
                </p>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Application Status Overview */}
        {displayApplications.length > 0 && (
          <div className="mb-8 animate-in fade-in-0 slide-in-from-bottom-4 duration-600 delay-300">
            <Card className="border-0 shadow-lg">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <BarChart3 className="h-5 w-5 text-primary" />
                  <span>Application Status Overview</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div>
                    <div className="flex justify-between text-sm mb-2">
                      <span className="flex items-center">
                        <CheckCircle className="h-4 w-4 text-green-600 mr-2" />
                        Approved ({approvedApplications})
                      </span>
                      <span>{displayApplications.length > 0 ? Math.round((approvedApplications / displayApplications.length) * 100) : 0}%</span>
                    </div>
                    <Progress value={displayApplications.length > 0 ? (approvedApplications / displayApplications.length) * 100 : 0} className="h-2" />
                  </div>
                  <div>
                    <div className="flex justify-between text-sm mb-2">
                      <span className="flex items-center">
                        <Clock className="h-4 w-4 text-yellow-600 mr-2" />
                        Pending ({pendingApplications})
                      </span>
                      <span>{displayApplications.length > 0 ? Math.round((pendingApplications / displayApplications.length) * 100) : 0}%</span>
                    </div>
                    <Progress value={displayApplications.length > 0 ? (pendingApplications / displayApplications.length) * 100 : 0} className="h-2" />
                  </div>
                  <div>
                    <div className="flex justify-between text-sm mb-2">
                      <span className="flex items-center">
                        <XCircle className="h-4 w-4 text-red-600 mr-2" />
                        Rejected ({rejectedApplications})
                      </span>
                      <span>{displayApplications.length > 0 ? Math.round((rejectedApplications / displayApplications.length) * 100) : 0}%</span>
                    </div>
                    <Progress value={displayApplications.length > 0 ? (rejectedApplications / displayApplications.length) * 100 : 0} className="h-2" />
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Quick Actions */}
        <div className="mb-8 animate-in fade-in-0 slide-in-from-bottom-4 duration-600 delay-400">
          <Card className="border-0 shadow-lg">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Wallet className="h-5 w-5 text-primary" />
                <span>Quick Actions</span>
              </CardTitle>
              <CardDescription>
                Common tasks and actions you can perform
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                <div className="hover:scale-105 transition-transform duration-200">
                  <Button asChild className="w-full h-auto p-4 flex-col space-y-2">
                    <Link to="/apply">
                      <Plus className="h-6 w-6" />
                      <span>New Application</span>
                    </Link>
                  </Button>
                </div>
                <div className="hover:scale-105 transition-transform duration-200">
                  <Button variant="outline" className="w-full h-auto p-4 flex-col space-y-2">
                    <CreditCard className="h-6 w-6" />
                    <span>Payment History</span>
                  </Button>
                </div>
                <div className="hover:scale-105 transition-transform duration-200">
                  <Button variant="outline" className="w-full h-auto p-4 flex-col space-y-2">
                    <User className="h-6 w-6" />
                    <span>Profile Settings</span>
                  </Button>
                </div>
                <div className="hover:scale-105 transition-transform duration-200">
                  <Button variant="outline" className="w-full h-auto p-4 flex-col space-y-2">
                    <Download className="h-6 w-6" />
                    <span>Download Reports</span>
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Notifications */}
        {notifications.length > 0 && (
          <div className="mb-8 animate-in fade-in-0 slide-in-from-bottom-4 duration-600 delay-450">
            <Card className="border-0 shadow-lg">
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <Bell className="h-5 w-5 text-primary" />
                    <span>Recent Notifications</span>
                    {unreadCount > 0 && (
                      <span className="bg-red-500 text-white text-xs px-2 py-1 rounded-full">
                        {unreadCount}
                      </span>
                    )}
                  </div>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      notifications.filter(n => !n.isRead).forEach(n => handleMarkNotificationAsRead(n._id));
                    }}
                    disabled={unreadCount === 0}
                  >
                    Mark All Read
                  </Button>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {notifications.map((notification, index) => (
                    <div
                      key={notification._id}
                      className={`p-4 rounded-lg border transition-all duration-200 hover:shadow-md cursor-pointer ${
                        notification.isRead 
                          ? 'bg-gray-50 dark:bg-gray-800 border-gray-200 dark:border-gray-700' 
                          : 'bg-blue-50 dark:bg-blue-950 border-blue-200 dark:border-blue-800'
                      }`}
                      onClick={() => !notification.isRead && handleMarkNotificationAsRead(notification._id)}
                      style={{ animationDelay: `${index * 100}ms` }}
                    >
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <h4 className="font-medium text-sm">{notification.title}</h4>
                          <p className="text-sm text-muted-foreground mt-1">{notification.message}</p>
                          <p className="text-xs text-muted-foreground mt-2">
                            {format(new Date(notification.createdAt), 'MMM dd, yyyy HH:mm')}
                          </p>
                        </div>
                        {!notification.isRead && (
                          <div className="w-2 h-2 bg-blue-500 rounded-full ml-2 mt-1"></div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Loan Installments */}
        {installments.length > 0 && (
          <div className="mb-8 animate-in fade-in-0 slide-in-from-bottom-4 duration-600 delay-475">
            <Card className="border-0 shadow-lg">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <CreditCard className="h-5 w-5 text-primary" />
                  <span>Upcoming Payments</span>
                </CardTitle>
                <CardDescription>
                  Your next loan installments
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {installments.map((installment, index) => (
                    <div
                      key={installment._id}
                      className={`p-4 rounded-lg border transition-all duration-200 hover:shadow-md ${
                        installment.status === 'paid' 
                          ? 'bg-green-50 dark:bg-green-950 border-green-200 dark:border-green-800' 
                          : installment.status === 'overdue'
                          ? 'bg-red-50 dark:bg-red-950 border-red-200 dark:border-red-800'
                          : 'bg-yellow-50 dark:bg-yellow-950 border-yellow-200 dark:border-yellow-800'
                      }`}
                      style={{ animationDelay: `${index * 100}ms` }}
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex-1">
                          <div className="flex items-center space-x-2">
                            <h4 className="font-medium text-sm">
                              Installment #{installment._id.slice(-4)}
                            </h4>
                            <span className={`text-xs px-2 py-1 rounded-full ${
                              installment.status === 'paid' 
                                ? 'bg-green-100 text-green-800 dark:bg-green-800 dark:text-green-100' 
                                : installment.status === 'overdue'
                                ? 'bg-red-100 text-red-800 dark:bg-red-800 dark:text-red-100'
                                : 'bg-yellow-100 text-yellow-800 dark:bg-yellow-800 dark:text-yellow-100'
                            }`}>
                              {installment.status}
                            </span>
                          </div>
                          <p className="text-sm text-muted-foreground mt-1">
                            Due: {format(new Date(installment.dueDate), 'MMM dd, yyyy')}
                          </p>
                          {installment.paidAt && (
                            <p className="text-sm text-green-600 mt-1">
                              Paid: {format(new Date(installment.paidAt), 'MMM dd, yyyy')}
                            </p>
                          )}
                        </div>
                        <div className="text-right">
                          <p className="font-semibold">{formatCurrency(installment.amount)}</p>
                          {installment.status === 'pending' && (
                            <Button 
                              size="sm" 
                              className="mt-2"
                              onClick={() => {
                                setSelectedInstallment(installment);
                                setPaymentDialogOpen(true);
                              }}
                            >
                              Pay Now
                            </Button>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Loan Applications */}
        <div className="animate-in fade-in-0 slide-in-from-bottom-4 duration-600 delay-500">
          <Card className="border-0 shadow-lg">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <FileText className="h-5 w-5 text-primary" />
                <span>Your Loan Applications</span>
              </CardTitle>
              <CardDescription>
                Track the status and details of your loan applications
              </CardDescription>
            </CardHeader>
            <CardContent>
              {displayApplications.length === 0 ? (
                <div className="text-center py-12 animate-in fade-in-0 scale-in-95 duration-500">
                  <div className="w-24 h-24 mx-auto mb-6 bg-muted rounded-full flex items-center justify-center">
                    <FileText className="h-12 w-12 text-muted-foreground" />
                  </div>
                  <h3 className="text-xl font-semibold text-foreground mb-2">
                    No loan applications yet
                  </h3>
                  <p className="text-muted-foreground mb-6 max-w-md mx-auto">
                    Start your financial journey by submitting your first loan application. 
                    Our process is quick, secure, and designed to get you the funding you need.
                  </p>
                  <div className="hover:scale-105 transition-transform duration-200">
                    <Button asChild size="lg">
                      <Link to="/apply">
                        <Plus className="mr-2 h-5 w-5" />
                        Apply for Your First Loan
                      </Link>
                    </Button>
                  </div>
                </div>
              ) : (
                <Tabs defaultValue="all" className="w-full">
                  <TabsList className="grid w-full grid-cols-4">
                    <TabsTrigger value="all">All ({displayApplications.length})</TabsTrigger>
                    <TabsTrigger value="pending">Pending ({pendingApplications})</TabsTrigger>
                    <TabsTrigger value="approved">Approved ({approvedApplications})</TabsTrigger>
                    <TabsTrigger value="rejected">Rejected ({rejectedApplications})</TabsTrigger>
                  </TabsList>
                  
                  <TabsContent value="all" className="space-y-4 mt-6">
                    {displayApplications.map((application, index) => (
                      <div
                        key={application.id}
                        className="animate-in fade-in-0 slide-in-from-left-4 duration-600 hover:scale-[1.01] transition-transform"
                        style={{ animationDelay: `${index * 100}ms` }}
                      >
                        <Card className="border-l-4 border-l-primary hover:shadow-lg transition-shadow">
                          <CardContent className="pt-6">
                            <div className="flex items-center justify-between mb-4">
                              <div className="flex items-center space-x-3">
                                <div className="p-2 bg-primary/10 rounded-full">
                                  {getStatusIcon(application.status)}
                                </div>
                                <div>
                                  <h3 className="font-semibold text-lg">
                                    {application.loanType?.charAt(0).toUpperCase() + application.loanType?.slice(1)} Loan
                                  </h3>
                                  <p className="text-sm text-muted-foreground">
                                    Application #{application._id?.slice(-8)}
                                  </p>
                                </div>
                                <Badge variant={getStatusVariant(application.status)} className="ml-2">
                                  {application.status.charAt(0).toUpperCase() + application.status.slice(1)}
                                </Badge>
                              </div>
                              <div className="text-right">
                                <p className="text-2xl font-bold text-primary">
                                  ${application.amount.toLocaleString()}
                                </p>
                                <p className="text-sm text-muted-foreground">
                                  {application.term} months
                                </p>
                              </div>
                            </div>
                            
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                              <div>
                                <p className="text-sm font-medium text-muted-foreground mb-1">Purpose</p>
                                <p className="text-sm">{application.purpose}</p>
                              </div>
                              <div>
                                <p className="text-sm font-medium text-muted-foreground mb-1">
                                  Submitted Date
                                </p>
                                <p className="text-sm flex items-center">
                                  <Calendar className="mr-1 h-3 w-3" />
                                  {application.createdAt ? format(new Date(application.createdAt), 'MMM dd, yyyy') : 'Unknown date'}
                                </p>
                              </div>
                              <div>
                                <p className="text-sm font-medium text-muted-foreground mb-1">
                                  Monthly Payment
                                </p>
                                <p className="text-sm font-semibold">
                                  ${Math.round(application.amount / application.term).toLocaleString()}
                                </p>
                              </div>
                            </div>

                            {application.status === 'pending' && (
                              <Alert className="bg-yellow-50 border-yellow-200 dark:bg-yellow-950 dark:border-yellow-800">
                                <AlertCircle className="h-4 w-4 text-yellow-600" />
                                <AlertDescription className="text-yellow-800 dark:text-yellow-200">
                                  Your application is being reviewed by our team. You will receive a response within 24 hours.
                                </AlertDescription>
                              </Alert>
                            )}

                            {application.status === 'approved' && (
                              <Alert className="bg-green-50 border-green-200 dark:bg-green-950 dark:border-green-800">
                                <CheckCircle className="h-4 w-4 text-green-600" />
                                <AlertDescription className="text-green-800 dark:text-green-200">
                                  Congratulations! Your loan has been approved. You will receive further instructions shortly.
                                </AlertDescription>
                              </Alert>
                            )}

                            {application.status === 'rejected' && (
                              <Alert className="bg-red-50 border-red-200 dark:bg-red-950 dark:border-red-800">
                                <XCircle className="h-4 w-4 text-red-600" />
                                <AlertDescription className="text-red-800 dark:text-red-200">
                                  Unfortunately, your application was not approved at this time. You may reapply in 30 days.
                                </AlertDescription>
                              </Alert>
                            )}

                            <div className="flex justify-end space-x-2 mt-4">
                              <Button variant="outline" size="sm">
                                <Eye className="h-4 w-4 mr-2" />
                                View Details
                              </Button>
                              <Button variant="outline" size="sm">
                                <Download className="h-4 w-4 mr-2" />
                                Download
                              </Button>
                            </div>
                          </CardContent>
                        </Card>
                      </div>
                    ))}
                  </TabsContent>

                  <TabsContent value="pending" className="space-y-4 mt-6">
                    {displayApplications.filter(app => app.status === 'pending').map((application, index) => (
                      <div
                        key={application.id}
                        className="animate-in fade-in-0 slide-in-from-left-4 duration-600"
                        style={{ animationDelay: `${index * 100}ms` }}
                      >
                        <Card className="border-l-4 border-l-yellow-500">
                          <CardContent className="pt-6">
                            <div className="flex items-center justify-between mb-4">
                              <div className="flex items-center space-x-3">
                                <Clock className="h-5 w-5 text-yellow-600" />
                                <div>
                                  <h3 className="font-semibold">
                                    {application.loanType?.charAt(0).toUpperCase() + application.loanType?.slice(1)} Loan
                                  </h3>
                                  <p className="text-sm text-muted-foreground">
                                    Application #{application._id?.slice(-8)}
                                  </p>
                                </div>
                              </div>
                              <div className="text-right">
                                <p className="text-xl font-bold text-primary">
                                  ${application.amount.toLocaleString()}
                                </p>
                                <p className="text-sm text-muted-foreground">
                                  {application.term} months
                                </p>
                              </div>
                            </div>
                            <Alert className="bg-yellow-50 border-yellow-200">
                              <AlertCircle className="h-4 w-4 text-yellow-600" />
                              <AlertDescription className="text-yellow-800">
                                Your application is being reviewed. Expected response within 24 hours.
                              </AlertDescription>
                            </Alert>
                          </CardContent>
                        </Card>
                      </div>
                    ))}
                  </TabsContent>

                  <TabsContent value="approved" className="space-y-4 mt-6">
                    {displayApplications.filter(app => app.status === 'approved').map((application, index) => (
                      <div
                        key={application.id}
                        className="animate-in fade-in-0 slide-in-from-left-4 duration-600"
                        style={{ animationDelay: `${index * 100}ms` }}
                      >
                        <Card className="border-l-4 border-l-green-500">
                          <CardContent className="pt-6">
                            <div className="flex items-center justify-between mb-4">
                              <div className="flex items-center space-x-3">
                                <CheckCircle className="h-5 w-5 text-green-600" />
                                <div>
                                  <h3 className="font-semibold">
                                    {application.loanType?.charAt(0).toUpperCase() + application.loanType?.slice(1)} Loan
                                  </h3>
                                  <p className="text-sm text-muted-foreground">
                                    Application #{application._id?.slice(-8)}
                                  </p>
                                </div>
                              </div>
                              <div className="text-right">
                                <p className="text-xl font-bold text-green-600">
                                  ${application.amount.toLocaleString()}
                                </p>
                                <p className="text-sm text-muted-foreground">
                                  {application.term} months
                                </p>
                              </div>
                            </div>
                            <Alert className="bg-green-50 border-green-200">
                              <CheckCircle className="h-4 w-4 text-green-600" />
                              <AlertDescription className="text-green-800">
                                Congratulations! Your loan has been approved.
                              </AlertDescription>
                            </Alert>
                          </CardContent>
                        </Card>
                      </div>
                    ))}
                  </TabsContent>

                  <TabsContent value="rejected" className="space-y-4 mt-6">
                    {displayApplications.filter(app => app.status === 'rejected').map((application, index) => (
                      <div
                        key={application.id}
                        className="animate-in fade-in-0 slide-in-from-left-4 duration-600"
                        style={{ animationDelay: `${index * 100}ms` }}
                      >
                        <Card className="border-l-4 border-l-red-500">
                          <CardContent className="pt-6">
                            <div className="flex items-center justify-between mb-4">
                              <div className="flex items-center space-x-3">
                                <XCircle className="h-5 w-5 text-red-600" />
                                <div>
                                  <h3 className="font-semibold">
                                    {application.loanType?.charAt(0).toUpperCase() + application.loanType?.slice(1)} Loan
                                  </h3>
                                  <p className="text-sm text-muted-foreground">
                                    Application #{application._id?.slice(-8)}
                                  </p>
                                </div>
                              </div>
                              <div className="text-right">
                                <p className="text-xl font-bold text-red-600">
                                  ${application.amount.toLocaleString()}
                                </p>
                                <p className="text-sm text-muted-foreground">
                                  {application.term} months
                                </p>
                              </div>
                            </div>
                            <Alert className="bg-red-50 border-red-200">
                              <XCircle className="h-4 w-4 text-red-600" />
                              <AlertDescription className="text-red-800">
                                Application was not approved. You may reapply in 30 days.
                              </AlertDescription>
                            </Alert>
                          </CardContent>
                        </Card>
                      </div>
                    ))}
                  </TabsContent>
                </Tabs>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Payment Dialog */}
         <PaymentDialog
           isOpen={paymentDialogOpen}
           onClose={() => setPaymentDialogOpen(false)}
           installment={selectedInstallment ? { ...selectedInstallment, installmentNumber: 1 } : null}
           onPaymentSuccess={async () => {
             refreshDashboardData();
             toast.success('Payment processed successfully!');
           }}
         />
      </div>
      <Footer />
    </div>
  );
};

export default Dashboard;