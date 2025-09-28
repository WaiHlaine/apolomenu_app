<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class MenuItemResource extends JsonResource
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
            'image' => $this->image,
            'position' => $this->position,
            'outOfStock' => (bool) $this->out_of_stock,
            'categoryId' => $this->category_id,
            'createdAt' => $this->created_at,
            'updatedAt' => $this->updated_at,
            'deletedAt' => $this->deleted_at,
            'translations' => MenuItemTranslationResource::collection($this->whenLoaded('translations')),
            'variants' => MenuItemVariantResource::collection($this->whenLoaded('variants')),
            'badges' => BadgeResource::collection($this->whenLoaded('badges')),
            'category' => MenuCategoryResource::make($this->whenLoaded('category')),
        ];
    }
}
