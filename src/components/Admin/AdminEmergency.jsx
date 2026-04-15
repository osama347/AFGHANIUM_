import React, { useEffect, useMemo, useState } from 'react';
import { useEmergencyCampaign } from '../../hooks/useEmergencyCampaign';
import { formatCurrency, formatDateTime } from '../../utils/formatters';
import {
    Plus,
    Edit2,
    Trash2,
    Eye,
    EyeOff,
    AlertTriangle,
    Target,
    Heart,
    Search,
    Calendar,
} from 'lucide-react';
import Loader from '../Loader';
import { useToast } from '../../contexts/ToastContext';
import { Button } from '../ui/Button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '../ui/Card';
import { Badge } from '../ui/Badge';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
} from '../ui/Dialog';
import { Input } from '../ui/Input';
import { Label } from '../ui/Label';
import { Textarea } from '../ui/FormElements';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../ui/Tabs';
import { Alert, AlertDescription, AlertTitle } from '../ui/Alert';
import { cn } from '../../lib/utils';

const toDateInputValue = (value) => {
    if (!value) return '';
    return String(value).split('T')[0];
};

const getInitialFormValues = (campaign = null) => ({
    name_en: campaign?.name_en || '',
    name_dari: campaign?.name_dari || '',
    name_pashto: campaign?.name_pashto || '',
    description_en: campaign?.description_en || '',
    description_dari: campaign?.description_dari || '',
    description_pashto: campaign?.description_pashto || '',
    impact_message_en: campaign?.impact_message_en || '',
    impact_message_dari: campaign?.impact_message_dari || '',
    impact_message_pashto: campaign?.impact_message_pashto || '',
    icon: campaign?.icon || '🚨',
    goal_amount: campaign?.goal_amount || '',
    urgent_until: toDateInputValue(campaign?.urgent_until),
    priority: campaign?.priority || 1,
});

