<?php

use Illuminate\Foundation\Application;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;
use App\Http\Controllers\ProfileController;
use App\Http\Controllers\BeritaController;
use App\Http\Controllers\KelulusanController;
use App\Http\Controllers\FormulirController;
use App\Http\Controllers\PsbController;
use App\Http\Controllers\PageController;
use App\Http\Controllers\PaymentController; 
// Controller Admin
use App\Http\Controllers\AdminBeritaController;
use App\Http\Controllers\AdminBiayaController;
use App\Http\Controllers\AdminJadwalController;
use App\Http\Controllers\AdminProgramController;
use App\Http\Controllers\AdminTestimonialController;

/*
|--------------------------------------------------------------------------
| Web Routes
|--------------------------------------------------------------------------
*/

// =========================================================================
// 1. RUTE PUBLIK (Bisa diakses tanpa login)
// =========================================================================

Route::get('/', [PageController::class, 'beranda'])->name('home');
Route::get('/pendaftaran', [PageController::class, 'pendaftaran'])->name('pendaftaran');
Route::get('/jadwal', [PageController::class, 'jadwal'])->name('jadwal');
Route::get('/biaya-pendidikan', [PageController::class, 'biaya'])->name('biaya.pendidikan');
Route::get('/panduan-pendaftaran', function () {
    return Inertia::render('PanduanPendaftaran');
})->name('panduan.pendaftaran');
Route::get('/kontak', [PageController::class, 'kontak'])->name('kontak');

// Berita Publik
Route::get('/berita', [BeritaController::class, 'index'])->name('berita.index');
Route::get('/berita/{id}', [BeritaController::class, 'show'])->name('berita.show');

// Cek Kelulusan
Route::get('/cek-kelulusan', [KelulusanController::class, 'index'])->name('kelulusan.index');
Route::post('/cek-kelulusan', [KelulusanController::class, 'check'])->name('kelulusan.check');

// --- PENTING: ROUTE MIDTRANS ---
// URL ini harus sama persis dengan yang ada di Dashboard Midtrans
// dan pengecualian CSRF di bootstrap/app.php
Route::post('/midtrans-notification', [PaymentController::class, 'notification']);

// =========================================================================
// 2. RUTE USER / UMUM (Perlu Login)
// =========================================================================

Route::middleware('auth')->group(function () {
    Route::get('/dashboard', function () {
        return Inertia::render('Dashboard');
    })->middleware('verified')->name('dashboard');
    
    // Profile
    Route::get('/profile', [ProfileController::class, 'edit'])->name('profile.edit');
    Route::patch('/profile', [ProfileController::class, 'update'])->name('profile.update');
    Route::delete('/profile', [ProfileController::class, 'destroy'])->name('profile.destroy');

    // Formulir Pendaftaran (User mengisi form)
    Route::get('/formulir/{program_slug}', [FormulirController::class, 'create'])->name('formulir.create');
    Route::post('/formulir', [FormulirController::class, 'store'])->name('formulir.store');

    // Pembayaran
    Route::get('/pembayaran/{id}', [PaymentController::class, 'show'])->name('pembayaran.show');

    // Status & Kartu Ujian (Dipindah kesini karena butuh Auth)
    Route::get('/status-pendaftaran', [FormulirController::class, 'checkStatus'])->name('status.cek');

    // Dashboard Khusus PSB
    Route::get('/admin/psb/pendaftaran', [PsbController::class, 'index'])->name('psb.pendaftaran.index');
});


// =========================================================================
// 3. RUTE ADMIN (Perlu Login + Prefix 'admin')
// =========================================================================
// URL: /admin/jadwal, /admin/biaya, dll

Route::middleware(['auth', 'verified'])->prefix('admin')->group(function () {
    
    // Resource Routes untuk Admin
    Route::resource('jadwal', AdminJadwalController::class)->names('admin.jadwal');
    Route::resource('biaya', AdminBiayaController::class)->names('admin.biaya');
    Route::resource('berita', AdminBeritaController::class)->names('admin.berita');
    Route::resource('program', AdminProgramController::class)->names('admin.program');
    Route::resource('testimonial', AdminTestimonialController::class)->names('admin.testimonial');

});

require __DIR__.'/auth.php';    