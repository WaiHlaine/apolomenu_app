<?php

use Illuminate\Support\Facades\Broadcast;

Broadcast::channel('App.Models.User.{id}', function ($user, $id) {
    return (int) $user->id === (int) $id;
});

Broadcast::channel('branch.{branchId}.orders', function ($user, $branchId) {
    return $user->branches()->where('branches.id', $branchId)->exists();
});
