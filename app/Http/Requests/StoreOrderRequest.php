<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class StoreOrderRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true; // adjust if you need authentication
    }

    public function rules(): array
    {
        return [
            'branchId' => 'required|exists:branches,id',
            'tablePublicToken' => 'string',
            'orderType' => 'required|in:dine_in,takeout',
            'lat' => 'nullable|numeric',
            'long' => 'nullable|numeric',
            'notes' => 'nullable|string',

            'items' => 'required|array|min:1',
            'items.*.menuItemId' => 'required|exists:menu_items,id',
            'items.*.variantId' => 'nullable|exists:menu_item_variants,id',
            'items.*.quantity' => 'required|integer|min:1',
            'items.*.notes' => 'nullable|string',
        ];
    }
}
