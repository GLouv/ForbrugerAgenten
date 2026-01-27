'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { 
  FileText, 
  Clock, 
  Check, 
  X, 
  ChevronRight,
  Zap,
  Phone,
  Wifi,
  ArrowRight,
  Star,
  Plus,
  TrendingDown,
  RefreshCw,
  Filter
} from 'lucide-react';
import toast from 'react-hot-toast';
import AppLayout from '@/components/AppLayout';
import { apiClient } from '@/lib/api';

interface Quote {
  id: string;
  provider_id: string;
  provider_name: string;
  category: string;
  monthly_price: number;
  annual_price?: number;
  features: string[];
  status: string;
  created_at: string;
  savings_vs_current?: number;
  estimated_savings?: number;
}

interface QuoteRequest {
  id: string;
  categories: string[];
  status: string;
  created_at: string;
  quotes_count?: number;
}

const CATEGORY_CONFIG: Record<string, { icon: any; label: string; color: string; bgColor: string }> = {
  energy: { icon: Zap, label: 'Strøm', color: 'text-yellow-600', bgColor: 'bg-yellow-100' },
  mobile: { icon: Phone, label: 'Mobil', color: 'text-blue-600', bgColor: 'bg-blue-100' },
  internet: { icon: Wifi, label: 'Internet', color: 'text-purple-600', bgColor: 'bg-purple-100' },
};

const CATEGORY_LABELS: Record<string, string> = {
  energy: 'Strøm',
  mobile: 'Mobil',
  internet: 'Internet',
};

