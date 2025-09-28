<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class OrderItemResource extends JsonResource
{
    /**
     * Transform the resource into an array.
     *
     * @return array<string, mixed>
     */
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'orderId' => $this->order_id,
            'menuItemId' => $this->menu_item_id,
            'variantId' => $this->variant_id,
            'quantity' => $this->quantity,
            'unitPrice' => $this->unit_price,
            'totalPrice' => $this->total_price,
            'notes' => $this->notes,
            'status' => $this->status,

            // Include menu item resource
            'menuItem' => $this->whenLoaded('menuItem', function () {
                return new MenuItemResource($this->menuItem);
            }),

            // Include variant resource if exists
            'variant' => $this->whenLoaded('variant', function () {
                return $this->variant ? new MenuItemVariantResource($this->variant) : null;
            }),
        ];
    }
}
