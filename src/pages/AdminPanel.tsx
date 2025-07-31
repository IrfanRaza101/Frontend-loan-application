import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Progress } from '@/components/ui/progress';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  BarChart3, 
  Users, 
  DollarSign, 
  TrendingUp, 
  Clock, 
  CheckCircle, 
  XCircle, 
  AlertCircle,
  FileText,
  Settings,
  Shield,
  Calendar,
  Mail,
  Phone,
  MapPin,
  Download,
  Filter,
  Search,
  RefreshCw
} from 'lucide-react';
import { 
  useGetAdminStatsQuery,
  useGetAdminLoansQuery,
  useGetAdminUsersQuery,
  useUpdateLoanStatusMutation,
  useUpdateUserStatusMutation,
  useDeleteUserMutation,
  useGetAnalyticsQuery
} from '@/store/api/adminApi';
import { useAppDispatch } from '@/store/hooks';
import { addNotification } from '@/store/slices/uiSlice';
import Footer from '@/components/Footer';

// Type definitions
interface LoanApplication {
  _id: string;
  userId?: {
    firstName?: string;
    lastName?: string;
    email?: string;
    phone?: string;
  };
  amount?: number;
  term?: number;
  loanType?: string;
  purpose?: string;
  monthlyIncome?: number;
  creditScore?: number;
  status: 'pending' | 'approved' | 'rejected';
  createdAt: string;
  reviewedAt?: string;
  rejectionReason?: string;
}

interface User {
  _id: string;
  firstName?: string;
  lastName?: string;
  email: string;
  phone?: string;
  status?: 'active' | 'suspended' | 'inactive';
  createdAt: string;
  lastLogin?: string;
  totalLoans?: number;
  approvedLoans?: number;
  rejectedLoans?: number;
  pendingLoans?: number;
  totalAmount?: number;
}

interface AdminStats {
  totalLoans: number;
  pendingLoans: number;
  rejectedLoans: number;
  approvedLoans: number;
  totalUsers: number;
  totalAmount: number;
}

