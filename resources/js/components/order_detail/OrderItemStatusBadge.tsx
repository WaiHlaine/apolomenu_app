export default function OrderItemStatusBadge({ status }: { status: string }) {
    let bgColor = 'bg-gray-200';
    let textColor = 'text-gray-800';

    switch (status.toLowerCase()) {
        case 'pending':
            bgColor = 'bg-yellow-100';
            textColor = 'text-yellow-800';
            break;
        case 'ready':
            bgColor = 'bg-green-100';
            textColor = 'text-green-800';
            break;
        case 'canceled':
            bgColor = 'bg-red-100';
            textColor = 'text-red-800';
            break;
        case 'in progress':
            bgColor = 'bg-blue-100';
            textColor = 'text-blue-800';
            break;
        // Add more statuses as needed
    }

    return <span className={`inline-block rounded-full px-2 py-1 text-sm font-semibold capitalize ${bgColor} ${textColor}`}>{status}</span>;
}
