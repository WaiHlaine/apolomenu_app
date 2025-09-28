<?php

namespace App\Http\Controllers;

use App\Enums\SessionKeys;
use App\Http\Requests\Table\DeleteTableRequest;
use App\Http\Requests\Table\StoreTableRequest;
use App\Http\Requests\Table\UpdateTableRequest;
use App\Http\Resources\TableResource;
use App\Models\Branch;
use App\Models\Table;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\File;
use Illuminate\Support\Facades\Storage;
use SimpleSoftwareIO\QrCode\Facades\QrCode;

class TableController extends Controller
{
    public function index(Request $request)
    {
        $searchQuery = $request->query('search');

        $query = Table::query();
        if ($searchQuery) {
            $query->where('name', 'like', "%{$searchQuery}%");
        }

        $tables = Table::query()
            ->when($request->search, fn ($q) => $q->where('name', 'like', "%{$request->search}%"))
            ->paginate(10)
            ->withQueryString();

        return inertia('table/index', [
            'tables' => TableResource::collection($tables),
        ]);
    }

    public function create()
    {
        return inertia('tables/create');
    }

    public function store(StoreTableRequest $request)
    {
        $validated = $request->validated();

        $branchId = session(SessionKeys::CURRENT_BRANCH_ID);
        $branch = Branch::with('tenant')->findOrFail($branchId);

        $table = Table::create([
            'name' => $validated['name'],
            'qr_code' => '',
            'public_token' => uniqid(),
        ]);

        $qrString = config('app.url').'/'.$table->branch->tenant_id.'/'.$branch->id.'/'.$table->public_token.'/menus';

        $qrPath = 'tables/qrcodes/'.uniqid().'.svg';

        Storage::disk('public')->put($qrPath, QrCode::format('svg')->size(300)->generate($qrString));

        $table->update([
            'qr_code' => Storage::url($qrPath),
        ]);

        return redirect()
            ->route('tables.index')
            ->with('success', 'Table created successfully.');
    }

    public function edit(Table $table)
    {
        return inertia('tables/edit', [
            'table' => new TableResource($table->load('branch.tenant')),
        ]);
    }

    public function update(UpdateTableRequest $request, Table $table)
    {
        $validated = $request->validated();

        $table->update([
            'name' => $validated['name'],
        ]);

        return redirect()
            ->route('tables.index')
            ->with('success', 'Table updated successfully.');
    }

    public function destroy(Table $table)
    {
        if ($table->qr_code) {
            $filePath = str_replace('/storage/', '', $table->qr_code);
            Storage::disk('public')->delete($filePath);
        }

        $table->delete();

        return redirect()
            ->route('tables.index')
            ->with('success', 'Table deleted successfully.');
    }

    public function destroyMany(DeleteTableRequest $request)
    {
        $validated = $request->validated();

        DB::beginTransaction();
        try {
            Table::whereIn('id', $validated['tables'])->delete();

            DB::commit();

            return redirect()
                ->back()
                ->with('success', 'Selected tables deleted successfully.');
        } catch (\Throwable $e) {
            DB::rollBack();

            return redirect()
                ->back()
                ->withErrors(['error' => 'Failed to delete tables: '.$e->getMessage()]);
        }
    }

    public function downloadQRCodes(Request $request)
    {
        $validated = $request->validate([
            'tables' => 'required|array|min:1',
            'tables.*' => 'exists:tables,id',
        ]);

        $tables = Table::whereIn('id', $validated['tables'])
            ->with('branch.tenant')
            ->get();

        $tempDir = storage_path('app/temp_qrcodes_'.uniqid());
        File::makeDirectory($tempDir);

        foreach ($tables as $table) {
            $qrString = config('app.url').'/'.$table->branch->tenant_id.'/'.$table->branch_id.'/'.$table->id.'/menu';
            $filePath = $tempDir."/table_{$table->id}.svg";

            QrCode::format('svg')
                ->size(300)
                ->generate($qrString, $filePath);
        }

        $zipFileName = 'qrcodes_'.now()->format('Ymd_His').'.zip';
        $zipFilePath = storage_path('app/'.$zipFileName);

        $zip = new \ZipArchive;
        if ($zip->open($zipFilePath, \ZipArchive::CREATE) === true) {
            foreach (File::files($tempDir) as $file) {
                $zip->addFile($file->getPathname(), $file->getFilename());
            }
            $zip->close();
        }

        // cleanup: delete folder and files
        File::deleteDirectory($tempDir);

        return response()->download($zipFilePath)->deleteFileAfterSend(true);
    }
}
