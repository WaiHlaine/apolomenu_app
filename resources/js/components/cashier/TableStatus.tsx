export default function TableStatus() {
    return (
        <div className="flex gap-2">
            <div className="flex items-center gap-2">
                <div className="h-3 w-3 rounded-full border bg-white"></div>
                <span>Available</span>
            </div>

            <div className="flex items-center gap-2">
                <div className="h-3 w-3 rounded-full border bg-yellow-600"></div>
                <span>Not Available</span>
            </div>
        </div>
    );
}
