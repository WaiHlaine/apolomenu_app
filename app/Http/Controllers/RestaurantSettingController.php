<?php

namespace App\Http\Controllers;

use Inertia\Inertia;

class RestaurantSettingController extends Controller
{
    public function generalSetting()
    {
        return Inertia::render('restaurant/settings/general');
    }
}
