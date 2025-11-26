"""
Setup script untuk AI/ML Service
Memeriksa dependencies dan environment setup
"""

import sys
import subprocess
import importlib.util

def check_python_version():
    """Memeriksa versi Python"""
    required_version = (3, 10)
    current_version = sys.version_info[:2]
    
    if current_version < required_version:
        print(f"❌ Python {required_version[0]}.{required_version[1]}+ diperlukan.")
        print(f"   Versi saat ini: {current_version[0]}.{current_version[1]}")
        return False
    
    print(f"✅ Python version: {current_version[0]}.{current_version[1]}")
    return True

def check_package(package_name):
    """Memeriksa apakah package terinstall"""
    spec = importlib.util.find_spec(package_name)
    return spec is not None

def check_dependencies():
    """Memeriksa dependencies utama"""
    critical_packages = [
        'fastapi',
        'uvicorn',
        'pandas',
        'numpy',
        'simpy',
        'joblib',
        'sklearn',
        'ollama'
    ]
    
    missing_packages = []
    for package in critical_packages:
        if check_package(package):
            print(f"✅ {package} installed")
        else:
            print(f"❌ {package} NOT installed")
            missing_packages.append(package)
    
    return len(missing_packages) == 0, missing_packages

def check_ollama():
    """Memeriksa apakah Ollama server running"""
    try:
        import ollama
        ollama.list()
        print("✅ Ollama server is running")
        return True
    except Exception as e:
        print(f"⚠️  Ollama server not accessible: {e}")
        print("   Install Ollama from: https://ollama.com/download")
        print("   Then run: ollama serve")
        return False

def check_data_files():
    """Memeriksa keberadaan file data CSV"""
    import os
    
    required_files = [
        'data/trucks.csv',
        'data/excavators.csv',
        'data/operators.csv',
        'data/road_segments.csv'
    ]
    
    all_exist = True
    for file in required_files:
        if os.path.exists(file):
            print(f"✅ {file} exists")
        else:
            print(f"⚠️  {file} NOT found")
            all_exist = False
    
    return all_exist

def check_models():
    """Memeriksa keberadaan model ML"""
    import os
    
    model_files = [
        'models/model_fuel.joblib',
        'models/model_load_weight.joblib',
        'models/model_delay_probability.joblib',
        'models/numerical_columns.json',
        'models/categorical_columns.json'
    ]
    
    all_exist = True
    for file in model_files:
        if os.path.exists(file):
            print(f"✅ {file} exists")
        else:
            print(f"⚠️  {file} NOT found - Run train_models.py first")
            all_exist = False
    
    return all_exist

def main():
    """Main setup checker"""
    print("\n" + "="*70)
    print("MINING OPS AI SERVICE - SETUP CHECKER")
    print("="*70 + "\n")
    
    checks = {
        "Python Version": check_python_version(),
        "Dependencies": check_dependencies()[0],
        "Ollama Server": check_ollama(),
        "Data Files": check_data_files(),
        "ML Models": check_models()
    }
    
    print("\n" + "="*70)
    print("SETUP SUMMARY")
    print("="*70)
    
    for check_name, result in checks.items():
        status = "✅ PASS" if result else "❌ FAIL"
        print(f"{check_name:.<30} {status}")
    
    all_passed = all(checks.values())
    
    if all_passed:
        print("\n✅ All checks passed! Ready to start AI service.")
        print("\nRun: uvicorn api:app --host 0.0.0.0 --port 8000 --reload")
    else:
        print("\n⚠️  Some checks failed. Please resolve the issues above.")
        print("\nQuick fixes:")
        print("  1. Install dependencies: pip install -r requirements.txt")
        print("  2. Export data from backend: npm run db:export")
        print("  3. Train models: python train_models.py")
        print("  4. Install Ollama: https://ollama.com/download")
    
    print("\n")

if __name__ == "__main__":
    main()
