import React from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from 'recharts';
import { formatCurrency } from '../../../utils/formatters';

const PaymentMethodsPieChart = ({ data }) => {
    const COLORS = {
        'card': '#10b981',
        'paypal': '#3b82f6',
        'crypto': '#f59e0b',
        'bank': '#8b5cf6',
    };

    const CustomTooltip = ({ active, payload }) => {
        if (active && payload && payload.length) {
            return (
                <div className="bg-white p-3 rounded-lg shadow-lg border border-gray-200">
                    <p className="text-sm font-semibold text-gray-900 mb-1">
                        {payload[0].name}
                    </p>
                    <p className="text-sm text-green-600">
                        {formatCurrency(payload[0].value)}
                    </p>
                    <p className="text-sm text-gray-600">
                        {payload[0].payload.count} donations
                    </p>
                    <p className="text-sm font-semibold text-primary">
                        {payload[0].payload.percentage}%
                    </p>
                </div>
            );
        }
        return null;
    };

    const renderLabel = (entry) => {
        return `${entry.percentage}%`;
    };

    return (
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
            <h3 className="text-xl font-bold text-gray-900 mb-6">
                Payment Methods Distribution
            </h3>
            <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                    <Pie
                        data={data}
                        cx="50%"
                        cy="50%"
                        labelLine={false}
                        label={renderLabel}
                        outerRadius={100}
                        fill="#8884d8"
                        dataKey="total"
                    >
                        {data.map((entry, index) => (
                            <Cell
                                key={`cell-${index}`}
                                fill={COLORS[entry.method] || '#6b7280'}
                            />
                        ))}
                    </Pie>
                    <Tooltip content={<CustomTooltip />} />
                    <Legend
                        verticalAlign="bottom"
                        height={36}
                        formatter={(value, entry) => `${entry.payload.name} (${entry.payload.count})`}
                    />
                </PieChart>
            </ResponsiveContainer>
        </div>
    );
};

export default PaymentMethodsPieChart;
