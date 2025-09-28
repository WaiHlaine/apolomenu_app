<?php

namespace App\Models;

use App\Models\Scopes\BranchScope;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Model;

class MenuCategory extends Model
{
    protected $fillable = [
        'name',
        'description',
        'image',
        'position',
        'available',
        'branch_id',
    ];

    public function branch()
    {
        return $this->belongsTo(Branch::class);
    }

    public function items()
    {
        return $this->hasMany(MenuItem::class, 'category_id');
    }

    protected static function booted()
    {
        static::addGlobalScope('order', function (Builder $builder) {
            $builder->orderBy('position')->orderByDesc('created_at');
        });

        static::addGlobalScope(new BranchScope);

        static::creating(function ($category) {
            if (! $category->branch_id && session()->has('current_branch_id')) {
                $category->branch_id = session('current_branch_id');
            }

            // Get the max position in this branch
            $maxPosition = self::where('branch_id', $category->branch_id)->max('position');
            $category->position = $maxPosition !== null ? $maxPosition + 1 : 0;
        });
    }
}
