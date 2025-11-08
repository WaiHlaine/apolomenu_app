import { ChevronDown, ChevronUp } from 'lucide-react';

type Props = {
    label: string;
    field: string;
    currentField?: string;
    currentDirection?: 'asc' | 'desc';
    onSort: (field: string) => void;
};

export function SortableHeader({ label, field, currentField, currentDirection, onSort }: Props) {
    const isActive = currentField === field;

    return (
        <button onClick={() => onSort(field)} className="group flex items-center gap-1">
            {label}
            <span className="flex flex-col">
                {/* Always render both arrows, but fade them in/out */}
                <ChevronUp
                    size={14}
                    className={`transition-opacity ${isActive && currentDirection === 'asc' ? 'opacity-100' : 'opacity-0 group-hover:opacity-40'} `}
                />
                <ChevronDown
                    size={14}
                    className={`-mt-1 transition-opacity ${isActive && currentDirection === 'desc' ? 'opacity-100' : 'opacity-0 group-hover:opacity-40'} `}
                />
            </span>
        </button>
    );
}
