import React, { useEffect, useState } from 'react';
import { useDonation } from '../../hooks/useDonation';
import { DollarSign, Users, TrendingUp, Activity, ArrowUpRight, AlertTriangle } from 'lucide-react';
import { formatCurrency } from '../../utils/formatters';
import Loader from '../Loader';
import StatsCard from './Charts/StatsCard';
import DonationsLineChart from './Charts/DonationsLineChart';
import PaymentMethodsPieChart from './Charts/PaymentMethodsPieChart';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '../ui/Card';
import { Button } from '../ui/Button';
import { Badge } from '../ui/Badge';

const AdminDashboardPage = () => {
  const { getDashboardData } = useDonation();
  const [stats, setStats] = useState(null);
  const [timeSeriesData, setTimeSeriesData] = useState([]);
  const [paymentMethodsData, setPaymentMethodsData] = useState([]);
  const [selectedPeriod, setSelectedPeriod] = useState(30);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => { fetchDashboardData(); }, [selectedPeriod]);

  const fetchDashboardData = async () => {
    setLoading(true);
    const result = await getDashboardData(selectedPeriod);
    if (!result.success) { setError(result.error); setLoading(false); return; }
    setStats(result.data.stats);
    setTimeSeriesData(result.data.timeSeries);
    setPaymentMethodsData(result.data.paymentMethods);
    setLoading(false);
  };

  if (loading && !stats) return <div className="flex justify-center items-center py-20"><Loader size="lg" /></div>;
  if (error) return <div className="rounded-lg border border-destructive/50 bg-destructive/5 p-4 text-destructive"><AlertTriangle className="inline-block w-5 h-5 mr-2" />Error: {error}</div>;
  if (!stats) return null;

  const kpis = [
    { icon: DollarSign, label: 'Total Donations', value: formatCurrency(stats.totalAmount || 0), change: 18.5, trend: 'up' },
    { icon: Users, label: 'Total Donors', value: stats.totalDonations || 0, change: 12.3, trend: 'up' },
    { icon: Activity, label: 'Pending', value: stats.pendingDonations || 0, change: 5.2, trend: 'down' },
    { icon: TrendingUp, label: 'This Period', value: `${stats.monthlyDonations || 0}`, change: 8.1, trend: 'up' },
  ];

  const periodOptions = [{ value: 7, label: 'Last 7 Days' }, { value: 30, label: 'Last 30 Days' }, { value: 90, label: 'Last 90 Days' }];

  return (
    <div className="space-y-8">
      <div className="space-y-2">
        <h1 className="text-4xl font-bold bg-gradient-to-r from-foreground to-foreground/70 bg-clip-text text-transparent">Dashboard</h1>
        <p className="text-muted-foreground">Monitor donations, impact, and campaign performance</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {kpis.map((kpi, index) => {
          const Icon = kpi.icon;
          return (
            <Card key={index} className="group overflow-hidden border-0 shadow-sm hover:shadow-md transition-all duration-300 bg-gradient-to-br from-card to-card/50">
              <CardHeader className="pb-3 space-y-2">
                <div className="flex items-center justify-between">
                  <div className="p-2.5 rounded-lg bg-primary/10 group-hover:scale-110 transition-transform">
                    <Icon className="w-5 h-5 text-primary" />
                  </div>
                  {kpi.trend === 'up' ? (
                    <Badge variant="secondary" className="gap-1"><ArrowUpRight className="w-3 h-3" />{kpi.change}%</Badge>
                  ) : (
                    <Badge variant="outline" className="gap-1 text-destructive border-destructive/30"><ArrowUpRight className="w-3 h-3 rotate-180" />{kpi.change}%</Badge>
                  )}
                </div>
                <div><p className="text-sm font-medium text-muted-foreground">{kpi.label}</p><p className="text-2xl font-bold text-foreground mt-1">{kpi.value}</p></div>
              </CardHeader>
            </Card>
          );
        })}
      </div>

      <div className="space-y-4">
        <div className="flex items-center gap-2 flex-wrap">
          {periodOptions.map((option) => (
            <Button key={option.value} variant={selectedPeriod === option.value ? 'default' : 'outline'} size="sm" onClick={() => setSelectedPeriod(option.value)} className="transition-all">{option.label}</Button>
          ))}
        </div>

        <Card className="border-0 shadow-sm">
          <CardHeader><CardTitle>Donation Trends</CardTitle><CardDescription>{periodOptions.find((p) => p.value === selectedPeriod)?.label}</CardDescription></CardHeader>
          <CardContent><DonationsLineChart data={timeSeriesData} period={periodOptions.find((p) => p.value === selectedPeriod)?.label || '30 days'} /></CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="border-0 shadow-sm">
          <CardHeader><CardTitle className="flex items-center gap-2"><DollarSign className="w-5 h-5 text-primary" />Payment Methods</CardTitle><CardDescription>Distribution breakdown</CardDescription></CardHeader>
          <CardContent><PaymentMethodsPieChart data={paymentMethodsData} /></CardContent>
        </Card>
      </div>
    </div>
  );
};

export default AdminDashboardPage;
