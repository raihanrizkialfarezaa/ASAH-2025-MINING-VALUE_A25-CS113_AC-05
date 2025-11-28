import pandas as pd
import os

# Konfigurasi Kecepatan Rata-Rata Simulasi Anda (Dari Backtest terakhir)
# Contoh: 822 Ton dalam 8 Jam = ~102 Ton/Jam
SIMULASI_SPEED_TPH = 102.75 

def validate_vessel_time():
    print("--- AUDIT AKURASI WAKTU LOADING KAPAL ---")
    
    try:
        df = pd.read_csv(os.path.join('data', 'sailing_schedules.csv'))
        
        # 1. Filter kapal yang SUDAH SELESAI loading
        completed_ships = df[df['loadingComplete'].notna() & df['loadingStart'].notna()].copy()
        
        if completed_ships.empty:
            print("Belum ada data kapal yang selesai loading (loadingComplete kosong).")
            return

        # 2. Hitung Durasi Aktual
        completed_ships['loadingStart'] = pd.to_datetime(completed_ships['loadingStart'])
        completed_ships['loadingComplete'] = pd.to_datetime(completed_ships['loadingComplete'])
        
        # Durasi Nyata (Jam)
        completed_ships['actual_hours'] = (completed_ships['loadingComplete'] - completed_ships['loadingStart']).dt.total_seconds() / 3600.0
        
        # 3. Hitung Prediksi AI (Seandainya AI yang hitung)
        # Prediksi = Actual Quantity / Kecepatan Simulasi Kita
        completed_ships['predicted_hours'] = completed_ships['actualQuantity'] / SIMULASI_SPEED_TPH
        
        # 4. Bandingkan
        print(f"Menganalisis {len(completed_ships)} kapal historis...\n")
        
        print(f"{'NAMA KAPAL/ID':<30} | {'AKTUAL (Jam)':<15} | {'PREDIKSI AI (Jam)':<18} | {'AKURASI':<10}")
        print("-" * 80)
        
        total_acc = 0
        count = 0
        
        for _, row in completed_ships.iterrows():
            act = row['actual_hours']
            pred = row['predicted_hours']
            
            # Skip data aneh (misal durasi 0)
            if act < 1: continue
                
            # Hitung akurasi
            acc = max(0, 100 * (1 - abs(act - pred) / act))
            total_acc += acc
            count += 1
            
            print(f"{row['vesselId'][:25]:<30} | {act:<15.1f} | {pred:<18.1f} | {acc:.1f}%")
            
        if count > 0:
            print("-" * 80)
            print(f"RATA-RATA AKURASI ESTIMASI WAKTU: {total_acc/count:.2f}%")
            print(f"(Berdasarkan kecepatan simulasi: {SIMULASI_SPEED_TPH} Ton/Jam)")
        
    except Exception as e:
        print(f"Error: {e}")

if __name__ == "__main__":
    validate_vessel_time()