import { Badge } from './ui/badge';

export default function OrderStatusBadge({ status }: { status: string }) {
    let badgeVariant: 'default' | 'destructive' | 'secondary' | 'outline' | null | undefined = 'default';
    if (status === 'pending') {
        badgeVariant = 'secondary';
    } else if (status === 'completed') {
        badgeVariant = 'outline';
    } else if (status === 'cancelled') {
        badgeVariant = 'destructive';
    } else {
        badgeVariant = 'default';
    }

    return (
        <Badge className="capitalize" variant={badgeVariant}>
            {status}
        </Badge>
    );
}
