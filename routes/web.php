<?php

use Illuminate\Foundation\Application;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;
// Controller Auth & Umum
use App\Http\Controllers\ProfileController;
use App\Http\Controllers\BeritaController;
use App\Http\Controllers\KelulusanController;
use App\Http\Controllers\FormulirController;
use App\Http\Controllers\PageController;
use App\Http\Controllers\PaymentController; 
use App\Http\Controllers\DashboardController;
// Controller Admin & Wali
use App\Http\Controllers\PsbController;
use App\Http\Controllers\AdminBeritaController;
use App\Http\Controllers\AdminBiayaController;
use App\Http\Controllers\AdminJadwalController;
use App\Http\Controllers\AdminProgramController;
use App\Http\Controllers\AdminTestimonialController;
use App\Http\Controllers\AdminSettingController; 
use App\Http\Controllers\AdminKeuanganController;
use App\Http\Controllers\AdminUangMasukController; 
use App\Http\Controllers\WaliUangMasukController; 
use App\Http\Controllers\WaliSppController; // <--- Import Wali SPP
use App\Http\Controllers\AdminSppController; // <--- Import Admin SPP
use App\Http\Controllers\LaporanController; // <--- Import ini
use App\Http\Controllers\KeuanganFormulirController; // <--- Import Ini
use App\Http\Controllers\WaliMuridController;

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

// Midtrans Notification
Route::post('/midtrans-notification', [PaymentController::class, 'notification']);

// =========================================================================
// 2. RUTE UTAMA (DASHBOARD & USER/WALI) - Perlu Login
// =========================================================================

Route::middleware(['auth', 'verified'])->group(function () {
    
    // DASHBOARD UTAMA
    Route::get('/dashboard', [DashboardController::class, 'index'])->name('dashboard');
    
    // Profile
    Route::get('/profile', [ProfileController::class, 'edit'])->name('profile.edit');
    Route::patch('/profile', [ProfileController::class, 'update'])->name('profile.update');
    Route::delete('/profile', [ProfileController::class, 'destroy'])->name('profile.destroy');

    // User Functions (Pendaftar)
    Route::get('/formulir/{program_slug}', [FormulirController::class, 'create'])->name('formulir.create');
    Route::post('/formulir', [FormulirController::class, 'store'])->name('formulir.store');
    Route::get('/pembayaran/{id}', [PaymentController::class, 'show'])->name('pembayaran.show');
    Route::get('/status-pendaftaran', [FormulirController::class, 'checkStatus'])->name('status.cek');
    
    // Daftar Ulang
    Route::get('/daftar-ulang', [FormulirController::class, 'daftarUlangShow'])->name('daftar.ulang.show');
    Route::post('/daftar-ulang', [FormulirController::class, 'daftarUlangStore'])->name('daftar.ulang.store');
    Route::get('/daftar-ulang/template', [FormulirController::class, 'downloadTemplate'])->name('daftar.ulang.template');

    // Admin Functions (PSB & Settings)
    Route::get('/admin/psb/pendaftaran', [PsbController::class, 'index'])->name('psb.pendaftaran.index');
    Route::get('/psb/pendaftaran/{id}/edit', [PsbController::class, 'edit'])->name('psb.pendaftaran.edit');
    Route::put('/psb/pendaftaran/{id}', [PsbController::class, 'update'])->name('psb.pendaftaran.update'); 
    Route::get('/psb/pendaftaran/{id}', [PsbController::class, 'show'])->name('psb.pendaftaran.show');
    Route::delete('/psb/pendaftaran/{id}', [PsbController::class, 'destroy'])->name('psb.pendaftaran.destroy');

    Route::get('/settings', [AdminSettingController::class, 'index'])->name('admin.settings.index');
    Route::post('/settings', [AdminSettingController::class, 'update'])->name('admin.settings.update');
    Route::post('/settings/cabang', [AdminSettingController::class, 'storeCabang'])->name('admin.cabang.store');
    Route::delete('/settings/cabang/{id}', [AdminSettingController::class, 'destroyCabang'])->name('admin.cabang.destroy');

    // --- RUTE WALI SANTRI: UANG MASUK ---
    Route::get('/uang-masuk/tagihan', [WaliUangMasukController::class, 'index'])->name('wali.uang-masuk.index');
    Route::post('/uang-masuk/pay', [WaliUangMasukController::class, 'createToken'])->name('wali.uang-masuk.pay');
    Route::post('/uang-masuk/upload', [WaliUangMasukController::class, 'storeUpload'])->name('wali.uang-masuk.upload');
    
    // --- RUTE WALI SANTRI: SPP (NEW) ---
    Route::get('/spp', [WaliSppController::class, 'index'])->name('spp.index');
    Route::post('/spp/pay-standard', [WaliSppController::class, 'payStandard'])->name('spp.pay_standard');
    Route::post('/spp/pay-custom', [WaliSppController::class, 'payCustom'])->name('spp.pay_custom');
    Route::post('/spp/upload', [WaliSppController::class, 'storeUpload'])->name('spp.upload');

    Route::middleware(['auth'])->group(function () {
    // Menu Dashboard (Ringkasan)
    Route::get('/dashboard-wali', [WaliMuridController::class, 'dashboard'])->name('wali.dashboard');
    
    // Menu Lihat Status Anak (Detail & History)
    Route::get('/status-anak', [WaliMuridController::class, 'statusAnak'])->name('wali.status.anak');
});

});


