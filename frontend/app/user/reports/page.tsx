'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Shield, 
  TrendingUp, 
  AlertTriangle, 
  CheckCircle, 
  FileText,
  Download,
  Calendar,
  Target,
  Lightbulb,
  Users
} from 'lucide-react';
import { UserNavigation } from '@/components/user-navigation';
import { useAuth } from '@/components/auth-provider';
import { toast } from 'sonner';
import { useRouter } from 'next/navigation';

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
}

export default function ReportsPage() {
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
      toast.error('Please log in to view your report');
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
      console.log('Report response status:', response.status);
      const data = await response.json();
      console.log('Report response data:', data);
      if (response.ok) {
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
      } else {
        console.error('Report error response:', data);
        toast.error(data.error || 'Failed to fetch report');
      }
    } catch (error) {
      console.error('Fetch report error:', error);
      toast.error(`Error fetching report: ${error.message}`);
    } finally {
      setIsLoading(false);
    }
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

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'bg-red-500';
      case 'medium': return 'bg-yellow-500';
      case 'low': return 'bg-green-500';
      default: return 'bg-gray-500';
    }
  };

  if (!mounted || isLoading || !reportData) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900">
        <UserNavigation />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 text-white text-center">
          Loading report...
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
            <p className="text-gray-300 mb-6">Complete an assessment to view your security report.</p>
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

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900">
      <UserNavigation />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-white mb-2">Security Reports for {reportData.userName}</h1>
            <p className="text-gray-300">
              Detailed analysis of your security posture and improvement recommendations
            </p>
          </div>
          <Button className="bg-gradient-security hover:opacity-90 text-white border-0">
            <Download className="mr-2 h-4 w-4" />
            Export Report
          </Button>
        </div>

        <Tabs defaultValue="overview" className="space-y-6">
          <TabsList className="bg-white/10 border-white/20">
            <TabsTrigger value="overview" className="data-[state=active]:bg-white/20">
              Overview
            </TabsTrigger>
            <TabsTrigger value="detailed" className="data-[state=active]:bg-white/20">
              Detailed Analysis
            </TabsTrigger>
            <TabsTrigger value="trends" className="data-[state=active]:bg-white/20">
              History
            </TabsTrigger>
            <TabsTrigger value="recommendations" className="data-[state=active]:bg-white/20">
              Recommendations
            </TabsTrigger>
          </TabsList>

          <TabsContent value="overview">
            <div className="grid lg:grid-cols-3 gap-6">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
                className="lg:col-span-1"
              >
                <Card className="bg-white/10 backdrop-blur-md border-white/20">
                  <CardHeader className="text-center">
                    <CardTitle className="text-white">Overall Security Score</CardTitle>
                    <div className={`text-5xl font-bold ${getScoreColor(reportData.overallScore)} mb-4`}>
                      {reportData.overallScore.toFixed(2)}%
                    </div>
                    <div className="flex items-center justify-center space-x-2">
                      <TrendingUp className="h-4 w-4 text-green-500" />
                      <span className="text-green-500">
                        {reportData.attempts.length > 1
                          ? `${(reportData.overallScore - reportData.previousScore) >= 0 ? '+' : ''}${(reportData.overallScore - reportData.previousScore).toFixed(2)}% from last assessment`
                          : 'No previous assessment'}
                      </span>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="text-center">
                        <Badge className="bg-blue-500/20 text-blue-300 border-blue-500/30">
                          Last assessment: {reportData.lastAssessment}
                        </Badge>
                      </div>
                      <div className="text-center">
                        <p className="text-gray-300">
                          Total assessments completed: {reportData.totalAssessments}
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.2 }}
                className="lg:col-span-2"
              >
                <Card className="bg-white/10 backdrop-blur-md border-white/20">
                  <CardHeader>
                    <CardTitle className="text-white">Category Performance</CardTitle>
                    <CardDescription className="text-gray-300">
                      Your scores across different security areas
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    {Object.entries(reportData.categoryScores || {}).length > 0 ? (
                      Object.entries(reportData.categoryScores).map(([category, score]) => (
                        <div key={category} className="space-y-2">
                          <div className="flex justify-between">
                            <span className="text-white font-medium">{category}</span>
                            <Badge className={`${getScoreBg(score)} ${getScoreColor(score)} border-0`}>
                              {score.toFixed(2)}%
                            </Badge>
                          </div>
                          <Progress value={score} className="bg-white/10" />
                        </div>
                      ))
                    ) : (
                      <p className="text-gray-300">No category data available. Please complete an assessment.</p>
                    )}
                  </CardContent>
                </Card>
              </motion.div>
            </div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
              className="mt-6"
            >
              <Card className="bg-white/10 backdrop-blur-md border-white/20">
                <CardHeader>
                  <CardTitle className="text-white">Industry Benchmarks</CardTitle>
                  <CardDescription className="text-gray-300">
                    See how you compare to industry standards
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid md:grid-cols-3 gap-6">
                    <div className="text-center">
                      <div className="text-2xl font-bold text-yellow-500 mb-2">
                        {reportData.benchmarks.industry.toFixed(2)}%
                      </div>
                      <div className="text-gray-300">Industry Average</div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold text-blue-500 mb-2">
                        {reportData.benchmarks.peers.toFixed(2)}%
                      </div>
                      <div className="text-gray-300">Similar Users</div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold text-green-500 mb-2">
                        {reportData.benchmarks.topPerformers.toFixed(2)}%
                      </div>
                      <div className="text-gray-300">Top Performers</div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          </TabsContent>

          <TabsContent value="detailed">
            <div className="space-y-6">
              {Object.entries(reportData.categoryScores || {}).length > 0 ? (
                Object.entries(reportData.categoryScores).map(([category, score], index) => (
                  <motion.div
                    key={category}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: index * 0.1 }}
                  >
                    <Card className="bg-white/10 backdrop-blur-md border-white/20">
                      <CardHeader>
                        <div className="flex justify-between items-center">
                          <CardTitle className="text-white">{category}</CardTitle>
                          <Badge className={`${getScoreBg(score)} ${getScoreColor(score)} border-0`}>
                            {score.toFixed(2)}%
                          </Badge>
                        </div>
                      </CardHeader>
                      <CardContent>
                        <Progress value={score} className="bg-white/10 mb-4" />
                        <div className="text-gray-300">
                          <p className="mb-2">
                            <strong>Assessment:</strong> {
                              score >= 80 ? 'Excellent security practices in this area.' :
                              score >= 60 ? 'Good practices with room for improvement.' :
                              score >= 25 ? 'Basic practices; significant improvements needed.' :
                              'Poor practices; urgent improvements required.'
                            }
                          </p>
                          <p>
                            <strong>Impact:</strong> This category contributes to your overall security posture. 
                            {score < 80 && ' Consider following the recommended actions to improve your score.'}
                          </p>
                        </div>
                      </CardContent>
                    </Card>
                  </motion.div>
                ))
              ) : (
                <Card className="bg-white/10 backdrop-blur-md border-white/20">
                  <CardContent>
                    <p className="text-gray-300">No category data available. Please complete an assessment.</p>
                  </CardContent>
                </Card>
              )}
            </div>
          </TabsContent>

          <TabsContent value="trends">
            <Card className="bg-white/10 backdrop-blur-md border-white/20">
              <CardHeader>
                <CardTitle className="text-white">Security Score Trends</CardTitle>
                <CardDescription className="text-gray-300">
                  Track your security improvements over time
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {reportData.attempts.length > 0 ? (
                    reportData.attempts.map((attempt, index) => (
                      <div key={index} className="flex items-center justify-between p-4 bg-white/5 rounded-lg">
                        <div className="flex items-center space-x-3">
                          <Calendar className="h-5 w-5 text-blue-400" />
                          <div>
                            <div className="text-white font-medium">
                              Attempt #{attempt.attemptNumber} by {attempt.userName}
                            </div>
                            <div className="text-gray-400 text-sm">
                              {new Date(attempt.completedAt).toLocaleDateString()}
                            </div>
                          </div>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Badge className={`${getScoreBg(attempt.overallPercentage)} ${getScoreColor(attempt.overallPercentage)} border-0`}>
                            {attempt.overallPercentage.toFixed(2)}%
                          </Badge>
                          {attempt.accuracyChange !== 0 && (
                            <Badge className={attempt.accuracyChange >= 0 ? 'bg-green-500/20 text-green-500' : 'bg-red-500/20 text-red-500'}>
                              {attempt.accuracyChange >= 0 ? '+' : ''}{attempt.accuracyChange.toFixed(2)}%
                            </Badge>
                          )}
                        </div>
                      </div>
                    ))
                  ) : (
                    <p className="text-gray-300">No assessment history available. Please complete an assessment.</p>
                  )}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="recommendations">
            <div className="space-y-6">
              <Card className="bg-white/10 backdrop-blur-md border-white/20">
                <CardHeader>
                  <CardTitle className="text-white flex items-center">
                    <Lightbulb className="mr-2 h-5 w-5 text-yellow-400" />
                    Security Improvement Recommendations
                  </CardTitle>
                  <CardDescription className="text-gray-300">
                    Actionable steps to improve your security score
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  {reportData.recommendations.length > 0 ? (
                    reportData.recommendations.map((rec, index) => (
                      <motion.div
                        key={index}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6, delay: index * 0.1 }}
                        className="p-4 bg-white/5 rounded-lg border border-white/10"
                      >
                        <div className="flex items-start justify-between mb-3">
                          <div className="flex items-center space-x-3">
                            <Badge className="bg-blue-500/20 text-blue-300 border-blue-500/30">
                              {rec.category}
                            </Badge>
                            <Badge className={`${getPriorityColor(rec.priority)} text-white border-0`}>
                              {rec.priority.toUpperCase()}
                            </Badge>
                          </div>
                          <Target className="h-5 w-5 text-gray-400" />
                        </div>
                        <h4 className="text-white font-semibold mb-2">{rec.issue}</h4>
                        <p className="text-gray-300 mb-3">{rec.description}</p>
                        <div className="bg-gradient-security/20 p-3 rounded-lg">
                          <p className="text-white text-sm">
                            <strong>Action:</strong> {rec.action}
                          </p>
                        </div>
                      </motion.div>
                    ))
                  ) : (
                    <p className="text-gray-300">No recommendations available. Your security practices are excellent!</p>
                  )}
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}