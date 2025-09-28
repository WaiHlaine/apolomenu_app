import RequestActionDialog from './RequestActionDialog';
import Search from './Search';

export default function TableAndRequestAction() {
    return (
        <div className="flex items-center justify-between px-4 py-2">
            <div className="flex items-center gap-4">
                <Search />
                <div>
                    <p className="text-lg font-bold">table name</p>
                </div>
            </div>
            <div className="flex items-center gap-2">
                <div>language</div>
                <div>
                    <RequestActionDialog />
                </div>
            </div>
        </div>
    );
}
