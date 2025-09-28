<?php

namespace App\Http\Requests\MenuItem;

use Illuminate\Foundation\Http\FormRequest;

class CreateMenuItemRequest extends FormRequest
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
            'name' => 'required|string|max:255',
            'description' => 'nullable|string',
            'categoryId' => 'required|exists:menu_categories,id',
            'image' => 'nullable|image|mimes:jpeg,png,jpg,webp|max:2048', // ✅ file upload rule
            'price' => 'nullable|decimal:0,2|min:0',
            'variants' => 'array|nullable|min:1',
            'variants.*.name' => 'required|string|max:255',
            'variants.*.price' => 'required|decimal:0,2|min:0',
            'badges' => 'array|nullable|min:1',
            'badges.*' => 'required|exists:badges,id',
        ];
    }
}
