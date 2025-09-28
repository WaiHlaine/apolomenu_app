<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class RequestActionTableRequestResource extends JsonResource
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
            'status' => $this->status,
            'table' => new TableResource($this->whenLoaded('table')),
            'request_action' => new RequestActionResource($this->whenLoaded('requestAction')),
            'created_at' => $this->created_at,
        ];
    }
}
