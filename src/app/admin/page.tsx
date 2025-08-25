export default function AdminPage() {
    return (
        <div className="space-y-6">
            <h1 className="text-3xl font-bold">Admin Dashboard</h1>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {Array.from({ length: 20 }).map((_, i) => (
                    <div key={i} className="bg-white p-6 rounded-lg shadow-md border">
                        <h3 className="text-lg font-semibold mb-2">Card {i + 1}</h3>
                        <p className="text-gray-600">This is a sample card to demonstrate scrolling functionality.</p>
                    </div>
                ))}
            </div>
        </div>
    );
}