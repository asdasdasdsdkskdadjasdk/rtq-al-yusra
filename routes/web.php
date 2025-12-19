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
use App\Http\Controllers\AdminSettingController; 
use App\Http\Controllers\DashboardController; // <--- 1. Import Controller

/*
|--------------------------------------------------------------------------
| Web Routes
|--------------------------------------------------------------------------
*/

// =========================================================================
// 1. RUTE PUBLIK
// =========================================================================

Route::get('/', [PageController::class, 'beranda'])->name('home');
Route::get('/pendaftaran', [PageController::class, 'pendaftaran'])->name('pendaftaran');
Route::get('/jadwal', [PageController::class, 'jadwal'])->name('jadwal');
Route::get('/biaya-pendidikan', [PageController::class, 'biaya'])->name('biaya.pendidikan');
Route::get('/panduan-pendaftaran', function () {
    return Inertia::render('PanduanPendaftaran');
})->name('panduan.pendaftaran');
Route::get('/kontak', [PageController::class, 'kontak'])->name('kontak');

// Berita & Kelulusan
Route::get('/berita', [BeritaController::class, 'index'])->name('berita.index');
Route::get('/berita/{id}', [BeritaController::class, 'show'])->name('berita.show');
Route::get('/cek-kelulusan', [KelulusanController::class, 'index'])->name('kelulusan.index');
Route::post('/cek-kelulusan', [KelulusanController::class, 'check'])->name('kelulusan.check');

// Midtrans
Route::post('/midtrans-notification', [PaymentController::class, 'notification']);

// =========================================================================
// 2. RUTE UTAMA (DASHBOARD & USER) - Perlu Login
// =========================================================================

Route::middleware(['auth', 'verified'])->group(function () {
    
    // --- [PERBAIKAN UTAMA] ---
    // Menggunakan DashboardController agar data statistik terkirim
    // URL: /dashboard
    Route::get('/dashboard', [DashboardController::class, 'index'])->name('dashboard');
    
    // Profile
    Route::get('/profile', [ProfileController::class, 'edit'])->name('profile.edit');
    Route::patch('/profile', [ProfileController::class, 'update'])->name('profile.update');
    Route::delete('/profile', [ProfileController::class, 'destroy'])->name('profile.destroy');

    // User Functions
    Route::get('/formulir/{program_slug}', [FormulirController::class, 'create'])->name('formulir.create');
    Route::post('/formulir', [FormulirController::class, 'store'])->name('formulir.store');
    Route::get('/pembayaran/{id}', [PaymentController::class, 'show'])->name('pembayaran.show');
    Route::get('/status-pendaftaran', [FormulirController::class, 'checkStatus'])->name('status.cek');
    
    // Daftar Ulang
    Route::get('/daftar-ulang', [FormulirController::class, 'daftarUlangShow'])->name('daftar.ulang.show');
    Route::post('/daftar-ulang', [FormulirController::class, 'daftarUlangStore'])->name('daftar.ulang.store');
    Route::get('/daftar-ulang/template', [FormulirController::class, 'downloadTemplate'])->name('daftar.ulang.template');

    // Admin Functions (PSB & Settings) yang tidak butuh resource khusus
    Route::get('/admin/psb/pendaftaran', [PsbController::class, 'index'])->name('psb.pendaftaran.index');
    Route::get('/psb/pendaftaran/{id}/edit', [PsbController::class, 'edit'])->name('psb.pendaftaran.edit');
    Route::put('/psb/pendaftaran/{id}', [PsbController::class, 'update'])->name('psb.pendaftaran.update');
    Route::get('/psb/pendaftaran/{id}', [PsbController::class, 'show'])->name('psb.pendaftaran.show');
    Route::delete('/psb/pendaftaran/{id}', [PsbController::class, 'destroy'])->name('psb.pendaftaran.destroy');

    Route::get('/settings', [AdminSettingController::class, 'index'])->name('admin.settings.index');
    Route::post('/settings', [AdminSettingController::class, 'update'])->name('admin.settings.update');
    Route::post('/settings/cabang', [AdminSettingController::class, 'storeCabang'])->name('admin.cabang.store');
    Route::delete('/settings/cabang/{id}', [AdminSettingController::class, 'destroyCabang'])->name('admin.cabang.destroy');
});


// =========================================================================
// 3. RUTE ADMIN MASTER DATA (Prefix 'admin')
// =========================================================================

Route::middleware(['auth', 'verified'])->prefix('admin')->group(function () {
    // URL: /admin/jadwal, /admin/biaya, dll
    // Catatan: Dashboard sudah dipindah ke grup atas agar URL-nya tetap /dashboard
    
    Route::resource('jadwal', AdminJadwalController::class)->names('admin.jadwal');
    Route::resource('biaya', AdminBiayaController::class)->names('admin.biaya');
    Route::resource('berita', AdminBeritaController::class)->names('admin.berita');
    Route::resource('program', AdminProgramController::class)->names('admin.program');
    Route::resource('testimonial', AdminTestimonialController::class)->names('admin.testimonial');
});

require __DIR__.'/auth.php';