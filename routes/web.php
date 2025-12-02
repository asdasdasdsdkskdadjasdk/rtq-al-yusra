<?php

use Illuminate\Foundation\Application;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;
use App\Http\Controllers\ProfileController;
use App\Http\Controllers\BeritaController;
use App\Http\Controllers\KelulusanController;
use App\Http\Controllers\FormulirController;
use App\Http\Controllers\PsbController;
use App\Http\Controllers\PageController; // Pastikan ini diimpor
use App\Http\Controllers\AdminBeritaController; // <-- Jangan lupa import

/*
|--------------------------------------------------------------------------
| Web Routes
|--------------------------------------------------------------------------
*/

// --- RUTE PUBLIK (Bisa diakses siapa saja) ---
Route::get('/', function () {
    return Inertia::render('Beranda', [
        'canLogin' => Route::has('login'),
        'canRegister' => Route::has('register'),
        'laravelVersion' => Application::VERSION,
        'phpVersion' => PHP_VERSION,
    ]);
})->name('home');

Route::get('/pendaftaran', function () {
    return Inertia::render('Pendaftaran');
})->name('pendaftaran');

Route::get('/jadwal', function () {
    return Inertia::render('Jadwal');
})->name('jadwal');

Route::get('/biaya-pendidikan', function () {
    return Inertia::render('BiayaPendidikan');
})->name('biaya.pendidikan');

Route::get('/panduan-pendaftaran', function () {
    return Inertia::render('PanduanPendaftaran');
})->name('panduan.pendaftaran');

Route::get('/kontak', [PageController::class, 'kontak'])->name('kontak');

Route::get('/berita', [BeritaController::class, 'index'])->name('berita.index');


Route::get('/berita/{id}', [BeritaController::class, 'show'])->name('berita.show');

Route::get('/cek-kelulusan', [KelulusanController::class, 'index'])->name('kelulusan.index');
Route::post('/cek-kelulusan', [KelulusanController::class, 'check'])->name('kelulusan.check');


// --- RUTE YANG MEMBUTUHKAN LOGIN (Dilindungi Middleware 'auth') ---
Route::middleware('auth')->group(function () {
    Route::get('/dashboard', function () {
        return Inertia::render('Dashboard');
    })->middleware('verified')->name('dashboard');
    
    Route::get('/profile', [ProfileController::class, 'edit'])->name('profile.edit');
    Route::patch('/profile', [ProfileController::class, 'update'])->name('profile.update');
    Route::delete('/profile', [ProfileController::class, 'destroy'])->name('profile.destroy');

    // PERBAIKAN: Rute formulir dipindahkan ke sini
    Route::get('/formulir/{program_slug}', [FormulirController::class, 'create'])->name('formulir.create');
    Route::post('/formulir', [FormulirController::class, 'store'])->name('formulir.store');

    // Rute untuk Admin PSB
    Route::get('/admin/psb/pendaftaran', [PsbController::class, 'index'])->name('psb.pendaftaran.index');

    // RUTE MANAJEMEN BERITA (ADMIN)
    Route::get('/admin/berita', [AdminBeritaController::class, 'index'])->name('admin.berita.index');
    Route::get('/admin/berita/create', [AdminBeritaController::class, 'create'])->name('admin.berita.create');
    Route::post('/admin/berita', [AdminBeritaController::class, 'store'])->name('admin.berita.store');
    Route::delete('/admin/berita/{berita}', [AdminBeritaController::class, 'destroy'])->name('admin.berita.destroy');
    
});

// Route Admin (Harus Login & Role Tertentu)
Route::middleware(['auth', 'verified'])->prefix('admin')->group(function () {
    Route::resource('berita', AdminBeritaController::class)->names('admin.berita');
});

require __DIR__.'/auth.php';