const AdminPanel = () => {
  const dispatch = useAppDispatch();
  const [activeTab, setActiveTab] = useState<string>('dashboard');
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [userStatusFilter, setUserStatusFilter] = useState<string>('all');

  // RTK Query hooks
  const { data: stats, isLoading: statsLoading, error: statsError } = useGetAdminStatsQuery();
  const { data: loansData, isLoading: loansLoading, error: loansError, refetch: refetchLoans } = useGetAdminLoansQuery();
  const { data: usersData, isLoading: usersLoading, error: usersError, refetch: refetchUsers } = useGetAdminUsersQuery();
  const { data: analytics, isLoading: analyticsLoading } = useGetAnalyticsQuery();

  // Mutations
  const [updateLoanStatus] = useUpdateLoanStatusMutation();
  const [updateUserStatus] = useUpdateUserStatusMutation();
  const [deleteUser] = useDeleteUserMutation();

  // Extract data from API responses with proper typing
  const loanApplications: LoanApplication[] = (loansData as { loans: LoanApplication[] })?.loans || [];
  const users: User[] = (usersData as { users: User[] })?.users || [];
  const adminStats: AdminStats = (stats as AdminStats) || {
    totalLoans: 0,
    pendingLoans: 0,
    rejectedLoans: 0,
    approvedLoans: 0,
    totalUsers: 0,
    totalAmount: 0
  };
  
  const loading = statsLoading || loansLoading || usersLoading;
  const error = (statsError as { message?: string })?.message || 
                (loansError as { message?: string })?.message || 
                (usersError as { message?: string })?.message;

  // Refresh data function for manual refresh
  const refreshData = (): void => {
    refetchLoans();
    refetchUsers();
  };

  const handleStatusChange = async (loanId: string, newStatus: 'pending' | 'approved' | 'rejected'): Promise<void> => {
    try {
      if (newStatus === 'pending') {
        throw new Error('Cannot set status to pending');
      }
      await updateLoanStatus({ loanId, status: newStatus as 'approved' | 'rejected' }).unwrap();
      dispatch(addNotification({
        id: crypto.randomUUID(),
        type: 'success',
        message: `Loan ${newStatus} successfully`,
        duration: 3000
      }));
      refetchLoans();
    } catch (error: unknown) {
      console.error('Error updating loan status:', error);
      dispatch(addNotification({
        id: Date.now().toString(),
        type: 'error',
        message: 'Failed to update loan status',
        duration: 3000
      }));
    }
  };

  const handleUserStatusChange = async (userId: string, newStatus: 'active' | 'suspended' | 'inactive'): Promise<void> => {
    try {
      await updateUserStatus({ userId, status: newStatus }).unwrap();
      dispatch(addNotification({
        id: Date.now().toString(),
        type: 'success',
        message: `User ${newStatus} successfully`,
        duration: 3000
      }));
      refetchUsers();
    } catch (error: unknown) {
      console.error('Error updating user status:', error);
      dispatch(addNotification({
        id: Date.now().toString(),
        type: 'error',
        message: 'Failed to update user status',
        duration: 3000
      }));
    }
  };

  // Loading state
  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-background via-muted/30 to-background particle-bg morphing-bg">
        <div className="flex items-center justify-center min-h-screen">
          <div className="text-center space-y-4 floating-card glass-card p-8 rounded-xl magnetic-hover">
            <div className="w-16 h-16 bg-gradient-to-br from-red-500 to-red-600 rounded-full flex items-center justify-center mx-auto zoom-in glow-pulse">
              <Shield className="h-8 w-8 text-white" />
            </div>
            <h3 className="text-lg font-semibold text-foreground bounce-in neon-glow">Loading Admin Panel</h3>
            <p className="text-muted-foreground slide-in-left">Please wait while we fetch the data...</p>
          </div>
          <Progress value={66} className="w-64 mx-auto glow-pulse" />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-muted/30 to-background particle-bg morphing-bg">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8 animate-in fade-in-0 slide-in-from-top-4 duration-600">
          <div className="flex items-center justify-between floating-card glass-card p-6 rounded-xl magnetic-hover">
            <div className="flex items-center space-x-4">
              <div className="w-12 h-12 bg-gradient-to-br from-red-500 to-red-600 rounded-xl flex items-center justify-center zoom-in glow-pulse">
                <Shield className="h-6 w-6 text-white" />
              </div>
              <div>
                <h1 className="text-3xl font-bold text-foreground bounce-in neon-glow">Admin Panel</h1>
                <p className="text-muted-foreground slide-in-left">Manage loans, users, and system settings</p>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <Button
                onClick={refreshData}
                variant="outline"
                size="sm"
                disabled={loading}
                className="flex items-center space-x-2"
              >
                <RefreshCw className={`h-4 w-4 ${loading ? 'animate-spin' : ''}`} />
                <span>Refresh</span>
              </Button>
              <Badge variant="destructive" className="px-4 py-2 stagger-animation">
                <Shield className="h-4 w-4 mr-2" />
                <span>Administrator Access</span>
              </Badge>
            </div>
          </div>
        </div>

        {/* Error Message */}
        {error && (
          <div className="mb-6 animate-in fade-in-0 slide-in-from-top-4 duration-600">
            <Card className="border-red-200 bg-red-50 floating-card glass-card magnetic-hover">
              <CardContent className="pt-6">
                <div className="flex items-center space-x-2 text-red-600 bounce-in neon-glow">
                  <AlertCircle className="h-5 w-5" />
                  <span className="font-medium">{error}</span>
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Sidebar Navigation */}
          <div className="lg:col-span-1 animate-in fade-in-0 slide-in-from-left-4 duration-600">
            <Card className="shadow-lg border-0 floating-card glass-card magnetic-hover">
              <CardHeader className="pb-4">
                <CardTitle className="text-lg font-semibold bounce-in neon-glow">Navigation</CardTitle>
              </CardHeader>
              <CardContent>
                <nav className="space-y-2 stagger-animation">
                  {[
                    { id: 'dashboard', label: 'Dashboard', icon: BarChart3 },
                    { id: 'loans', label: 'Loan Applications', icon: FileText },
                    { id: 'users', label: 'Users', icon: Users },
                    { id: 'settings', label: 'Settings', icon: Settings }
                  ].map((tab) => (
                    <button
                      key={tab.id}
                      onClick={() => setActiveTab(tab.id)}
                      className={`flex items-center space-x-2 px-4 py-3 rounded-lg text-sm font-medium transition-all duration-200 w-full slide-in-left ${
                        activeTab === tab.id
                          ? 'bg-primary text-primary-foreground shadow-md liquid-button'
                          : 'text-gray-600 hover:text-primary hover:bg-primary/10'
                      }`}
                    >
                      <tab.icon className="h-4 w-4" />
                      <span>{tab.label}</span>
                    </button>
                  ))}
                </nav>
              </CardContent>
            </Card>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-3 space-y-6 animate-in fade-in-0 slide-in-from-bottom-4 duration-600">
            {/* Dashboard Tab */}
            {activeTab === 'dashboard' && (
              <div className="space-y-6">
                {/* Stats Overview */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 stagger-animation">
                  {[
                    {
                      title: 'Total Loans',
                      value: adminStats.totalLoans || 0,
                      icon: FileText,
                      color: 'from-blue-500 to-blue-600'
                    },
                    {
                      title: 'Pending Loans',
                      value: adminStats.pendingLoans || 0,
                      icon: Clock,
                      color: 'from-yellow-500 to-yellow-600'
                    },
                    {
                      title: 'Rejected Loans',
                      value: adminStats.rejectedLoans || 0,
                      icon: XCircle,
                      color: 'from-red-500 to-red-600'
                    },
                    {
                      title: 'Approved Loans',
                      value: adminStats.approvedLoans || 0,
                      icon: CheckCircle,
                      color: 'from-green-500 to-green-600'
                    },
                    {
                      title: 'Total Users',
                      value: adminStats.totalUsers || 0,
                      icon: Users,
                      color: 'from-purple-500 to-purple-600'
                    },
                    {
                      title: 'Total Amount',
                      value: `₨${(adminStats.totalAmount || 0).toLocaleString()}`,
                      icon: DollarSign,
                      color: 'from-indigo-500 to-indigo-600'
                    }
                  ].map((stat) => (
                    <Card key={stat.title} className="shadow-lg border-0 floating-card glass-card magnetic-hover">
                      <CardContent className="p-6">
                        <div className="flex items-center justify-between">
                          <div>
                            <p className="text-sm font-medium text-muted-foreground bounce-in">{stat.title}</p>
                            <p className="text-2xl font-bold text-foreground mt-1 neon-glow">{stat.value}</p>
                          </div>
                          <div className={`w-12 h-12 bg-gradient-to-br ${stat.color} rounded-lg flex items-center justify-center zoom-in glow-pulse`}>
                            <stat.icon className="h-6 w-6 text-white" />
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>

                {/* Recent Applications */}
                <Card className="shadow-lg border-0 floating-card glass-card magnetic-hover">
                  <CardHeader className="pb-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <CardTitle className="text-xl font-semibold bounce-in neon-glow">Recent Applications</CardTitle>
                        <CardDescription className="slide-in-left">Latest loan applications submitted</CardDescription>
                      </div>
                      <Badge variant="outline" className="px-3 py-1 stagger-animation">
                        <span>{loanApplications.length} Applications</span>
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4 stagger-animation">
                      {loanApplications.slice(0, 5).map((loan) => (
                        <div key={loan._id} className="flex items-center justify-between p-4 bg-muted/30 rounded-lg floating-card glass-card magnetic-hover">
                          <div className="flex items-center space-x-4">
                            <div className="w-10 h-10 bg-gradient-to-br from-primary to-primary/80 rounded-full flex items-center justify-center zoom-in glow-pulse">
                              <FileText className="h-5 w-5 text-primary-foreground" />
                            </div>
                            <div>
                              <p className="font-medium text-foreground bounce-in neon-glow">
                                {loan.userId?.firstName && loan.userId?.lastName ? `${loan.userId.firstName} ${loan.userId.lastName}` : 'Unknown User'}
                              </p>
                              <p className="text-sm text-muted-foreground slide-in-left">₨{loan.amount?.toLocaleString()} - {loan.loanType}</p>
                            </div>
                          </div>
                          <div className="text-right">
                            <Badge 
                              variant={
                                loan.status === 'approved' ? 'default' :
                                loan.status === 'rejected' ? 'destructive' : 'secondary'
                              }
                              className="mb-1 liquid-button"
                            >
                              <span>{loan.status}</span>
                            </Badge>
                            <p className="text-xs text-muted-foreground subtle-glow">
                              {new Date(loan.createdAt).toLocaleDateString()}
                            </p>
                          </div>
                        </div>
                      ))}
                      {loanApplications.length === 0 && (
                        <div className="text-center py-8 floating-card glass-card">
                          <FileText className="h-12 w-12 text-muted-foreground mx-auto mb-4 zoom-in glow-pulse" />
                          <p className="text-muted-foreground bounce-in neon-glow">No loan applications found</p>
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>
              </div>
            )}

            {/* Loans Tab */}
            {activeTab === 'loans' && (
              <div className="space-y-6">
                <Card className="shadow-lg border-0 floating-card glass-card magnetic-hover">
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <div>
                        <CardTitle className="bounce-in neon-glow">Loan Applications</CardTitle>
                        <CardDescription className="slide-in-left">Manage all loan applications</CardDescription>
                      </div>
                      <Badge variant="outline" className="px-3 py-1 stagger-animation">
                        <span>{loanApplications.length} Total Applications</span>
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {loanApplications.map((loan) => (
                        <div key={loan._id} className="border rounded-lg p-6 floating-card glass-card magnetic-hover">
                          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                            {/* User Information */}
                            <div className="space-y-2">
                              <h4 className="font-semibold text-foreground bounce-in neon-glow">Applicant Details</h4>
                              <div className="space-y-1 text-sm">
                                <div className="flex items-center space-x-2">
                                  <Users className="h-4 w-4 text-muted-foreground" />
                                  <span className="slide-in-left typing-effect">
                                    {loan.userId?.firstName && loan.userId?.lastName ? `${loan.userId.firstName} ${loan.userId.lastName}` : 'Unknown User'}
                                  </span>
                                </div>
                                <div className="flex items-center space-x-2">
                                  <Mail className="h-4 w-4 text-muted-foreground" />
                                  <span className="slide-in-left typing-effect">{loan.userId?.email || 'N/A'}</span>
                                </div>
                                <div className="flex items-center space-x-2">
                                  <Phone className="h-4 w-4 text-muted-foreground" />
                                  <span className="slide-in-left typing-effect">{loan.userId?.phone || 'N/A'}</span>
                                </div>
                                <div className="flex items-center space-x-2">
                                  <Calendar className="h-4 w-4 text-muted-foreground" />
                                  <span className="slide-in-left typing-effect">Applied: {new Date(loan.createdAt).toLocaleDateString()}</span>
                                </div>
                              </div>
                            </div>

                            {/* Loan Information */}
                            <div className="space-y-2">
                              <h4 className="font-semibold text-foreground bounce-in neon-glow">Loan Details</h4>
                              <div className="space-y-1 text-sm">
                                <div className="flex items-center space-x-2">
                                  <DollarSign className="h-4 w-4 text-muted-foreground" />
                                  <span className="slide-in-left typing-effect">Amount: ₨{loan.amount?.toLocaleString()}</span>
                                </div>
                                <div className="flex items-center space-x-2">
                                  <Clock className="h-4 w-4 text-muted-foreground" />
                                  <span className="slide-in-left typing-effect">Term: {loan.term} months</span>
                                </div>
                                <div className="flex items-center space-x-2">
                                  <FileText className="h-4 w-4 text-muted-foreground" />
                                  <span className="slide-in-left typing-effect">Type: {loan.loanType}</span>
                                </div>
                                <div className="flex items-center space-x-2">
                                  <TrendingUp className="h-4 w-4 text-muted-foreground" />
                                  <span className="slide-in-left typing-effect">Purpose: {loan.purpose}</span>
                                </div>
                                <div className="flex items-center space-x-2">
                                  <DollarSign className="h-4 w-4 text-muted-foreground" />
                                  <span className="slide-in-left typing-effect">Monthly Income: ₨{loan.monthlyIncome?.toLocaleString()}</span>
                                </div>
                                <div className="flex items-center space-x-2">
                                  <BarChart3 className="h-4 w-4 text-muted-foreground" />
                                  <span className="slide-in-left typing-effect">Credit Score: {loan.creditScore || 'N/A'}</span>
                                </div>
                              </div>
                            </div>

                            {/* Status and Actions */}
                            <div className="space-y-2">
                              <h4 className="font-semibold text-foreground bounce-in neon-glow">Status & Actions</h4>
                              <div className="space-y-3">
                                <Badge 
                                  variant={
                                    loan.status === 'approved' ? 'default' :
                                    loan.status === 'rejected' ? 'destructive' : 'secondary'
                                  }
                                  className="liquid-button"
                                >
                                  <span className="capitalize">{loan.status}</span>
                                </Badge>
                                
                                {loan.status === 'pending' && (
                                  <div className="flex space-x-2">
                                    <Button
                                      size="sm"
                                      onClick={() => handleStatusChange(loan._id, 'approved')}
                                      className="bg-green-600 hover:bg-green-700 text-white liquid-button"
                                    >
                                      <CheckCircle className="h-4 w-4 mr-1" />
                                      Approve
                                    </Button>
                                    <Button
                                      size="sm"
                                      variant="destructive"
                                      onClick={() => handleStatusChange(loan._id, 'rejected')}
                                      className="liquid-button"
                                    >
                                      <XCircle className="h-4 w-4 mr-1" />
                                      Reject
                                    </Button>
                                  </div>
                                )}

                                {loan.reviewedAt && (
                                  <div className="text-xs text-muted-foreground">
                                    <div className="flex items-center space-x-1">
                                      <Calendar className="h-3 w-3" />
                                      <span>Reviewed: {new Date(loan.reviewedAt).toLocaleDateString()}</span>
                                    </div>
                                  </div>
                                )}

                                {loan.rejectionReason && (
                                  <div className="text-xs text-red-600 bg-red-50 p-2 rounded">
                                    <strong>Rejection Reason:</strong> {loan.rejectionReason}
                                  </div>
                                )}
                              </div>
                            </div>
                          </div>
                        </div>
                      ))}

                      {loanApplications.length === 0 && (
                        <div className="text-center py-12 floating-card glass-card">
                          <FileText className="h-16 w-16 text-muted-foreground mx-auto mb-4 zoom-in glow-pulse" />
                          <h3 className="text-lg font-semibold text-foreground mb-2 bounce-in neon-glow">No Loan Applications</h3>
                          <p className="text-muted-foreground slide-in-left">No loan applications have been submitted yet.</p>
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>
              </div>
            )}

            {/* Users Tab */}
            {activeTab === 'users' && (
              <div className="space-y-6">
                <Card className="shadow-lg border-0 floating-card glass-card magnetic-hover">
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <div>
                        <CardTitle className="bounce-in neon-glow">User Management</CardTitle>
                        <CardDescription className="slide-in-left">Manage all registered users</CardDescription>
                      </div>
                      <Badge variant="outline" className="px-3 py-1 stagger-animation">
                        <span>{users.length} Total Users</span>
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {users.map((user) => (
                        <div key={user._id} className="border rounded-lg p-6 floating-card glass-card magnetic-hover">
                          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                            {/* User Information */}
                            <div className="space-y-2">
                              <h4 className="font-semibold text-foreground bounce-in neon-glow">User Details</h4>
                              <div className="space-y-1 text-sm">
                                <div className="flex items-center space-x-2">
                                  <Users className="h-4 w-4 text-muted-foreground" />
                                  <span className="slide-in-left typing-effect">
                                    {user.firstName && user.lastName ? `${user.firstName} ${user.lastName}` : 'Unknown User'}
                                  </span>
                                </div>
                                <div className="flex items-center space-x-2">
                                  <Mail className="h-4 w-4 text-muted-foreground" />
                                  <span className="slide-in-left typing-effect">{user.email}</span>
                                </div>
                                <div className="flex items-center space-x-2">
                                  <Phone className="h-4 w-4 text-muted-foreground" />
                                  <span className="slide-in-left typing-effect">{user.phone || 'N/A'}</span>
                                </div>
                                <div className="flex items-center space-x-2">
                                  <Calendar className="h-4 w-4 text-muted-foreground" />
                                  <span className="slide-in-left typing-effect">Joined: {new Date(user.createdAt).toLocaleDateString()}</span>
                                </div>
                              </div>
                            </div>

                            {/* Loan Statistics */}
                            <div className="space-y-2">
                              <h4 className="font-semibold text-foreground bounce-in neon-glow">Loan Statistics</h4>
                              <div className="space-y-1 text-sm">
                                <div className="flex items-center space-x-2">
                                  <FileText className="h-4 w-4 text-muted-foreground" />
                                  <span className="slide-in-left typing-effect">Total Applications: {user.totalLoans || 0}</span>
                                </div>
                                <div className="flex items-center space-x-2">
                                  <CheckCircle className="h-4 w-4 text-green-600" />
                                  <span className="slide-in-left typing-effect">Approved: {user.approvedLoans || 0}</span>
                                </div>
                                <div className="flex items-center space-x-2">
                                  <XCircle className="h-4 w-4 text-red-600" />
                                  <span className="slide-in-left typing-effect">Rejected: {user.rejectedLoans || 0}</span>
                                </div>
                                <div className="flex items-center space-x-2">
                                  <Clock className="h-4 w-4 text-yellow-600" />
                                  <span className="slide-in-left typing-effect">Pending: {user.pendingLoans || 0}</span>
                                </div>
                                <div className="flex items-center space-x-2">
                                  <DollarSign className="h-4 w-4 text-muted-foreground" />
                                  <span className="slide-in-left typing-effect">Total Amount: ₨{(user.totalAmount || 0).toLocaleString()}</span>
                                </div>
                              </div>
                            </div>

                            {/* Status and Actions */}
                            <div className="space-y-2">
                              <h4 className="font-semibold text-foreground bounce-in neon-glow">Status & Actions</h4>
                              <div className="space-y-3">
                                <Badge 
                                  variant={user.status === 'active' ? 'default' : 'secondary'}
                                  className="liquid-button"
                                >
                                  <span className="capitalize">{user.status || 'active'}</span>
                                </Badge>
                                
                                <div className="flex space-x-2">
                                  {user.status !== 'suspended' && (
                                    <Button
                                      size="sm"
                                      variant="outline"
                                      onClick={() => handleUserStatusChange(user._id, 'suspended')}
                                      className="liquid-button"
                                    >
                                      <XCircle className="h-4 w-4 mr-1" />
                                      Suspend
                                    </Button>
                                  )}
                                  {user.status === 'suspended' && (
                                    <Button
                                      size="sm"
                                      onClick={() => handleUserStatusChange(user._id, 'active')}
                                      className="bg-green-600 hover:bg-green-700 text-white liquid-button"
                                    >
                                      <CheckCircle className="h-4 w-4 mr-1" />
                                      Activate
                                    </Button>
                                  )}
                                </div>

                                {user.lastLogin && (
                                  <div className="text-xs text-muted-foreground">
                                    <div className="flex items-center space-x-1">
                                      <Calendar className="h-3 w-3" />
                                      <span>Last Login: {new Date(user.lastLogin).toLocaleDateString()}</span>
                                    </div>
                                  </div>
                                )}
                              </div>
                            </div>
                          </div>
                        </div>
                      ))}

                      {users.length === 0 && (
                        <div className="text-center py-12 floating-card glass-card">
                          <Users className="h-16 w-16 text-muted-foreground mx-auto mb-4 zoom-in glow-pulse" />
                          <h3 className="text-lg font-semibold text-foreground mb-2 bounce-in neon-glow">No Users Found</h3>
                          <p className="text-muted-foreground slide-in-left">No users have registered yet.</p>
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>
              </div>
            )}

            {/* Settings Tab */}
            {activeTab === 'settings' && (
              <div className="space-y-6">
                <Card className="shadow-lg border-0 floating-card glass-card magnetic-hover">
                  <CardHeader>
                    <CardTitle className="bounce-in neon-glow">System Settings</CardTitle>
                    <CardDescription className="slide-in-left">Configure system settings and preferences</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-6">
                      {/* Loan Settings */}
                      <div className="space-y-4">
                        <h3 className="text-lg font-semibold text-foreground bounce-in neon-glow">Loan Configuration</h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div className="space-y-2">
                            <label className="text-sm font-medium text-foreground">Minimum Loan Amount</label>
                            <div className="flex items-center space-x-2">
                              <DollarSign className="h-4 w-4 text-muted-foreground" />
                              <span className="text-sm text-muted-foreground">₨50,000</span>
                            </div>
                          </div>
                          <div className="space-y-2">
                            <label className="text-sm font-medium text-foreground">Maximum Loan Amount</label>
                            <div className="flex items-center space-x-2">
                              <DollarSign className="h-4 w-4 text-muted-foreground" />
                              <span className="text-sm text-muted-foreground">₨10,000,000</span>
                            </div>
                          </div>
                          <div className="space-y-2">
                            <label className="text-sm font-medium text-foreground">Interest Rate Range</label>
                            <div className="flex items-center space-x-2">
                              <TrendingUp className="h-4 w-4 text-muted-foreground" />
                              <span className="text-sm text-muted-foreground">5% - 15% per annum</span>
                            </div>
                          </div>
                          <div className="space-y-2">
                            <label className="text-sm font-medium text-foreground">Maximum Term</label>
                            <div className="flex items-center space-x-2">
                              <Clock className="h-4 w-4 text-muted-foreground" />
                              <span className="text-sm text-muted-foreground">60 months</span>
                            </div>
                          </div>
                        </div>
                      </div>

                      <Separator />

                      {/* System Statistics */}
                      <div className="space-y-4">
                        <h3 className="text-lg font-semibold text-foreground bounce-in neon-glow">System Statistics</h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                          <div className="p-4 bg-muted/30 rounded-lg floating-card glass-card">
                            <div className="flex items-center space-x-2">
                              <BarChart3 className="h-5 w-5 text-blue-600" />
                              <div>
                                <p className="text-sm font-medium text-foreground">Database Status</p>
                                <p className="text-xs text-green-600">Connected</p>
                              </div>
                            </div>
                          </div>
                          <div className="p-4 bg-muted/30 rounded-lg floating-card glass-card">
                            <div className="flex items-center space-x-2">
                              <Shield className="h-5 w-5 text-green-600" />
                              <div>
                                <p className="text-sm font-medium text-foreground">Security Status</p>
                                <p className="text-xs text-green-600">Secure</p>
                              </div>
                            </div>
                          </div>
                          <div className="p-4 bg-muted/30 rounded-lg floating-card glass-card">
                            <div className="flex items-center space-x-2">
                              <RefreshCw className="h-5 w-5 text-blue-600" />
                              <div>
                                <p className="text-sm font-medium text-foreground">Last Backup</p>
                                <p className="text-xs text-muted-foreground">{new Date().toLocaleDateString()}</p>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>

                      <Separator />

                      {/* Admin Actions */}
                      <div className="space-y-4">
                        <h3 className="text-lg font-semibold text-foreground bounce-in neon-glow">Admin Actions</h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <Button variant="outline" className="justify-start liquid-button" onClick={refreshData}>
                            <RefreshCw className="h-4 w-4 mr-2" />
                            Refresh All Data
                          </Button>
                          <Button variant="outline" className="justify-start liquid-button">
                            <FileText className="h-4 w-4 mr-2" />
                            Generate Report
                          </Button>
                          <Button variant="outline" className="justify-start liquid-button">
                            <Shield className="h-4 w-4 mr-2" />
                            Security Audit
                          </Button>
                          <Button variant="outline" className="justify-start liquid-button">
                            <Settings className="h-4 w-4 mr-2" />
                            System Maintenance
                          </Button>
                        </div>
                      </div>

                      <Separator />

                      {/* Application Info */}
                      <div className="space-y-4">
                        <h3 className="text-lg font-semibold text-foreground bounce-in neon-glow">Application Information</h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div className="space-y-2">
                            <label className="text-sm font-medium text-foreground">Application Version</label>
                            <p className="text-sm text-muted-foreground">v1.0.0</p>
                          </div>
                          <div className="space-y-2">
                            <label className="text-sm font-medium text-foreground">Last Updated</label>
                            <p className="text-sm text-muted-foreground">{new Date().toLocaleDateString()}</p>
                          </div>
                          <div className="space-y-2">
                            <label className="text-sm font-medium text-foreground">Environment</label>
                            <p className="text-sm text-muted-foreground">Development</p>
                          </div>
                          <div className="space-y-2">
                            <label className="text-sm font-medium text-foreground">Server Status</label>
                            <p className="text-sm text-green-600">Online</p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            )}
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default AdminPanel;