// =========================================================================
// 3. RUTE ADMIN MASTER DATA (Prefix 'admin')
// =========================================================================

Route::middleware(['auth', 'verified'])->prefix('admin')->group(function () {
    
    // Resource Routes
    Route::resource('jadwal', AdminJadwalController::class)->names('admin.jadwal');
    Route::resource('biaya', AdminBiayaController::class)->names('admin.biaya');
    Route::resource('berita', AdminBeritaController::class)->names('admin.berita');
    Route::resource('program', AdminProgramController::class)->names('admin.program');
    Route::resource('testimonial', AdminTestimonialController::class)->names('admin.testimonial');

    // --- ADMIN SPP (NEW) ---
    // Dipisah agar tidak bentrok dengan Uang Masuk
    Route::prefix('spp')->name('admin.spp.')->group(function() {
        Route::get('/', [AdminSppController::class, 'index'])->name('index');
        Route::post('/manual', [AdminSppController::class, 'storeManual'])->name('manual');
        Route::post('/approve/{id}', [AdminSppController::class, 'approve'])->name('approve');
        Route::post('/reject/{id}', [AdminSppController::class, 'reject'])->name('reject');
        Route::put('/{id}', [AdminSppController::class, 'update'])->name('update');
    });
    
    // --- ADMIN KEUANGAN (Laporan Umum) ---
    Route::get('/keuangan', [AdminKeuanganController::class, 'index'])->name('admin.keuangan.index');
    Route::post('/keuangan/spp/{id}/verify', [AdminKeuanganController::class, 'verifySpp'])->name('admin.keuangan.verify');
    // --- ADMIN KEUANGAN FORMULIR ---
    Route::controller(KeuanganFormulirController::class)
        ->prefix('keuangan/formulir')
        // Tambahkan 'admin.' di depan agar lengkap
        ->name('admin.keuangan.formulir.') 
        ->group(function() {
            Route::get('/', 'index')->name('index');
            Route::get('/{id}', 'show')->name('show');
            Route::put('/{id}', 'update')->name('update');
        });
    });

    // --- ADMIN UANG MASUK (PANGKAL) ---
    Route::controller(AdminUangMasukController::class)->prefix('uang-masuk')->name('admin.uang_masuk.')->group(function() {
        Route::get('/', 'index')->name('index');           
        Route::post('/{id}/pay', 'storePayment')->name('pay'); 
        Route::post('/update-global', 'updateGlobal')->name('update_global'); // Opsional (krn sdh pakai program)
        Route::put('/{id}', 'update')->name('update');
        Route::post('/approve/{id}', 'approve')->name('approve');
        Route::post('/reject/{id}', 'reject')->name('reject');
        Route::post('/update-status/{id}', 'updateStatus')->name('update_status'); 
        Route::put('/riwayat/{id}', 'updateHistory')->name('riwayat.update');
        Route::delete('/riwayat/{id}', 'deleteHistory')->name('riwayat.destroy');

    });

    Route::controller(LaporanController::class)->prefix('laporan')->name('admin.laporan.')->group(function () {
    Route::get('/', 'index')->name('index');
    Route::post('/export', 'export')->name('export');
});



require __DIR__.'/auth.php';