const CampaignForm = ({
    mode,
    initialValues,
    onSubmit,
    onCancel,
    isSubmitting,
}) => {
    const [form, setForm] = useState(initialValues);

    useEffect(() => {
        setForm(initialValues);
    }, [initialValues]);

    const isEditMode = mode === 'edit';

    const handleChange = (field, value) => {
        setForm((prev) => ({ ...prev, [field]: value }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        onSubmit({
            ...form,
            goal_amount: parseFloat(form.goal_amount) || 0,
            priority: parseInt(form.priority, 10) || 1,
            urgent_until: form.urgent_until || null,
        });
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
                <div className="space-y-2">
                    <Label htmlFor="name_en">Campaign Name (English) *</Label>
                    <Input
                        id="name_en"
                        required
                        value={form.name_en}
                        onChange={(e) => handleChange('name_en', e.target.value)}
                        placeholder="Herat Earthquake Relief"
                    />
                </div>
                <div className="space-y-2">
                    <Label htmlFor="name_dari">Campaign Name (Dari)</Label>
                    <Input
                        id="name_dari"
                        dir="rtl"
                        value={form.name_dari}
                        onChange={(e) => handleChange('name_dari', e.target.value)}
                        placeholder="نام کمپین"
                    />
                </div>
                <div className="space-y-2">
                    <Label htmlFor="name_pashto">Campaign Name (Pashto)</Label>
                    <Input
                        id="name_pashto"
                        dir="rtl"
                        value={form.name_pashto}
                        onChange={(e) => handleChange('name_pashto', e.target.value)}
                        placeholder="د کمپاین نوم"
                    />
                </div>
            </div>

            <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
                <div className="space-y-2">
                    <Label htmlFor="description_en">Description (English) *</Label>
                    <Textarea
                        id="description_en"
                        required
                        rows={4}
                        value={form.description_en}
                        onChange={(e) => handleChange('description_en', e.target.value)}
                        placeholder="Emergency aid for families affected by..."
                    />
                </div>
                <div className="space-y-2">
                    <Label htmlFor="description_dari">Description (Dari)</Label>
                    <Textarea
                        id="description_dari"
                        rows={4}
                        dir="rtl"
                        value={form.description_dari}
                        onChange={(e) => handleChange('description_dari', e.target.value)}
                        placeholder="توضیحات"
                    />
                </div>
                <div className="space-y-2">
                    <Label htmlFor="description_pashto">Description (Pashto)</Label>
                    <Textarea
                        id="description_pashto"
                        rows={4}
                        dir="rtl"
                        value={form.description_pashto}
                        onChange={(e) => handleChange('description_pashto', e.target.value)}
                        placeholder="توضیحات"
                    />
                </div>
            </div>

            <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
                <div className="space-y-2">
                    <Label htmlFor="impact_message_en">Impact Message (English)</Label>
                    <Input
                        id="impact_message_en"
                        value={form.impact_message_en}
                        onChange={(e) => handleChange('impact_message_en', e.target.value)}
                        placeholder="Your $50 provides emergency shelter..."
                    />
                </div>
                <div className="space-y-2">
                    <Label htmlFor="impact_message_dari">Impact Message (Dari)</Label>
                    <Input
                        id="impact_message_dari"
                        dir="rtl"
                        value={form.impact_message_dari}
                        onChange={(e) => handleChange('impact_message_dari', e.target.value)}
                        placeholder="پیام تاثیر"
                    />
                </div>
                <div className="space-y-2">
                    <Label htmlFor="impact_message_pashto">Impact Message (Pashto)</Label>
                    <Input
                        id="impact_message_pashto"
                        dir="rtl"
                        value={form.impact_message_pashto}
                        onChange={(e) => handleChange('impact_message_pashto', e.target.value)}
                        placeholder="د اغیزې پیغام"
                    />
                </div>
            </div>

            <div className="grid grid-cols-1 gap-4 md:grid-cols-4">
                <div className="space-y-2">
                    <Label htmlFor="icon">Icon (Emoji) *</Label>
                    <Input
                        id="icon"
                        required
                        maxLength={4}
                        className="text-center text-xl"
                        value={form.icon}
                        onChange={(e) => handleChange('icon', e.target.value)}
                        placeholder="🚨"
                    />
                </div>
                <div className="space-y-2">
                    <Label htmlFor="goal_amount">Goal Amount ($) *</Label>
                    <Input
                        id="goal_amount"
                        type="number"
                        required
                        min="1"
                        step="0.01"
                        value={form.goal_amount}
                        onChange={(e) => handleChange('goal_amount', e.target.value)}
                    />
                </div>
                <div className="space-y-2">
                    <Label htmlFor="urgent_until">Expires On (Optional)</Label>
                    <Input
                        id="urgent_until"
                        type="date"
                        value={form.urgent_until}
                        onChange={(e) => handleChange('urgent_until', e.target.value)}
                    />
                </div>
                <div className="space-y-2">
                    <Label htmlFor="priority">Priority (1 = High)</Label>
                    <Input
                        id="priority"
                        type="number"
                        min="1"
                        value={form.priority}
                        onChange={(e) => handleChange('priority', e.target.value)}
                    />
                </div>
            </div>

            <div className="flex flex-col-reverse justify-end gap-2 border-t pt-4 sm:flex-row">
                <Button type="button" variant="outline" onClick={onCancel}>
                    Cancel
                </Button>
                <Button type="submit" disabled={isSubmitting}>
                    {isSubmitting ? (isEditMode ? 'Saving...' : 'Creating...') : isEditMode ? 'Save Changes' : 'Create Campaign'}
                </Button>
            </div>
        </form>
    );
};

const AdminEmergency = () => {
    const { getAll, toggleVisibility, remove, create, update, loading } = useEmergencyCampaign();
    const [campaigns, setCampaigns] = useState([]);
    const [showCreateDialog, setShowCreateDialog] = useState(false);
    const [editingCampaign, setEditingCampaign] = useState(null);
    const [loadingStates, setLoadingStates] = useState({});
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');
    const { showToast } = useToast();

    useEffect(() => {
        fetchCampaigns();
    }, []);

    const fetchCampaigns = async () => {
        const result = await getAll();
        if (result.success) {
            setCampaigns(result.data || []);
            return;
        }

        showToast('Failed to load campaigns: ' + (result.error || 'Unknown error'), 'error');
    };

    const now = new Date();
    const stats = useMemo(() => {
        const totalRaised = campaigns.reduce((sum, c) => sum + Number(c.current_amount || 0), 0);
        const totalGoal = campaigns.reduce((sum, c) => sum + Number(c.goal_amount || 0), 0);
        const activeCount = campaigns.filter((c) => c.is_active).length;
        const urgentCount = campaigns.filter((c) => c.urgent_until && new Date(c.urgent_until) > now).length;

        return {
            totalRaised,
            totalGoal,
            activeCount,
            urgentCount,
        };
    }, [campaigns, now]);

    const getVisibleCampaigns = (tabValue) => {
        const term = searchTerm.trim().toLowerCase();

        return campaigns
            .filter((campaign) => {
                const isExpired = campaign.urgent_until && new Date(campaign.urgent_until) < now;
                const inTab =
                    tabValue === 'all' ||
                    (tabValue === 'active' && campaign.is_active) ||
                    (tabValue === 'inactive' && !campaign.is_active) ||
                    (tabValue === 'expired' && isExpired);

                const inSearch =
                    !term ||
                    [
                        campaign.name_en,
                        campaign.name_dari,
                        campaign.name_pashto,
                        campaign.description_en,
                    ]
                        .filter(Boolean)
                        .some((value) => String(value).toLowerCase().includes(term));

                return inTab && inSearch;
            })
            .sort((a, b) => {
                const priorityA = Number(a.priority || 999);
                const priorityB = Number(b.priority || 999);
                if (priorityA !== priorityB) return priorityA - priorityB;
                return new Date(b.created_at || 0) - new Date(a.created_at || 0);
            });
    };

    const handleToggleVisibility = async (id, currentStatus) => {
        setLoadingStates(prev => ({ ...prev, [`toggle_${id}`]: true }));

        setCampaigns(prev =>
            prev.map(c => c.id === id ? { ...c, is_active: !currentStatus } : c)
        );

        const result = await toggleVisibility(id, !currentStatus);

        setLoadingStates(prev => ({ ...prev, [`toggle_${id}`]: false }));

        if (result.success) {
            if (result.data) {
                setCampaigns(prev =>
                    prev.map(c => c.id === id ? { ...c, is_active: result.data.is_active } : c)
                );
            }
            showToast(
                !currentStatus ? 'Campaign now showing on homepage!' : 'Campaign hidden from homepage',
                'success'
            );
        } else {
            // Revert on failure
            setCampaigns(prev =>
                prev.map(c => c.id === id ? { ...c, is_active: currentStatus } : c)
            );
            showToast('Failed to update campaign visibility', 'error');
        }
    };

    const handleDelete = async (id) => {
        if (!confirm('Are you sure you want to delete this campaign?')) return;

        setLoadingStates(prev => ({ ...prev, [`delete_${id}`]: true }));
        const deletedCampaign = campaigns.find(c => c.id === id);
        setCampaigns(prev => prev.filter(c => c.id !== id));
        const result = await remove(id);
        setLoadingStates(prev => ({ ...prev, [`delete_${id}`]: false }));

        if (result.success) {
            showToast('Campaign deleted successfully', 'success');
        } else {
            if (deletedCampaign) {
                setCampaigns(prev => [...prev, deletedCampaign]);
            }
            showToast('Failed to delete campaign', 'error');
        }
    };

    const handleCreateCampaign = async (payload) => {
        setIsSubmitting(true);

        const campaignData = {
            ...payload,
            is_active: false,
        };

        const result = await create(campaignData);
        setIsSubmitting(false);

        if (result.success) {
            showToast('Campaign created successfully!', 'success');
            setShowCreateDialog(false);
            if (result.data) {
                setCampaigns((prev) => [result.data, ...prev]);
            } else {
                fetchCampaigns();
            }
            return;
        }

        showToast('Failed to create campaign: ' + (result.error || 'Unknown error'), 'error');
    };

    const handleEditCampaign = async (payload) => {
        if (!editingCampaign) return;

        setIsSubmitting(true);
        const previousCampaign = editingCampaign;
        const campaignId = editingCampaign.id;

        setCampaigns((prev) =>
            prev.map((campaign) =>
                campaign.id === campaignId ? { ...campaign, ...payload } : campaign
            )
        );

        const result = await update(campaignId, payload);
        setIsSubmitting(false);

        if (result.success) {
            showToast('Campaign updated successfully!', 'success');
            setEditingCampaign(null);
            if (result.data) {
                setCampaigns((prev) =>
                    prev.map((campaign) =>
                        campaign.id === result.data.id ? result.data : campaign
                    )
                );
            }
            return;
        }

        setCampaigns((prev) =>
            prev.map((campaign) =>
                campaign.id === previousCampaign.id ? previousCampaign : campaign
            )
        );
        showToast('Failed to update campaign: ' + (result.error || 'Unknown error'), 'error');
    };


    if (loading && campaigns.length === 0) {
        return (
            <div className="flex justify-center py-12">
                <Loader size="lg" />
            </div>
        );
    }

    return (
        <div className="space-y-6">
            <Card className="border-red-200 bg-gradient-to-r from-red-50 via-white to-orange-50">
                <CardHeader className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                    <div>
                        <CardTitle className="text-2xl">Emergency Campaigns</CardTitle>
                        <CardDescription>
                            Manage urgent relief campaigns visible on the homepage.
                        </CardDescription>
                    </div>
                    <Button onClick={() => setShowCreateDialog(true)} className="gap-2">
                        <Plus className="h-4 w-4" />
                        New Campaign
                    </Button>
                </CardHeader>
                <CardContent>
                    <div className="grid gap-4 md:grid-cols-4">
                        <Card>
                            <CardHeader className="pb-2">
                                <CardDescription>Total Raised</CardDescription>
                                <CardTitle className="text-xl">{formatCurrency(stats.totalRaised)}</CardTitle>
                            </CardHeader>
                        </Card>
                        <Card>
                            <CardHeader className="pb-2">
                                <CardDescription>Total Goal</CardDescription>
                                <CardTitle className="text-xl">{formatCurrency(stats.totalGoal)}</CardTitle>
                            </CardHeader>
                        </Card>
                        <Card>
                            <CardHeader className="pb-2">
                                <CardDescription>Live Campaigns</CardDescription>
                                <CardTitle className="text-xl">{stats.activeCount}</CardTitle>
                            </CardHeader>
                        </Card>
                        <Card>
                            <CardHeader className="pb-2">
                                <CardDescription>Not Expired</CardDescription>
                                <CardTitle className="text-xl">{stats.urgentCount}</CardTitle>
                            </CardHeader>
                        </Card>
                    </div>
                </CardContent>
            </Card>

            <Tabs defaultValue="all" className="space-y-4">
                <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
                    <TabsList>
                        <TabsTrigger value="all">All</TabsTrigger>
                        <TabsTrigger value="active">Active</TabsTrigger>
                        <TabsTrigger value="inactive">Inactive</TabsTrigger>
                        <TabsTrigger value="expired">Expired</TabsTrigger>
                    </TabsList>
                    <div className="relative w-full md:w-80">
                        <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                        <Input
                            placeholder="Search campaigns..."
                            className="pl-9"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>
                </div>

                {['all', 'active', 'inactive', 'expired'].map((tab) => {
                    const visibleCampaigns = getVisibleCampaigns(tab);

                    return (
                        <TabsContent key={tab} value={tab}>
                            {visibleCampaigns.length === 0 ? (
                                <Alert className="border-dashed">
                                    <AlertTriangle className="h-4 w-4" />
                                    <AlertTitle>No campaigns found</AlertTitle>
                                    <AlertDescription>
                                        Try a different filter or create a new emergency campaign.
                                    </AlertDescription>
                                </Alert>
                            ) : (
                                <div className="grid grid-cols-1 gap-4 lg:grid-cols-2 2xl:grid-cols-3">
                                    {visibleCampaigns.map((campaign) => {
                                        const percentage = Number(campaign.progress_percentage || 0);
                                        const raised = Number(campaign.current_amount || 0);
                                        const isExpired = campaign.urgent_until && new Date(campaign.urgent_until) < now;

                                        return (
                                            <Card
                                                key={campaign.id}
                                                className={cn(
                                                    'overflow-hidden transition-shadow hover:shadow-md',
                                                    campaign.is_active && 'border-red-300',
                                                    isExpired && 'opacity-75'
                                                )}
                                            >
                                                <CardHeader className="space-y-3">
                                                    <div className="flex items-start justify-between gap-3">
                                                        <div className="flex items-start gap-3">
                                                            <div className="rounded-md bg-red-50 p-2 text-2xl">
                                                                {campaign.icon || '🚨'}
                                                            </div>
                                                            <div>
                                                                <CardTitle className="text-lg">{campaign.name_en}</CardTitle>
                                                                <CardDescription>
                                                                    Priority {campaign.priority || 1}
                                                                </CardDescription>
                                                            </div>
                                                        </div>
                                                        <div className="flex flex-wrap items-center justify-end gap-2">
                                                            {campaign.is_active ? (
                                                                <Badge className="gap-1 bg-green-600 text-white">
                                                                    <Eye className="h-3 w-3" />
                                                                    Live
                                                                </Badge>
                                                            ) : (
                                                                <Badge variant="secondary">Hidden</Badge>
                                                            )}
                                                            {isExpired && (
                                                                <Badge className="gap-1 bg-amber-500 text-white">
                                                                    <AlertTriangle className="h-3 w-3" />
                                                                    Expired
                                                                </Badge>
                                                            )}
                                                        </div>
                                                    </div>

                                                    <p className="line-clamp-2 text-sm text-muted-foreground">
                                                        {campaign.description_en}
                                                    </p>
                                                </CardHeader>

                                                <CardContent className="space-y-4">
                                                    <div className="grid grid-cols-3 gap-3 text-sm">
                                                        <div>
                                                            <p className="text-muted-foreground">Goal</p>
                                                            <p className="font-semibold">{formatCurrency(campaign.goal_amount)}</p>
                                                        </div>
                                                        <div>
                                                            <p className="text-muted-foreground">Raised</p>
                                                            <p className="font-semibold text-emerald-600">{formatCurrency(raised)}</p>
                                                        </div>
                                                        <div>
                                                            <p className="text-muted-foreground">Progress</p>
                                                            <p className="font-semibold">{Math.round(percentage)}%</p>
                                                        </div>
                                                    </div>

                                                    <div className="space-y-1">
                                                        <div className="h-2 w-full overflow-hidden rounded-full bg-muted">
                                                            <div
                                                                className="h-full rounded-full bg-gradient-to-r from-red-500 to-red-700 transition-all"
                                                                style={{ width: `${Math.min(percentage, 100)}%` }}
                                                            />
                                                        </div>
                                                        <div className="flex items-center justify-between text-xs text-muted-foreground">
                                                            <span className="inline-flex items-center gap-1">
                                                                <Heart className="h-3 w-3" />
                                                                {campaign.donation_count || 0} donations
                                                            </span>
                                                            {campaign.urgent_until && (
                                                                <span className="inline-flex items-center gap-1">
                                                                    <Calendar className="h-3 w-3" />
                                                                    {formatDateTime(campaign.urgent_until)}
                                                                </span>
                                                            )}
                                                        </div>
                                                    </div>
                                                </CardContent>

                                                <CardFooter className="grid grid-cols-3 gap-2 pt-2">
                                                    <Button
                                                        size="sm"
                                                        variant={campaign.is_active ? 'secondary' : 'default'}
                                                        onClick={() => handleToggleVisibility(campaign.id, campaign.is_active)}
                                                        disabled={loadingStates[`toggle_${campaign.id}`]}
                                                        className="gap-1"
                                                        title={campaign.is_active ? 'Hide from homepage' : 'Show on homepage'}
                                                    >
                                                        {campaign.is_active ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                                                        {loadingStates[`toggle_${campaign.id}`] ? '...' : campaign.is_active ? 'Hide' : 'Show'}
                                                    </Button>

                                                    <Button
                                                        size="sm"
                                                        variant="outline"
                                                        onClick={() => setEditingCampaign(campaign)}
                                                        className="gap-1"
                                                    >
                                                        <Edit2 className="h-4 w-4" />
                                                        Edit
                                                    </Button>

                                                    <Button
                                                        size="sm"
                                                        variant="destructive"
                                                        onClick={() => handleDelete(campaign.id)}
                                                        disabled={loadingStates[`delete_${campaign.id}`]}
                                                        className="gap-1"
                                                    >
                                                        <Trash2 className="h-4 w-4" />
                                                        {loadingStates[`delete_${campaign.id}`] ? '...' : 'Delete'}
                                                    </Button>
                                                </CardFooter>
                                            </Card>
                                        );
                                    })}
                                </div>
                            )}
                        </TabsContent>
                    );
                })}
            </Tabs>

            <Dialog open={showCreateDialog} onOpenChange={setShowCreateDialog}>
                <DialogContent className="max-h-[90vh] max-w-5xl overflow-y-auto">
                    <DialogHeader>
                        <DialogTitle className="inline-flex items-center gap-2 text-2xl">
                            <Target className="h-5 w-5 text-red-600" />
                            Create Emergency Campaign
                        </DialogTitle>
                        <DialogDescription>
                            Fields with * are required. New campaigns are hidden by default.
                        </DialogDescription>
                    </DialogHeader>

                    <CampaignForm
                        mode="create"
                        initialValues={getInitialFormValues()}
                        onSubmit={handleCreateCampaign}
                        onCancel={() => setShowCreateDialog(false)}
                        isSubmitting={isSubmitting}
                    />
                </DialogContent>
            </Dialog>

            <Dialog open={Boolean(editingCampaign)} onOpenChange={(open) => !open && setEditingCampaign(null)}>
                <DialogContent className="max-h-[90vh] max-w-5xl overflow-y-auto">
                    <DialogHeader>
                        <DialogTitle className="inline-flex items-center gap-2 text-2xl">
                            <Edit2 className="h-5 w-5 text-blue-600" />
                            Edit Campaign
                        </DialogTitle>
                        <DialogDescription>
                            Update campaign details and save changes.
                        </DialogDescription>
                    </DialogHeader>

                    <CampaignForm
                        mode="edit"
                        initialValues={getInitialFormValues(editingCampaign)}
                        onSubmit={handleEditCampaign}
                        onCancel={() => setEditingCampaign(null)}
                        isSubmitting={isSubmitting}
                    />
                </DialogContent>
            </Dialog>
        </div>
    );
};

export default AdminEmergency;
