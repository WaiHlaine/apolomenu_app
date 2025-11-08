<?php

namespace App\Events;

use App\Models\RequestActionTableRequest;
use Illuminate\Broadcasting\InteractsWithSockets;
use Illuminate\Broadcasting\PrivateChannel;
use Illuminate\Contracts\Broadcasting\ShouldBroadcast;
use Illuminate\Foundation\Events\Dispatchable;
use Illuminate\Queue\SerializesModels;

class RequestActionTableRequestCreatedEvent implements ShouldBroadcast
{
    use Dispatchable, InteractsWithSockets, SerializesModels;

    public RequestActionTableRequest $tableRequestAction;

    public function __construct(RequestActionTableRequest $tableRequestAction)
    {
        $this->tableRequestAction = $tableRequestAction;
    }

    /**
     * Get the channels the event should broadcast on.
     *
     * @return array<int, \Illuminate\Broadcasting\Channel>
     */
    public function broadcastOn(): array
    {
        return [
            new PrivateChannel('branch.'.$this->tableRequestAction->branch_id.'.table_request_actions'),
        ];
    }
}
