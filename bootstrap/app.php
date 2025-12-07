<?php

use Illuminate\Foundation\Application;
use Illuminate\Foundation\Configuration\Exceptions;
use Illuminate\Foundation\Configuration\Middleware;

return Application::configure(basePath: dirname(__DIR__))
    ->withRouting(
        web: __DIR__.'/../routes/web.php',
        commands: __DIR__.'/../routes/console.php',
        health: '/up',
    )
    ->withMiddleware(function (Middleware $middleware): void {
        $middleware->web(append: [
            \App\Http\Middleware\HandleInertiaRequests::class,
            \Illuminate\Http\Middleware\AddLinkHeadersForPreloadedAssets::class,
        ]);

        // --- GABUNGKAN SEMUA PENGECUALIAN DI SINI ---
        $middleware->validateCsrfTokens(except: [
            'midtrans-notification',      // Route utama Anda
            'api/midtrans-notification',  // Alternatif jika pakai prefix api
            'midtrans/notification',      // Alternatif lain (jaga-jaga)
        ]);
        // ---------------------------------------------
    })
    ->withExceptions(function (Exceptions $exceptions): void {
        //
    })->create();