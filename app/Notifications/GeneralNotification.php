<?php

namespace App\Notifications;

use Illuminate\Bus\Queueable;
use Illuminate\Notifications\Notification;

class GeneralNotification extends Notification
{
    use Queueable;

    public $message;
    public $url;
    public $type; // 'success', 'error', 'info'

    public function __construct($message, $url, $type = 'info')
    {
        $this->message = $message;
        $this->url = $url;
        $this->type = $type;
    }

    public function via($notifiable)
    {
        return ['database'];
    }

    public function toArray($notifiable)
    {
        return [
            'message' => $this->message,
            'url' => $this->url,
            'type' => $this->type,
        ];
    }
}