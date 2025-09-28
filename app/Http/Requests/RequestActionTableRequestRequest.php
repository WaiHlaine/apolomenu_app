<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class RequestActionTableRequestRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true; // add auth if needed
    }

    public function rules(): array
    {
        return [
            'table_id' => ['required', 'exists:tables,id'],
            'branch_id' => ['required', 'exists:branches,id'],
            'request_action_id' => ['required', 'exists:request_actions,id'],
            'status' => ['nullable', 'in:pending,seen,done'],
        ];
    }
}
