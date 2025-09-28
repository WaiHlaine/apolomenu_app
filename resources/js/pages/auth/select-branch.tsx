import { useForm } from '@inertiajs/react';
import { route } from 'ziggy-js';

export default function SelectBranch({ branches }: { branches: Array<{ id: number; name: string }> }) {
    const { data, setData, post, processing } = useForm({ branch_id: '' });

    const submit = (e: React.FormEvent) => {
        e.preventDefault();
        post(route('branch.store'));
    };

    return (
        <div className="mx-auto mt-10 max-w-md">
            <h1 className="mb-4 text-xl font-bold">Select Your Branch</h1>
            <form onSubmit={submit} className="flex flex-col gap-4">
                <select value={data.branch_id} onChange={(e) => setData('branch_id', e.target.value)} className="rounded border p-2">
                    <option value="">-- Select Branch --</option>
                    {branches.map((branch) => (
                        <option key={branch.id} value={branch.id}>
                            {branch.name}
                        </option>
                    ))}
                </select>

                <button type="submit" disabled={processing || !data.branch_id} className="rounded bg-blue-500 px-4 py-2 text-white">
                    Continue
                </button>
            </form>
        </div>
    );
}
