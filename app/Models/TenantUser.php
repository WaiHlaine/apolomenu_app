<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class TenantUser extends Model
{
    protected $fillable = [
        'tenant_id',
        'user_id',
    ];
}
