import React from 'react';

const ProgressBar = ({ current, goal, label, color = 'bg-primary' }) => {
    const percentage = Math.min((current / goal) * 100, 100);

    return (
        <div className="w-full mt-4">
            <div className="flex justify-between text-sm mb-1">
                <span className="font-semibold text-gray-700">{label}</span>
                <span className="font-bold text-primary">
                    ${current.toLocaleString()} / ${goal.toLocaleString()}
                </span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-3 overflow-hidden">
                <div
                    className={`${color} h-3 rounded-full transition-all duration-1000 ease-out`}
                    style={{ width: `${percentage}%` }}
                ></div>
            </div>
            <div className="text-right text-xs text-gray-500 mt-1">
                {Math.round(percentage)}% Funded
            </div>
        </div>
    );
};

export default ProgressBar;
