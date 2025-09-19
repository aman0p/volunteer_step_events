export default function AdminNotFound() {
   return (
      <div className="flex min-h-[calc(100vh-80px)] flex-col items-center justify-center">
         <div className="space-y-6 text-center">
            <div className="space-y-2">
               <h1 className="text-6xl font-bold text-gray-300">404</h1>
               <h2 className="text-2xl font-semibold text-gray-700">
                  Page Not Found
               </h2>
            </div>

            <p className="max-w-md text-gray-600">
               The page you're looking for doesn't exist in the admin dashboard.
            </p>

            <div className="flex justify-center gap-4">
               <a
                  href="/admin"
                  className="rounded-lg bg-blue-600 px-6 py-3 font-medium text-white transition-colors hover:bg-blue-700"
               >
                  Go to Dashboard
               </a>
               <a
                  href="/"
                  className="rounded-lg border border-gray-300 px-6 py-3 font-medium text-gray-700 transition-colors hover:bg-gray-50"
               >
                  Go Home
               </a>
            </div>
         </div>
      </div>
   );
}
