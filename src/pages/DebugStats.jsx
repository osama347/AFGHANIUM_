import React, { useState, useEffect } from 'react';
import { supabase } from '../supabase/client';

const DebugStats = () => {
    const [campaigns, setCampaigns] = useState([]);
    const [logs, setLogs] = useState([]);
    const [loading, setLoading] = useState(false);

    const addLog = (msg, type = 'info') => {
        const timestamp = new Date().toLocaleTimeString();
        setLogs(prev => [`[${timestamp}] ${type.toUpperCase()}: ${msg}`, ...prev]);
    };

    const fetchCampaigns = async () => {
        setLoading(true);
        addLog('Fetching all campaigns from table...');
        try {
            const { data, error } = await supabase
                .from('emergency_campaigns')
                .select('*')
                .order('created_at', { ascending: false });

            if (error) throw error;

            setCampaigns(data || []);
            addLog(`Fetched ${data?.length || 0} campaigns successfully`, 'success');
        } catch (err) {
            addLog(`Fetch Error: ${err.message}`, 'error');
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    const createTestCampaign = async () => {
        setLoading(true);
        addLog('Attempting to create test campaign...');

        const testData = {
            name_en: "TEST CAMPAIGN " + new Date().toLocaleTimeString(),
            description_en: "This is a debug test campaign",
            goal_amount: 1000,
            is_active: false,
            priority: 999
        };

        try {
            const { data, error } = await supabase
                .from('emergency_campaigns')
                .insert([testData])
                .select()
                .single();

            if (error) throw error;

            addLog(`Campaign created! ID: ${data.id}`, 'success');
            // Immediately fetch again to verify persistence
            await fetchCampaigns();
        } catch (err) {
            addLog(`Create Error: ${err.message}`, 'error');
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchCampaigns();
    }, []);

    return (
        <div className="p-8 max-w-4xl mx-auto">
            <h1 className="text-2xl font-bold mb-6">Campaign Debugger</h1>

            <div className="flex gap-4 mb-8">
                <button
                    onClick={fetchCampaigns}
                    className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
                    disabled={loading}
                >
                    Refresh List
                </button>
                <button
                    onClick={createTestCampaign}
                    className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600"
                    disabled={loading}
                >
                    Create Test Campaign
                </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {/* Logs Panel */}
                <div className="bg-gray-900 text-green-400 p-4 rounded-lg h-96 overflow-y-auto font-mono text-sm">
                    <h3 className="text-white font-bold mb-2 border-b border-gray-700 pb-2">Debug Logs</h3>
                    {logs.map((log, i) => (
                        <div key={i} className="mb-1">{log}</div>
                    ))}
                    {logs.length === 0 && <div className="text-gray-500">No logs yet...</div>}
                </div>

                {/* Campaigns List */}
                <div className="bg-white border rounded-lg h-96 overflow-y-auto p-4">
                    <h3 className="font-bold mb-2 border-b pb-2">Database Campaigns ({campaigns.length})</h3>
                    {campaigns.length === 0 ? (
                        <p className="text-gray-500">No campaigns found in database.</p>
                    ) : (
                        <div className="space-y-2">
                            {campaigns.map(c => (
                                <div key={c.id} className="p-2 border rounded bg-gray-50 text-sm">
                                    <div className="font-bold">{c.name_en}</div>
                                    <div className="text-xs text-gray-500">ID: {c.id}</div>
                                    <div className="text-xs text-gray-500">Active: {c.is_active ? 'YES' : 'NO'}</div>
                                    <div className="text-xs text-gray-500">Created: {new Date(c.created_at).toLocaleString()}</div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default DebugStats;
