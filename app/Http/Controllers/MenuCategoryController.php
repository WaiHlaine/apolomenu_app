<?php

namespace App\Http\Controllers;

use App\Enums\SessionKeys;
use App\Http\Requests\MenuCategory\CreateMenuCategoryRequest;
use App\Http\Requests\MenuCategory\UpdateMenuCategoryRequest;
use App\Http\Resources\BadgeResource;
use App\Http\Resources\MenuCategoryResource;
use App\Http\Resources\MenuItemResource;
use App\Models\Badge;
use App\Models\Branch;
use App\Models\MenuCategory;
use App\Models\MenuItem;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Inertia\Inertia;

class MenuCategoryController extends Controller
{
    public function index()
    {

        // get the first category and redirect to it
        $category = MenuCategory::first();

        return redirect()->route('menu_category.show', ['id' => $category->id]);
    }

    public function store(CreateMenuCategoryRequest $request)
    {
        $validated = $request->validated();

        if ($request->hasFile('image')) {
            $path = $request->file('image')->store('menu_category', 'public');
            $validated['image'] = $path; // save relative path
        }

        $category = MenuCategory::create($validated);

        return redirect()
            ->route('menu_category.show', [
                'id' => $category->id,
            ])
            ->with('success', 'Menu category created successfully.');
    }

    // show function
    public function show(int $id)
    {
        $category = MenuCategory::findOrFail($id);
        $menuItems = MenuItem::with(['translations', 'variants', 'badges'])->where('category_id', $category->id)->get();
        $currency = Branch::where('id', session(SessionKeys::CURRENT_BRANCH_ID))->first()->currency;

        return Inertia::render('menu_category/show', [
            'category' => MenuCategoryResource::make($category),
            'menuItems' => MenuItemResource::collection($menuItems),
            'categories' => MenuCategoryResource::collection(MenuCategory::all()),
            'currency' => $currency,
            'badges' => BadgeResource::collection(Badge::all()),
        ]);
    }

    public function toggleAvailablility(Request $request)
    {
        $category = MenuCategory::find($request->id);
        $category->available = ! $category->available;
        $category->save();

        return back()->with('success', 'Updated');
        // return response()->noContent();
    }

    public function update(int $id, UpdateMenuCategoryRequest $request)
    {
        $validated = $request->validated();
        $category = MenuCategory::findOrFail($id);
        $category->name = $validated['name'];
        $category->description = $validated['description'];

        // Handle image
        if ($request->hasFile('image')) {
            // remove old image if exists
            if ($category->image && Storage::disk('public')->exists($category->image)) {
                Storage::disk('public')->delete($category->image);
            }

            $imagePath = $request->file('image')->store('menu_category', 'public');
            $category->image = $imagePath;

        } elseif (is_string($validated['image'] ?? null)) {
            // If the client sends back the existing path (string), keep it as-is
            $category->image = $validated['image'];
        }
        $category->save();

        return back()->with('success', 'Menu category updated successfully.');
    }

    public function destroy(int $id)
    {
        $category = MenuCategory::findOrFail($id);
        $category->delete();

        return redirect()
            ->route('menu_category.index')->with('success', 'Menu category deleted successfully.');
    }
}
