<?php

namespace App\Http\Requests\Table;

use Illuminate\Foundation\Http\FormRequest;

class DownloadQrCodeRequest extends FormRequest
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
            'tables' => 'required|array|min:1',
            'tables.*' => 'integer|exists:tables,id',
        ];
    }
}
