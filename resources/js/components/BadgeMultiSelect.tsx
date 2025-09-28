import { Button } from '@/components/ui/button';
import { Command, CommandGroup, CommandItem, CommandList } from '@/components/ui/command';
import { Label } from '@/components/ui/label';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { cn } from '@/lib/utils';
import { Badge } from '@/types/menu_item';
import { Check, ChevronsUpDown } from 'lucide-react';
import { useFormContext } from 'react-hook-form';

interface BadgeSelectProps {
    badges: Badge[];
}

export function BadgeMultiSelect({ badges }: BadgeSelectProps) {
    const { watch, setValue } = useFormContext();
    const selectedBadges = watch('badges') || [];

    return (
        <div>
            <Label>Badges</Label>
            <Popover>
                <PopoverTrigger asChild>
                    <Button variant="outline" role="combobox" className="w-full flex-wrap justify-start gap-1">
                        {selectedBadges.length > 0 ? (
                            <div className="flex flex-wrap gap-1">
                                {selectedBadges.map((id: string) => {
                                    const badge = badges.find((b) => b.id.toString() === id);
                                    return badge ? (
                                        <span key={id} className="rounded-full bg-gray-200 px-2 py-0.5 text-sm">
                                            {badge.name}
                                        </span>
                                    ) : null;
                                })}
                            </div>
                        ) : (
                            <span className="opacity-50">Select badges</span>
                        )}
                        <ChevronsUpDown className="ml-auto h-4 w-4 shrink-0 opacity-50" />
                    </Button>
                </PopoverTrigger>
                <PopoverContent className="w-full p-0">
                    <Command>
                        <CommandList>
                            <CommandGroup>
                                {badges.map((badge: Badge) => {
                                    const selected = selectedBadges.includes(badge.id.toString());
                                    return (
                                        <CommandItem
                                            key={badge.id}
                                            value={badge.id.toString()}
                                            onSelect={() => {
                                                if (selected) {
                                                    setValue(
                                                        'badges',
                                                        selectedBadges.filter((id: string) => id !== badge.id.toString()),
                                                    );
                                                } else {
                                                    setValue('badges', [...selectedBadges, badge.id.toString()]);
                                                }
                                            }}
                                        >
                                            <Check className={cn('mr-2 h-4 w-4', selected ? 'opacity-100' : 'opacity-0')} />
                                            {badge.name}
                                        </CommandItem>
                                    );
                                })}
                            </CommandGroup>
                        </CommandList>
                    </Command>
                </PopoverContent>
            </Popover>
        </div>
    );
}
