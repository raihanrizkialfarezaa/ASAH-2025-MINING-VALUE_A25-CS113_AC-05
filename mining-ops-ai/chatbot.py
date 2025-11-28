import ollama
import pandas as pd
from database import fetch_dataframe
import json

MODEL_NAME = "qwen2.5:7b"

SCHEMA_DESCRIPTION = """
Database Schema (PostgreSQL):

1. trucks (id, code, name, capacity, status, fuel_capacity, total_hours, total_distance)
   - status: IDLE, HAULING, LOADING, DUMPING, MAINTENANCE, BREAKDOWN
2. excavators (id, code, name, bucket_capacity, status, total_hours)
   - status: ACTIVE, IDLE, MAINTENANCE, BREAKDOWN
3. operators (id, employee_number, status, total_hours, rating)
4. road_segments (id, code, name, distance, road_condition, max_speed)
   - road_condition: GOOD, FAIR, POOR, CRITICAL
5. hauling_activities (id, truck_id, excavator_id, road_segment_id, status, payload_amount, distance, cycle_time, fuel_consumed)
   - status: COMPLETED, IN_PROGRESS
6. sailing_schedules (id, vessel_id, eta_loading, ets_loading, planned_quantity, status)
   - status: SCHEDULED, ARRIVED, LOADING, COMPLETED, DEPARTED
7. weather_logs (id, condition, temperature, rainfall, wind_speed, timestamp)
   - condition: Cerah, Hujan Ringan, Hujan Lebat
8. production_records (id, date, shift, total_production, target_production)

Relationships:
- hauling_activities.truck_id -> trucks.id
- hauling_activities.excavator_id -> excavators.id
- hauling_activities.road_segment_id -> road_segments.id
"""

def generate_sql_query(user_question):
    prompt = f"""
    You are a PostgreSQL expert. Convert the user's question into a valid SQL query.
    
    Schema:
    {SCHEMA_DESCRIPTION}
    
    Rules:
    1. Return ONLY the SQL query. No markdown, no explanation.
    2. The query must be READ-ONLY (SELECT only). No INSERT, UPDATE, DELETE, DROP.
    3. Use standard PostgreSQL syntax.
    4. If the question cannot be answered with the schema, return "SELECT 'I cannot answer that based on the available data' as message;".
    5. Limit results to 10 rows unless specified otherwise.
    
    User Question: {user_question}
    SQL Query:
    """
    
    try:
        response = ollama.chat(model=MODEL_NAME, messages=[
            {'role': 'system', 'content': 'You are a SQL generator. Output only SQL.'},
            {'role': 'user', 'content': prompt}
        ])
        sql = response['message']['content'].strip()
        # Clean up markdown if present
        if sql.startswith("```sql"):
            sql = sql[6:]
        if sql.startswith("```"):
            sql = sql[3:]
        if sql.endswith("```"):
            sql = sql[:-3]
        return sql.strip()
    except Exception as e:
        print(f"Error generating SQL: {e}")
        return None

def execute_and_summarize(user_question):
    sql_query = generate_sql_query(user_question)
    if not sql_query:
        return "Maaf, saya tidak dapat memproses pertanyaan tersebut saat ini."
    
    # Safety check
    if not sql_query.upper().startswith("SELECT"):
        return "Maaf, saya hanya diperbolehkan melakukan operasi pembacaan data (SELECT)."
    
    print(f"🤖 Generated SQL: {sql_query}")
    
    try:
        df = fetch_dataframe(sql_query)
        
        if df.empty:
            return "Tidak ada data yang ditemukan untuk pertanyaan tersebut."
        
        # Convert result to string/json for the LLM to summarize
        data_str = df.to_string()
        
        summary_prompt = f"""
        User Question: {user_question}
        SQL Query Executed: {sql_query}
        Data Result:
        {data_str}
        
        Please provide a natural language answer to the user's question based on the data result.
        Be concise and professional. Use Bahasa Indonesia.
        """
        
        response = ollama.chat(model=MODEL_NAME, messages=[
            {'role': 'system', 'content': 'You are a mining operations assistant. Answer based on data.'},
            {'role': 'user', 'content': summary_prompt}
        ])
        
        return response['message']['content']
        
    except Exception as e:
        return f"Terjadi kesalahan saat mengambil data: {str(e)}"
