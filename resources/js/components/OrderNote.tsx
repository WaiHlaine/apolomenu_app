export default function OrderNote({ note }: { note: string }) {
    return <p className="rounded-sm bg-red-50 p-2 text-sm text-red-500">{note}</p>;
}
