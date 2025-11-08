<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class OrderResource extends JsonResource
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
            'branch' => new BranchResource($this->whenLoaded('branch')),
            'table' => new TableResource($this->whenLoaded('table')),
            'user' => new UserResource($this->whenLoaded('user')),
            'customerIp' => $this->customer_ip,
            'customerUserAgent' => $this->customer_user_agent,
            'customerDevice' => $this->customer_device,
            'orderType' => $this->order_type,
            'lat' => $this->lat,
            'long' => $this->long,
            'status' => $this->status,
            'notes' => $this->notes,
            'subtotal' => $this->subtotal,
            'discount' => $this->discount,
            'tax' => $this->tax,
            'total' => $this->total,
            'quantity' => $this->quantity,
            'orderSource' => $this->order_source,
            'orderNumber' => $this->order_number,
            'paidAt' => $this->paid_at,
            'vatRate' => $this->vat_rate,
            'createdAt' => $this->created_at,
            'updatedAt' => $this->updated_at,

            // Order items
            'items' => OrderItemResource::collection($this->whenLoaded('items')),
        ];
    }
}
