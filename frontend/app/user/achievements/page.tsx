'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { 
  Shield, 
  Award, 
  Trophy, 
  Star, 
  Target,
  CheckCircle,
  Lock,
  Zap,
  Users,
  TrendingUp
} from 'lucide-react';
import { UserNavigation } from '@/components/user-navigation';

export default function AchievementsPage() {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return null;
  }

  const achievements = [
    {
      id: 1,
      name: 'Security Rookie',
      description: 'Complete your first security assessment',
      icon: Shield,
      earned: true,
      earnedDate: '2024-01-15',
      points: 10,
      rarity: 'common'
    },
    {
      id: 2,
      name: 'Password Master',
      description: 'Achieve 90%+ score in Password Management',
      icon: Lock,
      earned: true,
      earnedDate: '2024-01-20',
      points: 25,
      rarity: 'uncommon'
    },
    {
      id: 3,
      name: 'Improvement Seeker',
      description: 'Improve your overall score by 10+ points',
      icon: TrendingUp,
      earned: true,
      earnedDate: '2024-01-25',
      points: 20,
      rarity: 'uncommon'
    },
    {
      id: 4,
      name: 'Privacy Pro',
      description: 'Achieve 95%+ score in Data Protection',
      icon: Target,
      earned: false,
      progress: 65,
      points: 30,
      rarity: 'rare'
    },
    {
      id: 5,
      name: 'Security Champion',
      description: 'Achieve 90%+ overall security score',
      icon: Trophy,
      earned: false,
      progress: 78,
      points: 50,
      rarity: 'epic'
    },
    {
      id: 6,
      name: 'Perfect Score',
      description: 'Achieve 100% in any category',
      icon: Star,
      earned: false,
      progress: 85,
      points: 100,
      rarity: 'legendary'
    },
    {
      id: 7,
      name: 'Consistency King',
      description: 'Complete 5 assessments in a row',
      icon: Zap,
      earned: false,
      progress: 3,
      maxProgress: 5,
      points: 25,
      rarity: 'uncommon'
    },
    {
      id: 8,
      name: 'Top Performer',
      description: 'Rank in top 10% of all users',
      icon: Award,
      earned: false,
      progress: 15,
      maxProgress: 10,
      points: 75,
      rarity: 'epic'
    }
  ];

  const stats = {
    totalPoints: achievements.filter(a => a.earned).reduce((sum, a) => sum + a.points, 0),
    totalEarned: achievements.filter(a => a.earned).length,
    totalAchievements: achievements.length,
    currentRank: 'Silver',
    nextRank: 'Gold',
    pointsToNextRank: 25
  };

  const getRarityColor = (rarity: string) => {
    switch (rarity) {
      case 'common': return 'bg-gray-500';
      case 'uncommon': return 'bg-green-500';
      case 'rare': return 'bg-blue-500';
      case 'epic': return 'bg-purple-500';
      case 'legendary': return 'bg-yellow-500';
      default: return 'bg-gray-500';
    }
  };

  const getRarityText = (rarity: string) => {
    return rarity.charAt(0).toUpperCase() + rarity.slice(1);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900">
      <UserNavigation />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-white mb-2">Achievements</h1>
          <p className="text-gray-300">
            Track your security milestones and earn rewards for improving your security posture
          </p>
        </div>

        {/* Stats Overview */}
        <div className="grid md:grid-cols-4 gap-6 mb-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <Card className="bg-white/10 backdrop-blur-md border-white/20 text-center">
              <CardContent className="pt-6">
                <Trophy className="h-8 w-8 text-yellow-400 mx-auto mb-3" />
                <div className="text-2xl font-bold text-white mb-1">{stats.totalPoints}</div>
                <div className="text-gray-300 text-sm">Total Points</div>
              </CardContent>
            </Card>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
          >
            <Card className="bg-white/10 backdrop-blur-md border-white/20 text-center">
              <CardContent className="pt-6">
                <CheckCircle className="h-8 w-8 text-green-400 mx-auto mb-3" />
                <div className="text-2xl font-bold text-white mb-1">
                  {stats.totalEarned}/{stats.totalAchievements}
                </div>
                <div className="text-gray-300 text-sm">Achievements</div>
              </CardContent>
            </Card>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <Card className="bg-white/10 backdrop-blur-md border-white/20 text-center">
              <CardContent className="pt-6">
                <Star className="h-8 w-8 text-blue-400 mx-auto mb-3" />
                <div className="text-2xl font-bold text-white mb-1">{stats.currentRank}</div>
                <div className="text-gray-300 text-sm">Current Rank</div>
              </CardContent>
            </Card>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
          >
            <Card className="bg-white/10 backdrop-blur-md border-white/20 text-center">
              <CardContent className="pt-6">
                <Target className="h-8 w-8 text-purple-400 mx-auto mb-3" />
                <div className="text-2xl font-bold text-white mb-1">{stats.pointsToNextRank}</div>
                <div className="text-gray-300 text-sm">Points to {stats.nextRank}</div>
              </CardContent>
            </Card>
          </motion.div>
        </div>

        {/* Progress to Next Rank */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="mb-8"
        >
          <Card className="bg-white/10 backdrop-blur-md border-white/20">
            <CardHeader>
              <CardTitle className="text-white">Progress to {stats.nextRank} Rank</CardTitle>
              <CardDescription className="text-gray-300">
                Earn {stats.pointsToNextRank} more points to reach the next rank
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Progress 
                value={((stats.totalPoints) / (stats.totalPoints + stats.pointsToNextRank)) * 100} 
                className="bg-white/10 mb-2" 
              />
              <div className="flex justify-between text-sm text-gray-300">
                <span>{stats.currentRank}</span>
                <span>{stats.nextRank}</span>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Achievements Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {achievements.map((achievement, index) => (
            <motion.div
              key={achievement.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
            >
              <Card className={`bg-white/10 backdrop-blur-md border-white/20 h-full ${
                achievement.earned ? 'ring-2 ring-green-500/50' : ''
              }`}>
                <CardHeader>
                  <div className="flex items-center justify-between mb-4">
                    <div className={`p-3 rounded-full ${
                      achievement.earned ? 'bg-green-500' : 'bg-gray-600'
                    }`}>
                      <achievement.icon className="h-6 w-6 text-white" />
                    </div>
                    <div className="flex space-x-2">
                      <Badge className={`${getRarityColor(achievement.rarity)} text-white border-0`}>
                        {getRarityText(achievement.rarity)}
                      </Badge>
                      <Badge className="bg-blue-500/20 text-blue-300 border-blue-500/30">
                        {achievement.points} pts
                      </Badge>
                    </div>
                  </div>
                  <CardTitle className={`${achievement.earned ? 'text-white' : 'text-gray-400'}`}>
                    {achievement.name}
                  </CardTitle>
                  <CardDescription className="text-gray-300">
                    {achievement.description}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  {achievement.earned ? (
                    <div className="flex items-center space-x-2 text-green-400">
                      <CheckCircle className="h-4 w-4" />
                      <span className="text-sm">Earned on {achievement.earnedDate}</span>
                    </div>
                  ) : (
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm text-gray-300">
                        <span>Progress</span>
                        <span>
                          {achievement.progress}
                          {achievement.maxProgress ? `/${achievement.maxProgress}` : '%'}
                        </span>
                      </div>
                      <Progress 
                        value={achievement.maxProgress ? 
                          (achievement.progress / achievement.maxProgress) * 100 : 
                          achievement.progress
                        } 
                        className="bg-white/10" 
                      />
                    </div>
                  )}
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>

        {/* Leaderboard Preview */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.8 }}
          className="mt-8"
        >
          <Card className="bg-white/10 backdrop-blur-md border-white/20">
            <CardHeader>
              <CardTitle className="text-white flex items-center">
                <Users className="mr-2 h-5 w-5" />
                Leaderboard Preview
              </CardTitle>
              <CardDescription className="text-gray-300">
                See how you rank among other users
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {[
                  { rank: 1, name: 'Security Expert', points: 450, badge: 'Diamond' },
                  { rank: 2, name: 'Cyber Guardian', points: 380, badge: 'Platinum' },
                  { rank: 3, name: 'Digital Defender', points: 320, badge: 'Gold' },
                  { rank: 15, name: 'You', points: stats.totalPoints, badge: stats.currentRank, isUser: true },
                ].map((user, index) => (
                  <div 
                    key={index} 
                    className={`flex items-center justify-between p-3 rounded-lg ${
                      user.isUser ? 'bg-blue-500/20 border border-blue-500/50' : 'bg-white/5'
                    }`}
                  >
                    <div className="flex items-center space-x-3">
                      <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold ${
                        user.rank === 1 ? 'bg-yellow-500' :
                        user.rank === 2 ? 'bg-gray-400' :
                        user.rank === 3 ? 'bg-orange-500' :
                        'bg-blue-500'
                      } text-white`}>
                        {user.rank}
                      </div>
                      <div>
                        <div className={`font-medium ${user.isUser ? 'text-blue-300' : 'text-white'}`}>
                          {user.name}
                        </div>
                        <div className="text-sm text-gray-400">{user.points} points</div>
                      </div>
                    </div>
                    <Badge className="bg-white/10 text-white border-white/20">
                      {user.badge}
                    </Badge>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  );
}