<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;
use Illuminate\Database\Eloquent\SoftDeletes;
use Illuminate\Support\Facades\Storage;

class MenuItem extends Model
{
    use HasFactory, SoftDeletes;

    protected $fillable = [
        'image',
        'position',
        'out_of_stock',
        'category_id',
    ];

    public function category()
    {
        return $this->belongsTo(MenuCategory::class, 'category_id');
    }

    public function translations()
    {
        return $this->hasMany(MenuItemTranslation::class);
    }

    public function variants()
    {
        return $this->hasMany(MenuItemVariant::class);
    }

    public function badges(): BelongsToMany
    {
        return $this->BelongsToMany(Badge::class, 'badge_menu_item');
    }

    protected static function booted()
    {
        static::addGlobalScope('order', function (Builder $builder) {
            $builder->orderByDesc('created_at');
        });

        static::creating(function ($menu_item) {
            // Get the max position in this branch
            $maxPosition = self::where('category_id', $menu_item->category_id)->max('position');
            $menu_item->position = $maxPosition !== null ? $maxPosition + 1 : 0;
        });
    }

    public function getImageUrlAttribute()
    {
        return $this->image
            ? Storage::url($this->image)
            : null;
    }
}
