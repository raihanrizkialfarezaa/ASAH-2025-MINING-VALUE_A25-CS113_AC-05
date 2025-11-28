import axios from 'axios';

const BASE_URL = 'http://localhost:3000/api';

async function testBackendConnection() {
  console.log('\n=== TESTING BACKEND API CONNECTION ===\n');

  const endpoints = [
    { name: 'Excavators', url: '/excavators?page=1&limit=5' },
    { name: 'Road Segments', url: '/locations/road-segments?page=1&limit=5' },
    { name: 'Vessels', url: '/vessels?page=1&limit=5' },
    { name: 'Sailing Schedules', url: '/vessels/schedules?page=1&limit=5' },
    { name: 'AI Health', url: '/ai/health' },
  ];

  for (const endpoint of endpoints) {
    try {
      const response = await axios.get(`${BASE_URL}${endpoint.url}`);
      console.log(`✓ ${endpoint.name}: ${response.status} OK`);
      if (response.data?.data) {
        console.log(`  - Data count: ${response.data.data.length || 0}`);
      }
    } catch (error) {
      if (error.code === 'ECONNREFUSED') {
        console.log(`✗ ${endpoint.name}: Backend server not running`);
        console.log(`  Please start backend with: cd backend-express && npm start`);
        break;
      } else {
        console.log(`✗ ${endpoint.name}: ${error.response?.status || error.message}`);
      }
    }
  }

  console.log('\n=== TEST COMPLETE ===\n');
}

testBackendConnection();
