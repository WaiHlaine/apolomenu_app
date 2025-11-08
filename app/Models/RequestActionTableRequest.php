<?php

namespace App\Models;

use App\Models\Scopes\BranchScope;
use Illuminate\Database\Eloquent\Model;

class RequestActionTableRequest extends Model
{
    protected $fillable = [
        'table_id',
        'request_action_id',
        'status',
        'branch_id',
    ];

    public function table()
    {
        return $this->belongsTo(Table::class);
    }

    public function requestAction()
    {
        return $this->belongsTo(RequestAction::class);
    }

    // global scope
    public static function booted()
    {
        static::addGlobalScope(new BranchScope);
    }
}
