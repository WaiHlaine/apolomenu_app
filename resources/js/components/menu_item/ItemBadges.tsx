import { MenuItem } from '@/types/menu_item';
import { Badge } from '../ui/badge';

export default function ItemBadges({ badges }: { badges: MenuItem['badges'] }) {
    return (
        <div className="flex flex-wrap items-center gap-1">
            {badges.map((badge) => (
                <Badge variant={'destructive'} key={badge.id}>
                    {badge.name}
                </Badge>
            ))}
        </div>
    );
}
