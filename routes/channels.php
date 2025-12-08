<?php

use Illuminate\Support\Facades\Broadcast;

Broadcast::channel('App.Models.User.{id}', function ($user, $id) {
    return (int) $user->id === (int) $id;
});

// new orders event
Broadcast::channel('branch.{branchId}.orders', function ($user, $branchId) {
    return $user->branches()->where('branches.id', $branchId)->exists();
});

// table completed event
Broadcast::channel('branch.{branchId}.table_completed', function ($user, $branchId) {
    return $user->branches()->where('branches.id', $branchId)->exists();
});

Broadcast::channel('branch.{branchId}.table_request_actions', function ($user, $branchId) {
    return $user->branches()->where('branches.id', $branchId)->exists();
});
