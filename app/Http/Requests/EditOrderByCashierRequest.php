<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class EditOrderByCashierRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
        return true;
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, \Illuminate\Contracts\Validation\ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
        return [
            'tableId' => 'required|string',
            'orderType' => 'required|in:dine_in,take_out,delivery',
            'notes' => 'nullable|string',
            'items' => 'required|array|min:1',
            'items.*.menuItemId' => 'required|exists:menu_items,id',
            'items.*.variantId' => 'nullable|exists:menu_item_variants,id',
            'items.*.quantity' => 'required|integer|min:1',
            'items.*.notes' => 'nullable|string',
        ];
    }

    /**
     * Get custom error messages for validator errors.
     *
     * @return array<string, string>
     */
    public function messages(): array
    {
        return [
            'tableId.required' => 'Please select a table.',
            'tableId.string' => 'Invalid table selection.',

            'orderType.required' => 'Please select an order type.',
            'orderType.in' => 'Order type must be either dine_in or take_out.',

            'items.required' => 'Please add at least one item to the order.',
            'items.array' => 'Invalid order items format.',
            'items.min' => 'You must add at least one menu item.',

            'items.*.menuItemId.required' => 'Each item must have a menu item selected.',
            'items.*.menuItemId.exists' => 'The selected menu item does not exist.',

            'items.*.variantId.exists' => 'The selected variant does not exist.',

            'items.*.quantity.required' => 'Please specify quantity for each item.',
            'items.*.quantity.integer' => 'Quantity must be a valid number.',
            'items.*.quantity.min' => 'Quantity must be at least 1.',

            'notes.string' => 'Notes must be text.',
            'items.*.notes.string' => 'Item notes must be text.',
        ];
    }
}
