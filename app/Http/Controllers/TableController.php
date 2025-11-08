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

        // Ensure directory exists
        Storage::disk('public')->makeDirectory('tables/qrcodes');

        $qrPath = 'tables/qrcodes/'.uniqid().'.svg';

        $svg = QrCode::format('svg')->size(300)->generate($qrString);
        Storage::disk('public')->put($qrPath, $svg);

        $table->update([
            'qr_code' => $qrPath, // store relative path, not URL
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

        DB::transaction(function () use ($validated) {
            $tables = Table::whereIn('id', $validated['tables'])->get();

            foreach ($tables as $table) {
                if ($table->qr_code && Storage::disk('public')->exists($table->qr_code)) {
                    Storage::disk('public')->delete($table->qr_code);
                }
                $table->delete();
            }
        });

        return redirect()->back()->with('success', 'Selected tables deleted successfully.');
    }

    public function downloadQRCodes(Request $request)
    {
        $validated = $request->validate([
            'tables' => 'required|array|min:1',
            'tables.*' => 'exists:tables,id',
        ]);

        $tables = Table::whereIn('id', $validated['tables'])->get();

        $zipFileName = 'qrcodes_'.now()->format('Ymd_His').'.zip';
        $zipFilePath = storage_path('app/'.$zipFileName);

        $zip = new \ZipArchive;
        if ($zip->open($zipFilePath, \ZipArchive::CREATE) !== true) {
            abort(500, 'Could not create ZIP file.');
        }

        foreach ($tables as $table) {
            $svgPath = storage_path('app/public/'.str_replace('/storage/', '', $table->qr_code));
            $pngFileName = "{$table->name}.png";

            if (! File::exists($svgPath)) {
                continue; // skip missing SVGs
            }

            $pngContent = shell_exec('rsvg-convert -w 300 -h 300 '.escapeshellarg($svgPath));

            if ($pngContent) {
                $zip->addFromString($pngFileName, $pngContent);
            }
        }

        $zip->close();

        if (! File::exists($zipFilePath)) {
            abort(500, 'ZIP file was not created.');
        }

        return response()->download($zipFilePath)->deleteFileAfterSend(true);
    }

    public function downloadSingleQRCode($id)
    {
        $table = Table::findOrFail($id);

        // Build path to the stored SVG
        $svgPath = storage_path('app/public/'.str_replace('/storage/', '', $table->qr_code));

        if (! File::exists($svgPath)) {
            abort(404, 'QR code file not found.');
        }

        // Convert SVG to PNG
        $pngContent = shell_exec('rsvg-convert -w 300 -h 300 '.escapeshellarg($svgPath));

        if (! $pngContent) {
            abort(500, 'Failed to convert QR code.');
        }

        // Save temporarily for download
        $pngFileName = "{$table->name}.png";
        $tmpPath = storage_path("app/{$pngFileName}");
        File::put($tmpPath, $pngContent);

        return response()->download($tmpPath)->deleteFileAfterSend(true);
    }
}
