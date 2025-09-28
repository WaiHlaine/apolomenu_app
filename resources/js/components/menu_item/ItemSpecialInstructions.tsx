import { Textarea } from '../ui/textarea';

export default function ItemSpecialInstructions({ value, onChange }: { value: string; onChange: (value: string) => void }) {
    return (
        <div className="p-4">
            <p className="text-lg font-bold">Special instructions</p>
            <p className="text-gray-500">Please let us know if you are allergic to anything or if we need to avoid anything.</p>
            <Textarea rows={6} value={value} onChange={(e) => onChange(e.target.value)} className="mt-4" placeholder="eg. No onions, please" />
        </div>
    );
}
