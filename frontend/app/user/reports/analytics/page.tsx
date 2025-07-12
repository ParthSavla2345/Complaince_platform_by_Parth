'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { UserNavigation } from '@/components/user-navigation';
import { useAuth } from '@/components/auth-provider';
import { toast } from 'sonner';
import { useRouter } from 'next/navigation';
import SecurityReport from '../analytics';
import { Shield, BarChart2, Lightbulb, TrendingUp } from 'lucide-react';

interface ReportData {
  userName: string;
  overallScore: number;
  previousScore: number;
  lastAssessment: string;
  totalAssessments: number;
  attempts: Array<{
    attemptNumber: number;
    overallPercentage: number;
    completedAt: string;
    userName: string;
    accuracyChange: number;
  }>;
  categoryScores: Record<string, number>;
  recommendations: Array<{
    category: string;
    issue: string;
    description: string;
    action: string;
    priority: string;
  }>;
  improvements: Array<{
    date: string;
    score: number;
    category: string;
    userName: string;
  }>;
  benchmarks: {
    industry: number;
    peers: number;
    topPerformers: number;
  };
  joinDate?: string;
  achievements?: number;
}

interface AssessmentData {
  _id: string;
  answers: Record<string, string>;
  categoryScores: Record<string, { score: number; total: number }>;
  overallScore: number;
  timestamp: string;
  userName: string;
  benchmarks?: { industry: number; peers: number; topPerformers: number };
  totalAssessments?: number;
  lastAssessment?: string;
  joinDate?: string;
  achievements?: number;
}

