import pandas as pd

try:
    df = pd.read_csv('data/sailing_schedules.csv')
    
    # Filter data valid
    valid = df[df['loadingComplete'].notna() & df['loadingStart'].notna() & (df['actualQuantity'] > 0)].copy()
    
    valid['start'] = pd.to_datetime(valid['loadingStart'])
    valid['end'] = pd.to_datetime(valid['loadingComplete'])
    valid['duration_hours'] = (valid['end'] - valid['start']).dt.total_seconds() / 3600
    
    # Hitung kecepatan (Ton/Jam)
    valid['speed_tph'] = valid['actualQuantity'] / valid['duration_hours']
    
    avg_speed = valid['speed_tph'].mean()
    
    print(f"Rata-rata Kecepatan Loading Pelabuhan: {avg_speed:,.0f} Ton/Jam")
    
except Exception as e:
    print(e)