export default function QuotesPage() {
  const router = useRouter();
  const [requests, setRequests] = useState<QuoteRequest[]>([]);
  const [quotes, setQuotes] = useState<Quote[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [sortBy, setSortBy] = useState<'price' | 'savings'>('savings');

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const userId = localStorage.getItem('user_id');
      if (!userId) return;

      const [requestsRes, quotesRes] = await Promise.all([
        apiClient.quotes.getRequests(userId),
        apiClient.quotes.list(userId)
      ]);

      setRequests(requestsRes.data || []);
      setQuotes(quotesRes.data || []);
    } catch (error) {
      console.error('Failed to load quotes:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleAcceptQuote = async (quoteId: string) => {
    try {
      // In production, this would call an API endpoint
      toast.success('Tilbud accepteret! Vi kontakter dig snarest.');
      loadData();
    } catch (error) {
      toast.error('Kunne ikke acceptere tilbud');
    }
  };

  const handleStartNewHunt = () => {
    router.push('/onboarding');
  };

  const filteredQuotes = selectedCategory === 'all' 
    ? quotes 
    : quotes.filter(q => q.category === selectedCategory);

  // Sort quotes
  const sortedQuotes = [...filteredQuotes].sort((a, b) => {
    if (sortBy === 'price') return a.monthly_price - b.monthly_price;
    if (sortBy === 'savings') return (b.estimated_savings || 0) - (a.estimated_savings || 0);
    return 0;
  });

  const activeRequests = requests.filter(r => r.status === 'pending' || r.status === 'in_progress');
  const allCategories = ['all', 'energy', 'mobile', 'internet'];
  
  // Calculate total potential savings
  const totalSavings = quotes.reduce((sum, q) => sum + (q.estimated_savings || 0), 0);

  if (loading) {
    return (
      <AppLayout>
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
        </div>
      </AppLayout>
    );
  }

  return (
    <AppLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Dine Tilbud</h1>
            <p className="text-gray-500">Sammenlign og vælg det bedste tilbud</p>
          </div>
          <button
            onClick={handleStartNewHunt}
            className="flex items-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-colors font-medium shadow-lg shadow-blue-200"
          >
            <Plus className="w-5 h-5" />
            Start ny jagt
          </button>
        </div>

        {/* Savings Summary */}
        {totalSavings > 0 && (
          <div className="bg-gradient-to-r from-green-500 to-emerald-600 rounded-xl p-6 text-white">
            <div className="flex items-center gap-3 mb-2">
              <TrendingDown className="w-6 h-6" />
              <span className="font-medium">Potentiel Besparelse</span>
            </div>
            <p className="text-4xl font-bold">{totalSavings.toLocaleString()} kr/år</p>
            <p className="text-green-100 text-sm mt-1">Baseret på dine modtagne tilbud</p>
          </div>
        )}

        {/* Active Requests */}
        {activeRequests.length > 0 && (
          <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="animate-pulse">
                  <Clock className="w-5 h-5 text-yellow-600" />
                </div>
                <span className="font-medium text-yellow-800">
                  {activeRequests.length} aktive jagt{activeRequests.length > 1 ? 'er' : ''}
                </span>
              </div>
              <button 
                onClick={loadData}
                className="flex items-center gap-1 text-yellow-700 hover:text-yellow-900 text-sm"
              >
                <RefreshCw className="w-4 h-4" />
                Opdater
              </button>
            </div>
            <p className="text-sm text-yellow-700 mt-2">
              Vi indhenter tilbud fra selskaberne. Du får besked i din indbakke når de er klar.
            </p>
          </div>
        )}

        {/* Category Filter & Sort */}
        <div className="flex flex-col md:flex-row gap-4 items-start md:items-center justify-between">
          <div className="flex gap-2 flex-wrap">
            {allCategories.map((cat) => {
              const config = CATEGORY_CONFIG[cat];
              const Icon = config?.icon;
              const count = cat === 'all' ? quotes.length : quotes.filter(q => q.category === cat).length;
              
              return (
                <button
                  key={cat}
                  onClick={() => setSelectedCategory(cat)}
                  className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-all ${
                    selectedCategory === cat
                      ? 'bg-blue-600 text-white shadow-md'
                      : 'bg-white text-gray-600 hover:bg-gray-100 border border-gray-200'
                  }`}
                >
                  {Icon && <Icon className="w-4 h-4" />}
                  {cat === 'all' ? 'Alle' : config?.label || cat}
                  {count > 0 && (
                    <span className={`ml-1 px-1.5 py-0.5 rounded-full text-xs ${
                      selectedCategory === cat ? 'bg-blue-500' : 'bg-gray-100'
                    }`}>
                      {count}
                    </span>
                  )}
                </button>
              );
            })}
          </div>
          
          {/* Sort */}
          <div className="flex items-center gap-2">
            <Filter className="w-4 h-4 text-gray-400" />
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as 'price' | 'savings')}
              className="text-sm border-gray-200 rounded-lg focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="savings">Største besparelse</option>
              <option value="price">Laveste pris</option>
            </select>
          </div>
        </div>

        {/* Quotes Grid */}
        {sortedQuotes.length === 0 ? (
          <div className="bg-white rounded-xl border border-gray-200 p-12 text-center">
            <FileText className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              {selectedCategory === 'all' ? 'Ingen tilbud endnu' : `Ingen ${CATEGORY_LABELS[selectedCategory]?.toLowerCase() || selectedCategory} tilbud`}
            </h3>
            <p className="text-gray-500 mb-6">
              Start en jagt for at indhente tilbud fra selskaberne.
            </p>
            <button
              onClick={handleStartNewHunt}
              className="inline-flex items-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              <Plus className="w-4 h-4" />
              Start en ny jagt
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {sortedQuotes.map((quote, index) => {
              const config = CATEGORY_CONFIG[quote.category] || { icon: FileText, label: quote.category, color: 'text-gray-600', bgColor: 'bg-gray-100' };
              const CategoryIcon = config.icon;
              const isBestDeal = index === 0 && sortBy === 'savings' && (quote.estimated_savings || 0) > 0;
              return (
                <div
                  key={quote.id}
                  className={`bg-white rounded-xl border p-6 hover:shadow-lg transition-all relative ${
                    isBestDeal ? 'border-green-400 ring-2 ring-green-100' : 'border-gray-200'
                  }`}
                >
                  {/* Best Deal Badge */}
                  {isBestDeal && (
                    <div className="absolute -top-3 left-4 px-3 py-1 bg-green-500 text-white text-xs font-bold rounded-full flex items-center gap-1">
                      <Star className="w-3 h-3" />
                      BEDSTE TILBUD
                    </div>
                  )}
                  
                  {/* Header */}
                  <div className="flex items-start justify-between mb-4 mt-2">
                    <div className="flex items-center gap-3">
                      <div className={`w-12 h-12 rounded-xl ${config.bgColor} flex items-center justify-center`}>
                        <CategoryIcon className={`w-6 h-6 ${config.color}`} />
                      </div>
                      <div>
                        <h3 className="font-semibold text-gray-900">
                          {quote.provider_name}
                        </h3>
                        <span className={`text-sm ${config.color}`}>
                          {config.label}
                        </span>
                      </div>
                    </div>
                    {(quote.estimated_savings || quote.savings_vs_current) && (quote.estimated_savings || quote.savings_vs_current || 0) > 0 && (
                      <span className="px-2 py-1 bg-green-100 text-green-700 text-xs font-medium rounded-full flex items-center gap-1">
                        <TrendingDown className="w-3 h-3" />
                        -{quote.estimated_savings || quote.savings_vs_current} kr/md
                      </span>
                    )}
                  </div>

                  {/* Price */}
                  <div className="mb-4">
                    <span className="text-3xl font-bold text-gray-900">
                      {quote.monthly_price}
                    </span>
                    <span className="text-gray-500"> kr/md</span>
                    {quote.annual_price && (
                      <p className="text-sm text-gray-400">
                        {quote.annual_price} kr/år
                      </p>
                    )}
                  </div>

                  {/* Features */}
                  {quote.features && quote.features.length > 0 && (
                    <ul className="space-y-2 mb-4">
                      {quote.features.slice(0, 3).map((feature, i) => (
                        <li key={i} className="flex items-center gap-2 text-sm text-gray-600">
                          <Check className="w-4 h-4 text-green-500" />
                          {feature}
                        </li>
                      ))}
                    </ul>
                  )}

                  {/* Actions */}
                  <div className="flex gap-2 pt-4 border-t border-gray-100">
                    <button
                      onClick={() => handleAcceptQuote(quote.id)}
                      className="flex-1 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
                    >
                      Vælg dette tilbud
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* How it works */}
        <div className="bg-white rounded-xl border border-gray-200 p-6 mt-8">
          <h3 className="font-semibold text-gray-900 mb-4">Sådan virker det</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="flex items-start gap-3">
              <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 font-bold">
                1
              </div>
              <div>
                <p className="font-medium text-gray-900">Vi indhenter tilbud</p>
                <p className="text-sm text-gray-500">
                  Vi kontakter relevante selskaber på dine vegne
                </p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 font-bold">
                2
              </div>
              <div>
                <p className="font-medium text-gray-900">Du sammenligner</p>
                <p className="text-sm text-gray-500">
                  Se alle tilbud samlet og vælg det bedste
                </p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 font-bold">
                3
              </div>
              <div>
                <p className="font-medium text-gray-900">Vi klarer skiftet</p>
                <p className="text-sm text-gray-500">
                  Vi håndterer alt papirarbejde for dig
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </AppLayout>
  );
}





