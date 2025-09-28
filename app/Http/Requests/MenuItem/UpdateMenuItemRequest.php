<?php

namespace App\Http\Requests\MenuItem;

use Illuminate\Foundation\Http\FormRequest;

class UpdateMenuItemRequest extends FormRequest
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
            'image' => 'nullable',
            'variants' => 'array|nullable',
            'variants.*.name' => 'required_with:variants|string|max:255',
            'variants.*.price' => 'required_with:variants|decimal:0,2|min:0',
            'price' => 'nullable|decimal:0,2|min:0|required_without:variants',
            'badges' => 'array|nullable|min:1',
            'badges.*' => 'required|exists:badges,id',
        ];
    }

    protected function prepareForValidation()
    {
        if ($this->has('categoryId')) {
            $this->merge([
                'category_id' => $this->input('categoryId'),
            ]);
        }
    }
}
