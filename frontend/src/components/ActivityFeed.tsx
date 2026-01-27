'use client';

import { useState, useEffect } from 'react';
import { Mail, MessageSquare, CheckCircle, Clock, AlertCircle } from 'lucide-react';
import { apiClient } from '@/lib/api';

export default function ActivityFeed() {
  const [activities, setActivities] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadActivities();
  }, []);

  const loadActivities = async () => {
    try {
      const userId = localStorage.getItem('user_id');
      if (!userId) return;
      
      const res = await apiClient.activity.getFeed(userId);
      setActivities(res.data);
    } catch (error) {
      console.error("Error loading activity feed", error);
    } finally {
      setLoading(false);
    }
  };

  const getIcon = (type: string, status: string) => {
    if (type === 'email') return <Mail className="w-5 h-5 text-blue-500" />;
    if (type === 'ticket') {
      if (status === 'resolved') return <CheckCircle className="w-5 h-5 text-green-500" />;
      return <MessageSquare className="w-5 h-5 text-yellow-500" />;
    }
    return <Clock className="w-5 h-5 text-gray-400" />;
  };

  if (loading) {
    return <div className="p-4 text-center text-gray-500">Indlæser tidslinje...</div>;
  }

  if (activities.length === 0) {
    return (
      <div className="p-8 text-center bg-white rounded-xl border border-gray-100">
        <div className="w-12 h-12 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-3">
          <Clock className="w-6 h-6 text-gray-400" />
        </div>
        <p className="text-gray-500">Ingen aktivitet endnu. Vi holder øje.</p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl border border-gray-100 overflow-hidden">
      <div className="p-4 border-b border-gray-100 bg-gray-50/50">
        <h3 className="font-semibold text-gray-900">Seneste Aktivitet</h3>
      </div>
      <div className="divide-y divide-gray-100">
        {activities.map((activity) => (
          <div key={`${activity.type}-${activity.id}`} className="p-4 flex gap-4 hover:bg-gray-50 transition-colors">
            <div className="mt-1">
              <div className="p-2 bg-gray-50 rounded-full border border-gray-100">
                {getIcon(activity.type, activity.status)}
              </div>
            </div>
            <div className="flex-1">
              <div className="flex justify-between items-start">
                <h4 className="font-medium text-gray-900">{activity.title}</h4>
                <span className="text-xs text-gray-400">
                  {new Date(activity.date).toLocaleDateString()}
                </span>
              </div>
              <p className="text-sm text-gray-600 mt-1">{activity.description}</p>
              {activity.status && (
                <span className={`inline-block mt-2 text-xs px-2 py-0.5 rounded-full font-medium
                  ${activity.status === 'sent' ? 'bg-blue-50 text-blue-700' : 
                    activity.status === 'resolved' ? 'bg-green-50 text-green-700' :
                    'bg-yellow-50 text-yellow-700'
                  }`}>
                  {activity.status}
                </span>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}





