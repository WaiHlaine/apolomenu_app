<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class MenuCategoryResource extends JsonResource
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
            'name' => $this->name,
            'description' => $this->description,
            'image' => $this->image ? url("storage/{$this->image}") : null,
            'position' => $this->position,
            'available' => $this->available,
            'branchId' => $this->branch_id,
            'createdAt' => $this->created_at,
            'updatedAt' => $this->updated_at,
            'deletedAt' => $this->deleted_at,
            'branch' => BranchResource::make($this->whenLoaded('branch')),
            'menuItems' => MenuItemResource::collection($this->whenLoaded('menuItems')),
        ];
    }
}
