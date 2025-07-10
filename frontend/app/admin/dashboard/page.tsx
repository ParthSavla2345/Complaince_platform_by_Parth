'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Crown, 
  Users, 
  Building2, 
  FileText, 
  BarChart3,
  TrendingUp,
  Shield,
  Settings,
  Plus,
  Edit,
  Trash2,
  Eye
} from 'lucide-react';
import { AdminNavigation } from '@/components/admin-navigation';
import { useAuth } from '@/components/auth-provider';

export default function AdminDashboard() {
  const { user } = useAuth();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return null;
  }

  const adminData = {
    totalUsers: 1247,
    naiveUsers: 892,
    companyUsers: 355,
    totalAssessments: 3456,
    totalQuestions: 45,
    activeQuestions: 42,
    averageScore: 76,
    recentActivity: [
      { action: 'New company registered', entity: 'TechCorp Inc.', date: '2 hours ago' },
      { action: 'Question updated', entity: 'Password Management #3', date: '4 hours ago' },
      { action: 'Assessment completed', entity: 'User #1234', date: '6 hours ago' },
      { action: 'New user registered', entity: 'john.doe@email.com', date: '8 hours ago' }
    ],
    topPerformingCompanies: [
      { name: 'SecureTech Ltd', score: 94, employees: 120 },
      { name: 'CyberSafe Corp', score: 91, employees: 85 },
      { name: 'DataGuard Inc', score: 89, employees: 200 },
      { name: 'InfoShield LLC', score: 87, employees: 45 },
      { name: 'TechSecure Pro', score: 85, employees: 150 }
    ],
    questionCategories: [
      { category: 'Password Management', count: 8, avgWeight: 8.5 },
      { category: 'Authentication', count: 6, avgWeight: 9.2 },
      { category: 'Device Security', count: 7, avgWeight: 7.8 },
      { category: 'Network Security', count: 5, avgWeight: 8.0 },
      { category: 'Data Protection', count: 9, avgWeight: 8.7 },
      { category: 'Compliance', count: 7, avgWeight: 9.5 }
    ],
    systemStats: {
      uptime: '99.9%',
      responseTime: '120ms',
      errorRate: '0.01%',
      activeConnections: 234
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900">
      <AdminNavigation />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-white mb-2">
              Admin Dashboard
            </h1>
            <p className="text-gray-300">
              Manage the SecureCheck platform and monitor system performance
            </p>
          </div>
          <div className="flex space-x-3">
            <Button className="bg-gradient-security hover:opacity-90 text-white border-0">
              <Plus className="mr-2 h-4 w-4" />
              Add Question
            </Button>
            <Button variant="outline" className="border-white/30 text-white hover:bg-white/10">
              <Settings className="mr-2 h-4 w-4" />
              System Settings
            </Button>
          </div>
        </div>

        {/* Overview Cards */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <Card className="bg-white/10 backdrop-blur-md border-white/20">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-gray-300">
                  Total Users
                </CardTitle>
                <Users className="h-4 w-4 text-blue-400" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-white">
                  {adminData.totalUsers.toLocaleString()}
                </div>
                <p className="text-xs text-gray-400">
                  {adminData.naiveUsers} individual, {adminData.companyUsers} company
                </p>
              </CardContent>
            </Card>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
          >
            <Card className="bg-white/10 backdrop-blur-md border-white/20">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-gray-300">
                  Assessments
                </CardTitle>
                <FileText className="h-4 w-4 text-green-400" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-white">
                  {adminData.totalAssessments.toLocaleString()}
                </div>
                <p className="text-xs text-gray-400">
                  Total completed
                </p>
              </CardContent>
            </Card>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <Card className="bg-white/10 backdrop-blur-md border-white/20">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-gray-300">
                  Questions
                </CardTitle>
                <Shield className="h-4 w-4 text-purple-400" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-white">
                  {adminData.activeQuestions}/{adminData.totalQuestions}
                </div>
                <p className="text-xs text-gray-400">
                  Active questions
                </p>
              </CardContent>
            </Card>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
          >
            <Card className="bg-white/10 backdrop-blur-md border-white/20">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-gray-300">
                  Average Score
                </CardTitle>
                <TrendingUp className="h-4 w-4 text-yellow-400" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-white">
                  {adminData.averageScore}%
                </div>
                <p className="text-xs text-gray-400">
                  Platform average
                </p>
              </CardContent>
            </Card>
          </motion.div>
        </div>

        <Tabs defaultValue="overview" className="space-y-6">
          <TabsList className="bg-white/10 border-white/20">
            <TabsTrigger value="overview" className="data-[state=active]:bg-white/20">
              Overview
            </TabsTrigger>
            <TabsTrigger value="questions" className="data-[state=active]:bg-white/20">
              Questions
            </TabsTrigger>
            <TabsTrigger value="users" className="data-[state=active]:bg-white/20">
              Users
            </TabsTrigger>
            <TabsTrigger value="analytics" className="data-[state=active]:bg-white/20">
              Analytics
            </TabsTrigger>
          </TabsList>

          <TabsContent value="overview">
            <div className="grid lg:grid-cols-3 gap-6">
              {/* Recent Activity */}
              <div className="lg:col-span-2">
                <Card className="bg-white/10 backdrop-blur-md border-white/20">
                  <CardHeader>
                    <CardTitle className="text-white">Recent Activity</CardTitle>
                    <CardDescription className="text-gray-300">
                      Latest platform activities and changes
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {adminData.recentActivity.map((activity, index) => (
                      <div key={index} className="flex items-start space-x-3 p-3 bg-white/5 rounded-lg">
                        <div className="w-2 h-2 bg-blue-400 rounded-full mt-2 flex-shrink-0" />
                        <div className="flex-1">
                          <p className="text-white text-sm">{activity.action}</p>
                          <p className="text-gray-400 text-xs">{activity.entity}</p>
                          <p className="text-gray-500 text-xs">{activity.date}</p>
                        </div>
                      </div>
                    ))}
                  </CardContent>
                </Card>
              </div>

              {/* System Stats */}
              <div>
                <Card className="bg-white/10 backdrop-blur-md border-white/20">
                  <CardHeader>
                    <CardTitle className="text-white">System Health</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex justify-between">
                      <span className="text-gray-300">Uptime</span>
                      <Badge className="bg-green-500/20 text-green-300 border-green-500/30">
                        {adminData.systemStats.uptime}
                      </Badge>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-300">Response Time</span>
                      <span className="text-white">{adminData.systemStats.responseTime}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-300">Error Rate</span>
                      <span className="text-green-400">{adminData.systemStats.errorRate}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-300">Active Users</span>
                      <span className="text-white">{adminData.systemStats.activeConnections}</span>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="questions">
            <div className="grid lg:grid-cols-2 gap-6">
              {/* Question Categories */}
              <Card className="bg-white/10 backdrop-blur-md border-white/20">
                <CardHeader>
                  <CardTitle className="text-white">Question Categories</CardTitle>
                  <CardDescription className="text-gray-300">
                    Distribution and weighting of assessment questions
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  {adminData.questionCategories.map((cat, index) => (
                    <div key={cat.category} className="flex items-center justify-between p-3 bg-white/5 rounded-lg">
                      <div>
                        <div className="text-white font-medium">{cat.category}</div>
                        <div className="text-gray-400 text-sm">{cat.count} questions</div>
                      </div>
                      <div className="text-right">
                        <div className="text-white">Weight: {cat.avgWeight}</div>
                        <div className="flex space-x-2">
                          <Button size="sm" variant="ghost" className="text-blue-400 hover:bg-blue-400/10">
                            <Edit className="h-3 w-3" />
                          </Button>
                          <Button size="sm" variant="ghost" className="text-red-400 hover:bg-red-400/10">
                            <Trash2 className="h-3 w-3" />
                          </Button>
                        </div>
                      </div>
                    </div>
                  ))}
                </CardContent>
              </Card>

              {/* Top Companies */}
              <Card className="bg-white/10 backdrop-blur-md border-white/20">
                <CardHeader>
                  <CardTitle className="text-white">Top Performing Companies</CardTitle>
                  <CardDescription className="text-gray-300">
                    Companies with highest security scores
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  {adminData.topPerformingCompanies.map((company, index) => (
                    <div key={index} className="flex items-center justify-between p-3 bg-white/5 rounded-lg">
                      <div className="flex items-center space-x-3">
                        <div className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold ${
                          index === 0 ? 'bg-yellow-500' :
                          index === 1 ? 'bg-gray-400' :
                          index === 2 ? 'bg-orange-500' :
                          'bg-blue-500'
                        } text-white`}>
                          {index + 1}
                        </div>
                        <div>
                          <div className="text-white font-medium">{company.name}</div>
                          <div className="text-gray-400 text-sm">{company.employees} employees</div>
                        </div>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Badge className="bg-green-500/20 text-green-300 border-green-500/30">
                          {company.score}%
                        </Badge>
                        <Button size="sm" variant="ghost" className="text-blue-400 hover:bg-blue-400/10">
                          <Eye className="h-3 w-3" />
                        </Button>
                      </div>
                    </div>
                  ))}
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="users">
            <Card className="bg-white/10 backdrop-blur-md border-white/20">
              <CardHeader>
                <CardTitle className="text-white">User Management</CardTitle>
                <CardDescription className="text-gray-300">
                  Manage platform users and their access
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-center py-12">
                  <Users className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-xl font-semibold text-white mb-2">User Management</h3>
                  <p className="text-gray-300 mb-6">
                    Advanced user management features coming soon
                  </p>
                  <Button className="bg-gradient-security hover:opacity-90 text-white border-0">
                    View All Users
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="analytics">
            <Card className="bg-white/10 backdrop-blur-md border-white/20">
              <CardHeader>
                <CardTitle className="text-white">Platform Analytics</CardTitle>
                <CardDescription className="text-gray-300">
                  Detailed analytics and reporting
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-center py-12">
                  <BarChart3 className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-xl font-semibold text-white mb-2">Advanced Analytics</h3>
                  <p className="text-gray-300 mb-6">
                    Comprehensive analytics dashboard coming soon
                  </p>
                  <Button className="bg-gradient-security hover:opacity-90 text-white border-0">
                    Generate Report
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}