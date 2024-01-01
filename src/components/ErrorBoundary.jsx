import { useState, useEffect } from 'react';

const ErrorBoundary = ({ fallback, children }) => {
    const [hasError, setHasError] = useState(false);

    useEffect(() => {
        const errorHandler = (error) => {
            // 在这里可以记录错误信息到日志或发送给服务器
            console.error('Error caught by ErrorBoundary:', error);
            setHasError(true);
        };

        // 监听全局错误
        window.addEventListener('error', errorHandler);

        return () => {
            // 清理工作和移除监听器
            window.removeEventListener('error', errorHandler);
        };
    }, []);

    if (hasError) {
        // 渲染备用 UI
        return fallback();
    }

    // 如果没有错误，正常渲染子组件
    return children;
};

export default ErrorBoundary;
