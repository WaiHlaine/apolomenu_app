<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class MenuItemVariant extends Model
{
    use HasFactory;

    protected $fillable = [
        'name',
        'price',
        'position',
        'menu_item_id',
        'out_of_stock',
    ];

    public function menuItem()
    {
        return $this->belongsTo(MenuItem::class);
    }
}
