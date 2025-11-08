<?php

namespace App\Models;

use App\Models\Scopes\BranchScope;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;
use Illuminate\Support\Facades\DB;

class Order extends Model
{
    use HasFactory, SoftDeletes;

    protected $fillable = [
        'branch_id',
        'user_id',
        'table_id',
        'customer_ip',
        'customer_user_agent',
        'customer_device',
        'order_type',
        'lat',
        'long',
        'status',
        'notes',
        'subtotal',
        'discount',
        'tax',
        'total',
        'order_source',
        'order_number',
        'paid_at',
        'quantity',
        'vat_rate',
    ];

    public function branch()
    {
        return $this->belongsTo(Branch::class);
    }

    public function user()
    {
        return $this->belongsTo(User::class); // cashier/staff user
    }

    public function table()
    {
        return $this->belongsTo(Table::class);
    }

    public function items()
    {
        return $this->hasMany(OrderItem::class);
    }

    protected static function booted()
    {
        static::creating(function ($order) {
            if (! $order->order_number) {
                $order->order_number = DB::transaction(function () use ($order) {
                    // Lock the latest order for this branch
                    $lastOrder = self::where('branch_id', $order->branch_id)
                        ->orderByDesc('order_number')
                        ->lockForUpdate()
                        ->first();

                    $lastNumber = $lastOrder?->order_number ?? 0;

                    return $lastNumber + 1;
                });
            }
        });

        static::addGlobalScope(new BranchScope);
    }
}