export default function AnalyticsPage() {
  const [mounted, setMounted] = useState(false);
  const [reportData, setReportData] = useState<ReportData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const { user } = useAuth();
  const router = useRouter();

  useEffect(() => {
    setMounted(true);
    if (user?.id) {
      fetchReport();
    } else {
      toast.error('Please log in to view your analytics');
      router.push('/login');
    }
  }, [user, router]);

  const fetchReport = async () => {
    setIsLoading(true);
    try {
      console.log('Fetching report for user:', user?.id);
      const response = await fetch(`/api/user/report?userId=${user?.id}`, {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' }
      });
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
      console.log('Report response data:', data);
      if (!data.categoryScores || !data.overallScore) {
        throw new Error('Incomplete report data: missing categoryScores or overallScore');
      }
      setReportData({
        ...data,
        overallScore: Math.min(Number(data.overallScore.toFixed(2)), 100),
        previousScore: Math.min(Number(data.previousScore.toFixed(2)), 100),
        categoryScores: Object.fromEntries(
          Object.entries(data.categoryScores || {}).map(([key, value]) => [key, Math.min(Number(value.toFixed(2)), 100)])
        ),
        attempts: data.attempts.map(attempt => ({
          ...attempt,
          overallPercentage: Math.min(Number(attempt.overallPercentage.toFixed(2)), 100)
        })),
        improvements: data.improvements.map(imp => ({
          ...imp,
          score: Math.min(Number(imp.score.toFixed(2)), 100)
        }))
      });
    } catch (error) {
      console.error('Fetch report error:', error);
      toast.error(`Error fetching report: ${error.message}`);
      setReportData(null);
    } finally {
      setIsLoading(false);
    }
  };

  if (!mounted || isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900">
        <UserNavigation />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 text-white text-center">
          Loading analytics...
        </div>
      </div>
    );
  }

  if (!reportData) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900">
        <UserNavigation />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 text-white text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <h1 className="text-3xl font-bold mb-4">Error Loading Analytics</h1>
            <p className="text-gray-300 mb-6">Unable to load analytics data. Please try again.</p>
            <Button
              onClick={fetchReport}
              className="bg-gradient-security hover:opacity-90 text-white border-0 px-8 py-4 text-lg"
            >
              Retry
            </Button>
          </motion.div>
        </div>
      </div>
    );
  }

  if (reportData.totalAssessments === 0) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900">
        <UserNavigation />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 text-white text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <h1 className="text-3xl font-bold mb-4">No Assessments Completed</h1>
            <p className="text-gray-300 mb-6">Complete an assessment to view your analytics.</p>
            <Button
              onClick={() => router.push('/user/assessment')}
              className="bg-gradient-security hover:opacity-90 text-white border-0 px-8 py-4 text-lg"
            >
              Take Assessment
            </Button>
          </motion.div>
        </div>
      </div>
    );
  }

  const analyticsData: AssessmentData = {
    _id: user?.id || '',
    userName: reportData.userName,
    overallScore: reportData.overallScore / 25,
    answers: {},
    categoryScores: Object.fromEntries(
      Object.entries(reportData.categoryScores).map(([key, value]) => [key, { score: value / 25, total: 4 }])
    ),
    timestamp: reportData.lastAssessment !== 'No assessments completed'
      ? new Date(Date.now() - parseInt(reportData.lastAssessment.split(' ')[0]) * 24 * 60 * 60 * 1000).toISOString()
      : new Date().toISOString(),
    benchmarks: reportData.benchmarks,
    totalAssessments: reportData.totalAssessments,
    lastAssessment: reportData.lastAssessment,
    joinDate: reportData.joinDate,
    achievements: reportData.achievements,
  };

  console.log('Analytics Data:', analyticsData);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900">
      <UserNavigation />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-white mb-2">Security Analytics for {reportData.userName}</h1>
          <p className="text-gray-300">
            In-depth visualization and analysis of your security posture
          </p>
        </div>

        <Tabs defaultValue="overview" className="space-y-6">
          <TabsList className="bg-white/10 border-white/20">
            <TabsTrigger value="overview" className="data-[state=active]:bg-white/20">
              Overview
            </TabsTrigger>
            <TabsTrigger value="charts" className="data-[state=active]:bg-white/20">
              Charts
            </TabsTrigger>
            <TabsTrigger value="recommendations" className="data-[state=active]:bg-white/20">
              Recommendations
            </TabsTrigger>
            <TabsTrigger value="compliance" className="data-[state=active]:bg-white/20">
              Compliance
            </TabsTrigger>
          </TabsList>

          <TabsContent value="overview">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
              <Card className="bg-white/10 backdrop-blur-md border-white/20">
                <CardHeader>
                  <CardTitle className="text-white flex items-center">
                    <Shield className="mr-2 h-5 w-5 text-blue-400" />
                    Security Overview
                  </CardTitle>
                  <CardDescription className="text-gray-300">
                    Summary of your security assessment
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <SecurityReport data={analyticsData} section="overview" />
                </CardContent>
              </Card>
            </motion.div>
          </TabsContent>

          <TabsContent value="charts">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
              <Card className="bg-white/10 backdrop-blur-md border-white/20">
                <CardHeader>
                  <CardTitle className="text-white flex items-center">
                    <BarChart2 className="mr-2 h-5 w-5 text-blue-400" />
                    Security Charts
                  </CardTitle>
                  <CardDescription className="text-gray-300">
                    Visual analysis of your security scores
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <SecurityReport data={analyticsData} section="charts" />
                </CardContent>
              </Card>
            </motion.div>
          </TabsContent>

          <TabsContent value="recommendations">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
              <Card className="bg-white/10 backdrop-blur-md border-white/20">
                <CardHeader>
                  <CardTitle className="text-white flex items-center">
                    <Lightbulb className="mr-2 h-5 w-5 text-yellow-400" />
                    Recommendations
                  </CardTitle>
                  <CardDescription className="text-gray-300">
                    Actionable steps to improve your security
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <SecurityReport data={analyticsData} section="recommendations" />
                </CardContent>
              </Card>
            </motion.div>
          </TabsContent>

          <TabsContent value="compliance">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
              <Card className="bg-white/10 backdrop-blur-md border-white/20">
                <CardHeader>
                  <CardTitle className="text-white flex items-center">
                    <TrendingUp className="mr-2 h-5 w-5 text-green-400" />
                    Compliance
                  </CardTitle>
                  <CardDescription className="text-gray-300">
                    Your alignment with security frameworks
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <SecurityReport data={analyticsData} section="compliance" />
                </CardContent>
              </Card>
            </motion.div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}