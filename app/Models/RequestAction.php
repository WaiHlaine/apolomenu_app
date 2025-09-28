<?php

namespace App\Models;

use App\Enums\SessionKeys;
use App\Models\Scopes\BranchScope;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class RequestAction extends Model
{
    use SoftDeletes;

    protected $fillable = [
        'name',
        'icon',
        'branch_id',
    ];

    // branch
    public function branch()
    {
        return $this->belongsTo(Branch::class);
    }

    public static function booted()
    {
        static::creating(function ($requestAction) {
            $requestAction->branch_id = session(SessionKeys::CURRENT_BRANCH_ID);
        });
        static::addGlobalScope(new BranchScope);
    }

    public function requests()
    {
        return $this->hasMany(RequestActionTableRequest::class);
    }
}
