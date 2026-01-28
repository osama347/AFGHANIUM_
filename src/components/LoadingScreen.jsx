import React from 'react';

const LoadingScreen = () => {
    return (
        <div className="fixed inset-0 bg-white z-50 flex items-center justify-center">
            <div className="text-center">
                <div className="animate-spin rounded-full h-16 w-16 border-4 border-primary border-t-transparent mx-auto mb-4"></div>
                <p className="text-gray-600 font-medium">Loading...</p>
            </div>
        </div>
    );
};

export default LoadingScreen;
