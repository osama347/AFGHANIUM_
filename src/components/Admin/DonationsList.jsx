
import React, { useEffect, useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDonation } from '../../hooks/useDonation';
import { updateDonationStatus } from '../../supabase/donations';
import { formatCurrency, formatDateTime } from '../../utils/formatters';
import {
  DollarSign,
  Plus,
  Download,
  Search,
  AlertTriangle,
  CheckCircle2,
  Clock,
  XCircle,
  TrendingUp,
  Filter,
  Eye,
} from 'lucide-react';
import Loader from '../Loader';
import { exportToCSV } from '../../utils/export';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/Card';
import { Button } from '../ui/Button';
import { Input } from '../ui/Input';
import { Badge } from '../ui/Badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../ui/Tabs';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '../ui/Dialog';

const DonationsList = () => {
  const navigate = useNavigate();
  const { getAll, loading } = useDonation();
  const [donations, setDonations] = useState([]);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [selectedDonation, setSelectedDonation] = useState(null);
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [showConfirmDialog, setShowConfirmDialog] = useState(false);
  const [confirmAction, setConfirmAction] = useState(null);

  useEffect(() => {
    fetchDonations();
  }, []);

  const fetchDonations = async () => {
    const result = await getAll();
    if (result.success) {
      setDonations(result.data);
    } else {
      setError(result.error);
    }
  };

  const handleApproveDonation = async () => {
    if (!selectedDonation) return;
    const result = await updateDonationStatus(selectedDonation.donation_id, 'completed');
    if (result.success) {
      fetchDonations();
      setShowConfirmDialog(false);
      setSelectedDonation(null);
    } else {
      alert('Failed to approve donation: ' + result.error);
    }
  };

  const handleRejectDonation = async () => {
    if (!selectedDonation) return;
    const result = await updateDonationStatus(selectedDonation.donation_id, 'failed');
    if (result.success) {
      fetchDonations();
      setShowConfirmDialog(false);
      setSelectedDonation(null);
    } else {
      alert('Failed to reject donation: ' + result.error);
    }
  };

  const getStatusInfo = (status) => {
    const statusMap = {
      pending: {
        badge: 'outline',
        icon: Clock,
        label: 'Pending',
        color: 'text-amber-600',
        bg: 'bg-amber-50',
      },
      completed: {
        badge: 'default',
        icon: CheckCircle2,
        label: 'Completed',
        color: 'text-green-600',
        bg: 'bg-green-50',
      },
      failed: {
        badge: 'destructive',
        icon: XCircle,
        label: 'Failed',
        color: 'text-red-600',
        bg: 'bg-red-50',
      },
      cancelled: {
        badge: 'secondary',
        icon: XCircle,
        label: 'Cancelled',
        color: 'text-gray-600',
        bg: 'bg-gray-50',
      },
    };
    return statusMap[status] || statusMap.pending;
  };

  const handleExport = () => {
    if (donations.length > 0) {
      const exportData = donations.map((d) => ({
        ID: d.donation_id,
        Donor: d.full_name,
        Email: d.email,
        Amount: d.amount,
        Payment_Method: d.payment_method.replace(/_/g, ' ').replace(/\b\w/g, (l) => l.toUpperCase()),
        Transaction_Reference: d.transaction_reference || '',
        Status: d.status,
        Date: new Date(d.created_at).toLocaleDateString(),
        Time: new Date(d.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      }));
      exportToCSV(exportData, `donations-${new Date().toISOString().split('T')[0]}.csv`);
    }
  };

  // Filter and Group Donations
  const groupedDonations = useMemo(() => {
    const filtered = donations.filter((d) => {
      if (statusFilter !== 'all' && d.status !== statusFilter) {
        return false;
      }

      const searchLower = searchTerm.toLowerCase();
      return (
        d.full_name.toLowerCase().includes(searchLower) ||
        d.donation_id.toLowerCase().includes(searchLower)
      );
    });

    const groups = {};
    filtered.forEach((d) => {
      const date = new Date(d.created_at).toLocaleDateString(undefined, {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric',
      });
      if (!groups[date]) {
        groups[date] = [];
      }
      groups[date].push(d);
    });

    return groups;
  }, [donations, searchTerm, statusFilter, emergencyCampaigns]);

  // Calculate donation statistics
  const donationStats = useMemo(() => {
    const stats = {
      total: donations.length,
      pending: 0,
      completed: 0,
      failed: 0,
      cancelled: 0,
    };

    donations.forEach((d) => {
      stats[d.status] = (stats[d.status] || 0) + 1;
    });

    return stats;
  }, [donations]);

  if (loading) {
    return (
      <div className="flex justify-center items-center py-20">
        <Loader size="lg" />
      </div>
    );
  }

  if (error) {
    return (
      <Card className="border-destructive/50 bg-destructive/5">
        <CardContent className="pt-6">
          <div className="flex items-center gap-3 text-destructive">
            <AlertTriangle className="w-5 h-5 flex-shrink-0" />
            <span>Error loading donations: {error}</span>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="space-y-2">
        <h1 className="text-4xl font-bold bg-gradient-to-r from-foreground to-foreground/70 bg-clip-text text-transparent">
          Donations
        </h1>
        <p className="text-muted-foreground">
          Track and manage all incoming donations with detailed analytics
        </p>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
        {[
          {
            label: 'Total Donations',
            value: donationStats.total,
            icon: DollarSign,
            color: 'primary',
          },
          {
            label: 'Pending',
            value: donationStats.pending,
            icon: Clock,
            color: 'amber',
          },
          {
            label: 'Completed',
            value: donationStats.completed,
            icon: CheckCircle2,
            color: 'green',
          },
          {
            label: 'Failed',
            value: donationStats.failed,
            icon: XCircle,
            color: 'red',
          },
          {
            label: 'Cancelled',
            value: donationStats.cancelled,
            icon: AlertTriangle,
            color: 'gray',
          },
        ].map((stat) => {
          const Icon = stat.icon;
          return (
            <Card key={stat.label} className="border-0 shadow-sm hover:shadow-md transition-all duration-300">
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <div className="p-2.5 rounded-lg bg-primary/10">
                    <Icon className="w-5 h-5 text-primary" />
                  </div>
                </div>
                <p className="text-sm font-medium text-muted-foreground">{stat.label}</p>
              </CardHeader>
              <CardContent>
                <p className="text-3xl font-bold text-foreground">{stat.value}</p>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Filters and Search */}
      <Card className="border-0 shadow-sm">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="flex items-center gap-2">
                <Filter className="w-5 h-5 text-primary" />
                Filters & Search
              </CardTitle>
              <CardDescription>Find and manage donations</CardDescription>
            </div>
            <Button
              onClick={handleExport}
              variant="outline"
              size="sm"
              className="gap-2"
            >
              <Download className="w-4 h-4" />
              Export CSV
            </Button>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Search */}
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                placeholder="Search by name or ID..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>

            {/* Status Filter */}
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="px-4 py-2 rounded-md border border-input bg-background focus:outline-none focus:ring-2 focus:ring-ring"
            >
              <option value="all">All Statuses</option>
              <option value="pending">Pending</option>
              <option value="completed">Completed</option>
              <option value="failed">Failed</option>
              <option value="cancelled">Cancelled</option>
            </select>
          </div>
        </CardContent>
      </Card>

      {/* Donations List */}
      {Object.keys(groupedDonations).length === 0 ? (
        <Card className="border-0 shadow-sm">
          <CardContent className="py-12 text-center">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-lg bg-muted mb-4">
              <DollarSign className="w-8 h-8 text-muted-foreground" />
            </div>
            <h3 className="text-lg font-semibold text-foreground mt-4">No donations found</h3>
            <p className="text-muted-foreground mt-2">Try adjusting your search or filters</p>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-6">
          {Object.entries(groupedDonations).map(([date, groupDonations]) => (
            <Card key={date} className="border-0 shadow-sm overflow-hidden">
              <CardHeader className="bg-muted/30 border-b border-border pb-3">
                <CardTitle className="text-base">{date}</CardTitle>
              </CardHeader>
              <CardContent className="pt-0">
                <div className="space-y-3">
                  {groupDonations.map((donation) => {
                    const statusInfo = getStatusInfo(donation.status);
                    const StatusIcon = statusInfo.icon;

                    return (
                      <div
                        key={donation.id}
                        className="group flex items-center justify-between p-4 rounded-lg border border-border hover:border-primary/30 hover:bg-muted/20 transition-all cursor-pointer"
                        onClick={() => {
                          setSelectedDonation(donation);
                          setShowDetailsModal(true);
                        }}
                      >
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-3">
                            <div className={`p-2 rounded-lg ${statusInfo.bg}`}>
                              <StatusIcon className={`w-5 h-5 ${statusInfo.color}`} />
                            </div>
                            <div className="flex-1 min-w-0">
                              <div className="flex items-center gap-2 mb-1">
                                <h4 className="font-semibold text-foreground truncate">
                                  {donation.full_name}
                                </h4>
                                <Badge variant={statusInfo.badge === 'default' ? 'default' : 'outline'}>
                                  {statusInfo.label}
                                </Badge>
                              </div>
                              <div className="flex items-center gap-3 text-sm text-muted-foreground">
                                <span>{donation.donation_id}</span>
                                <span>•</span>
                                <span>{donation.email}</span>
                              </div>
                            </div>
                          </div>
                        </div>

                        <div className="hidden md:flex items-center gap-4 ml-4">
                          <div className="text-right">
                            <p className="text-lg font-bold text-primary">
                              {formatCurrency(donation.amount)}
                            </p>
                            <p className="text-xs text-muted-foreground">
                              {new Date(donation.created_at).toLocaleTimeString([], {
                                hour: '2-digit',
                                minute: '2-digit',
                              })}
                            </p>
                          </div>
                        </div>

                        <Button
                          variant="ghost"
                          size="sm"
                          className="gap-2 ml-2 opacity-0 group-hover:opacity-100 transition-opacity"
                          onClick={(e) => {
                            e.stopPropagation();
                            setSelectedDonation(donation);
                            setShowDetailsModal(true);
                          }}
                        >
                          <Eye className="w-4 h-4" />
                          View
                        </Button>
                      </div>
                    );
                  })}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* Details Modal */}
      <Dialog open={showDetailsModal} onOpenChange={setShowDetailsModal}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Donation Details</DialogTitle>
            <DialogDescription>{selectedDonation?.donation_id}</DialogDescription>
          </DialogHeader>

          {selectedDonation && (
            <div className="space-y-6">
              {/* Donor Information */}
              <div className="space-y-3">
                <h4 className="font-semibold text-foreground">Donor Information</h4>
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <p className="text-muted-foreground">Full Name</p>
                    <p className="font-medium text-foreground">{selectedDonation.full_name}</p>
                  </div>
                  <div>
                    <p className="text-muted-foreground">Email</p>
                    <p className="font-medium text-foreground">{selectedDonation.email}</p>
                  </div>
                </div>
              </div>

              {/* Donation Information */}
              <div className="space-y-3">
                <h4 className="font-semibold text-foreground">Donation Information</h4>
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <p className="text-muted-foreground">Amount</p>
                    <p className="font-bold text-primary text-lg">
                      {formatCurrency(selectedDonation.amount)}
                    </p>
                  </div>
                  <div>
                    <p className="text-muted-foreground">Payment Method</p>
                    <p className="font-medium text-foreground">
                      {selectedDonation.payment_method.replace(/_/g, ' ').replace(/\b\w/g, (l) => l.toUpperCase())}
                    </p>
                  </div>
                  <div>
                    <p className="text-muted-foreground">Status</p>
                    <Badge variant={getStatusInfo(selectedDonation.status).badge === 'default' ? 'default' : 'outline'}>
                      {getStatusInfo(selectedDonation.status).label}
                    </Badge>
                  </div>
                  {selectedDonation.transaction_reference && (
                    <div className="col-span-2">
                      <p className="text-muted-foreground">Transaction Reference</p>
                      <p className="font-medium text-foreground font-mono">
                        {selectedDonation.transaction_reference}
                      </p>
                    </div>
                  )}
                </div>
              </div>

              {/* Actions */}
              <DialogFooter className="flex gap-3 pt-6 border-t border-border">
                {selectedDonation.status === 'pending' && (
                  <>
                    <Button
                      variant="outline"
                      onClick={() => {
                        setConfirmAction('reject');
                        setShowConfirmDialog(true);
                      }}
                    >
                      Reject
                    </Button>
                    <Button
                      onClick={() => {
                        setConfirmAction('approve');
                        setShowConfirmDialog(true);
                      }}
                      className="bg-green-600 hover:bg-green-700"
                    >
                      Approve
                    </Button>
                  </>
                )}

                {selectedDonation.status === 'completed' && (
                  <Button
                    onClick={() =>
                      navigate(
                        `/admin/impacts?donationId=${selectedDonation.donation_id}&donorName=${encodeURIComponent(selectedDonation.full_name)}&amount=${selectedDonation.amount}`
                      )
                    }
                    className="gap-2"
                  >
                    <Plus className="w-4 h-4" />
                    Add Impact Proof
                  </Button>
                )}

                <Button
                  variant="outline"
                  onClick={() => {
                    setShowDetailsModal(false);
                    setSelectedDonation(null);
                  }}
                >
                  Close
                </Button>
              </DialogFooter>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Confirm Dialog */}
      <Dialog open={showConfirmDialog} onOpenChange={setShowConfirmDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {confirmAction === 'approve' ? 'Approve Donation' : 'Reject Donation'}
            </DialogTitle>
            <DialogDescription>
              {confirmAction === 'approve'
                ? 'Are you sure you want to approve this donation? This will mark it as completed.'
                : 'Are you sure you want to reject this donation? This action cannot be undone.'}
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="gap-3">
            <Button
              variant="outline"
              onClick={() => {
                setShowConfirmDialog(false);
                setConfirmAction(null);
              }}
            >
              Cancel
            </Button>
            <Button
              onClick={() => {
                if (confirmAction === 'approve') {
                  handleApproveDonation();
                } else {
                  handleRejectDonation();
                }
              }}
              className={confirmAction === 'approve' ? 'bg-green-600 hover:bg-green-700' : 'bg-red-600 hover:bg-red-700'}
            >
              {confirmAction === 'approve' ? 'Approve' : 'Reject'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default DonationsList;

