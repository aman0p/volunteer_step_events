export default function AdminNotFound() {
    return (
        <div className="flex flex-col items-center justify-center min-h-[calc(100vh-80px)]">
            <div className="text-center space-y-6">
                <div className="space-y-2">
                    <h1 className="text-6xl font-bold text-gray-300">404</h1>
                    <h2 className="text-2xl font-semibold text-gray-700">Page Not Found</h2>
                </div>
                
                <p className="text-gray-600 max-w-md">
                    The page you're looking for doesn't exist in the admin dashboard.
                </p>
                
                <div className="flex gap-4 justify-center">
                    <a 
                        href="/admin" 
                        className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
                    >
                        Go to Dashboard
                    </a>
                    <a 
                        href="/" 
                        className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors font-medium"
                    >
                        Go Home
                    </a>
                </div>
            </div>
        </div>
    );
}
