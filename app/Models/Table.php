<?php

namespace App\Models;

use App\Enums\SessionKeys;
use App\Models\Scopes\BranchScope;
use Illuminate\Database\Eloquent\Model;

class Table extends Model
{
    // fillable
    protected $fillable = [
        'name',
        'qr_code',
        'branch_id',
        'public_token',
    ];

    public function branch()
    {
        return $this->belongsTo(Branch::class);
    }

    public static function booted()
    {
        static::creating(function ($table) {
            $table->branch_id = session(SessionKeys::CURRENT_BRANCH_ID);
        });
        static::addGlobalScope(new BranchScope);
    }

    public function requests()
    {
        return $this->hasMany(RequestActionTableRequest::class);
    }
}
