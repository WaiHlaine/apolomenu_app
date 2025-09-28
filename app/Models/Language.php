<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;

class Language extends Model
{
    use HasFactory;

    protected $fillable = ['code', 'name'];

    public function branches(): BelongsToMany
    {
        return $this->belongsToMany(Branch::class, 'branch_language');
    }
}
