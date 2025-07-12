'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Building2, 
  Users, 
  Shield, 
  TrendingUp, 
  AlertTriangle,
  CheckCircle,
  FileText,
  Award,
  Target,
  BarChart3,
  Calendar,
  Download,
  Settings,
  Plus
} from 'lucide-react';
import { CompanyNavigation } from '@/components/company-navigation';
import { useAuth } from '@/components/auth-provider';
import Link from 'next/link';

export default function CompanyDashboard() {
  const { user } = useAuth();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return null;
  }

  const companyData = {
    companyName: user?.companyName || 'Example Corp',
    overallScore: 82,
    lastAssessment: '1 week ago',
    totalEmployees: 45,
    assessedEmployees: 38,
    complianceFrameworks: ['ISO 27001', 'GDPR', 'SOC 2'],
    riskLevel: 'Medium',
    categories: [
      { name: 'Password Management', score: 88, trend: 'up', employees: 42 },
      { name: 'Authentication', score: 85, trend: 'up', employees: 38 },
      { name: 'Device Security', score: 75, trend: 'down', employees: 35 },
      { name: 'Network Security', score: 80, trend: 'stable', employees: 40 },
      { name: 'Data Protection', score: 78, trend: 'up', employees: 33 },
      { name: 'Compliance', score: 90, trend: 'up', employees: 45 }
    ],
    recentActivity: [
      { action: 'Security Assessment Completed', user: 'John Smith', date: '2 hours ago', score: 85 },
      { action: 'New Employee Onboarded', user: 'Sarah Johnson', date: '1 day ago', score: null },
      { action: 'Compliance Report Generated', user: 'System', date: '3 days ago', score: null },
      { action: 'Security Training Completed', user: 'Mike Davis', date: '1 week ago', score: 92 }
    ],
    recommendations: [
      {
        priority: 'high',
        category: 'Device Security',
        title: 'Implement Mobile Device Management',
        description: 'Deploy MDM solution for better device control and security',
        impact: 'High'
      },
      {
        priority: 'medium',
        category: 'Data Protection',
        title: 'Enhance Backup Strategy',
        description: 'Implement automated encrypted backups with regular testing',
        impact: 'Medium'
      },
      {
        priority: 'low',
        category: 'Network Security',
        title: 'VPN Usage Training',
        description: 'Provide training on proper VPN usage for remote work',
        impact: 'Low'
      }
    ],
    leaderboard: [
      { name: 'Alice Cooper', department: 'IT', score: 95, rank: 1 },
      { name: 'Bob Wilson', department: 'Finance', score: 92, rank: 2 },
      { name: 'Carol Brown', department: 'HR', score: 88, rank: 3 },
      { name: 'David Lee', department: 'Marketing', score: 85, rank: 4 },
      { name: 'Emma Davis', department: 'Sales', score: 82, rank: 5 }
    ]
  };

  const getScoreColor = (score: number) => {
    if (score >= 80) return 'text-green-500';
    if (score >= 60) return 'text-yellow-500';
    return 'text-red-500';
  };

  const getScoreBg = (score: number) => {
    if (score >= 80) return 'bg-green-500/20';
    if (score >= 60) return 'bg-yellow-500/20';
    return 'bg-red-500/20';
  };

  const getTrendIcon = (trend: string) => {
    switch (trend) {
      case 'up': return <TrendingUp className="h-4 w-4 text-green-500" />;
      case 'down': return <TrendingUp className="h-4 w-4 text-red-500 rotate-180" />;
      default: return <div className="h-4 w-4 bg-gray-500 rounded-full" />;
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'bg-red-500';
      case 'medium': return 'bg-yellow-500';
      case 'low': return 'bg-green-500';
      default: return 'bg-gray-500';
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900">
      <CompanyNavigation />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-white mb-2">
              {companyData.companyName} Dashboard
            </h1>
            <p className="text-gray-300">
              Monitor your organization's security posture and compliance status
            </p>
          </div>
          <div className="flex space-x-3">
            <Button className="bg-gradient-security hover:opacity-90 text-white border-0">
              <Download className="mr-2 h-4 w-4" />
              Export Report
            </Button>
            <Link href="/company/assessment">
              <Button variant="outline" className="border-white/30 text-white hover:bg-white/10">
                <Plus className="mr-2 h-4 w-4" />
                New Assessment
              </Button>
            </Link>
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
                  Overall Score
                </CardTitle>
                <Shield className="h-4 w-4 text-blue-400" />
              </CardHeader>
              <CardContent>
                <div className={`text-2xl font-bold ${getScoreColor(companyData.overallScore)}`}>
                  {companyData.overallScore}%
                </div>
                <p className="text-xs text-gray-400">
                  Last assessment: {companyData.lastAssessment}
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
                  Employee Coverage
                </CardTitle>
                <Users className="h-4 w-4 text-green-400" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-white">
                  {companyData.assessedEmployees}/{companyData.totalEmployees}
                </div>
                <p className="text-xs text-gray-400">
                  {Math.round((companyData.assessedEmployees / companyData.totalEmployees) * 100)}% assessed
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
                  Compliance
                </CardTitle>
                <CheckCircle className="h-4 w-4 text-green-400" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-white">
                  {companyData.complianceFrameworks.length}
                </div>
                <p className="text-xs text-gray-400">
                  Active frameworks
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
                  Risk Level
                </CardTitle>
                <AlertTriangle className="h-4 w-4 text-yellow-400" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-yellow-500">
                  {companyData.riskLevel}
                </div>
                <p className="text-xs text-gray-400">
                  Current assessment
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
            <TabsTrigger value="analytics" className="data-[state=active]:bg-white/20">
              Analytics
            </TabsTrigger>
            <TabsTrigger value="compliance" className="data-[state=active]:bg-white/20">
              Compliance
            </TabsTrigger>
            <TabsTrigger value="leaderboard" className="data-[state=active]:bg-white/20">
              Leaderboard
            </TabsTrigger>
          </TabsList>

          <TabsContent value="overview">
            <div className="grid lg:grid-cols-3 gap-6">
              {/* Security Categories */}
              <div className="lg:col-span-2">
                <Card className="bg-white/10 backdrop-blur-md border-white/20">
                  <CardHeader>
                    <CardTitle className="text-white">Security Categories</CardTitle>
                    <CardDescription className="text-gray-300">
                      Performance across different security areas
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    {companyData.categories.map((category, index) => (
                      <div key={category.name} className="space-y-2">
                        <div className="flex justify-between items-center">
                          <div className="flex items-center space-x-2">
                            <span className="text-white font-medium">{category.name}</span>
                            {getTrendIcon(category.trend)}
                          </div>
                          <div className="flex items-center space-x-2">
                            <Badge className={`${getScoreBg(category.score)} ${getScoreColor(category.score)} border-0`}>
                              {category.score}%
                            </Badge>
                            <span className="text-gray-400 text-sm">{category.employees} employees</span>
                          </div>
                        </div>
                        <Progress value={category.score} className="bg-white/10" />
                      </div>
                    ))}
                  </CardContent>
                </Card>
              </div>

              {/* Recent Activity */}
              <div>
                <Card className="bg-white/10 backdrop-blur-md border-white/20">
                  <CardHeader>
                    <CardTitle className="text-white">Recent Activity</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {companyData.recentActivity.map((activity, index) => (
                      <div key={index} className="flex items-start space-x-3">
                        <div className="w-2 h-2 bg-blue-400 rounded-full mt-2 flex-shrink-0" />
                        <div className="flex-1 min-w-0">
                          <p className="text-white text-sm">{activity.action}</p>
                          <p className="text-gray-400 text-xs">{activity.user}</p>
                          <div className="flex items-center justify-between mt-1">
                            <p className="text-gray-400 text-xs">{activity.date}</p>
                            {activity.score && (
                              <Badge className={`${getScoreBg(activity.score)} ${getScoreColor(activity.score)} border-0 text-xs`}>
                                {activity.score}%
                              </Badge>
                            )}
                          </div>
                        </div>
                      </div>
                    ))}
                  </CardContent>
                </Card>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="analytics">
            <div className="grid lg:grid-cols-2 gap-6">
              {/* Recommendations */}
              <Card className="bg-white/10 backdrop-blur-md border-white/20">
                <CardHeader>
                  <CardTitle className="text-white">Security Recommendations</CardTitle>
                  <CardDescription className="text-gray-300">
                    Actionable steps to improve your security posture
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  {companyData.recommendations.map((rec, index) => (
                    <div key={index} className="p-4 bg-white/5 rounded-lg border border-white/10">
                      <div className="flex items-start justify-between mb-3">
                        <div className="flex items-center space-x-3">
                          <Badge className="bg-blue-500/20 text-blue-300 border-blue-500/30">
                            {rec.category}
                          </Badge>
                          <Badge className={`${getPriorityColor(rec.priority)} text-white border-0`}>
                            {rec.priority.toUpperCase()}
                          </Badge>
                        </div>
                        <Badge variant="outline" className="border-white/20 text-white">
                          {rec.impact} Impact
                        </Badge>
                      </div>
                      <h4 className="text-white font-semibold mb-2">{rec.title}</h4>
                      <p className="text-gray-300 text-sm">{rec.description}</p>
                    </div>
                  ))}
                </CardContent>
              </Card>

              {/* Compliance Status */}
              <Card className="bg-white/10 backdrop-blur-md border-white/20">
                <CardHeader>
                  <CardTitle className="text-white">Compliance Status</CardTitle>
                  <CardDescription className="text-gray-300">
                    Current compliance framework status
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  {companyData.complianceFrameworks.map((framework, index) => (
                    <div key={framework} className="flex items-center justify-between p-3 bg-white/5 rounded-lg">
                      <div className="flex items-center space-x-3">
                        <CheckCircle className="h-5 w-5 text-green-400" />
                        <span className="text-white font-medium">{framework}</span>
                      </div>
                      <Badge className="bg-green-500/20 text-green-300 border-green-500/30">
                        Compliant
                      </Badge>
                    </div>
                  ))}
                  <Button variant="outline" className="w-full border-white/30 text-white hover:bg-white/10">
                    <Plus className="mr-2 h-4 w-4" />
                    Add Framework
                  </Button>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="compliance">
            <Card className="bg-white/10 backdrop-blur-md border-white/20">
              <CardHeader>
                <CardTitle className="text-white">Detailed Compliance Analysis</CardTitle>
                <CardDescription className="text-gray-300">
                  Comprehensive view of compliance requirements and status
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-center py-12">
                  <FileText className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-xl font-semibold text-white mb-2">Compliance Dashboard</h3>
                  <p className="text-gray-300 mb-6">
                    Detailed compliance tracking and reporting features coming soon
                  </p>
                  <Button className="bg-gradient-security hover:opacity-90 text-white border-0">
                    Request Demo
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="leaderboard">
            <Card className="bg-white/10 backdrop-blur-md border-white/20">
              <CardHeader>
                <CardTitle className="text-white">Employee Leaderboard</CardTitle>
                <CardDescription className="text-gray-300">
                  Top performing employees in security assessments
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {companyData.leaderboard.map((employee, index) => (
                    <div key={index} className="flex items-center justify-between p-4 bg-white/5 rounded-lg">
                      <div className="flex items-center space-x-4">
                        <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold ${
                          employee.rank === 1 ? 'bg-yellow-500' :
                          employee.rank === 2 ? 'bg-gray-400' :
                          employee.rank === 3 ? 'bg-orange-500' :
                          'bg-blue-500'
                        } text-white`}>
                          {employee.rank}
                        </div>
                        <div>
                          <div className="text-white font-medium">{employee.name}</div>
                          <div className="text-gray-400 text-sm">{employee.department}</div>
                        </div>
                      </div>
                      <Badge className={`${getScoreBg(employee.score)} ${getScoreColor(employee.score)} border-0`}>
                        {employee.score}%
                      </Badge>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}