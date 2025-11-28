import axios from 'axios';
import chalk from 'chalk';

const services = [
  {
    name: 'Backend Express',
    url: 'http://localhost:3000/api/auth/me',
    port: 3000,
    color: 'green',
  },
  {
    name: 'Frontend React',
    url: 'http://localhost:3001',
    port: 3001,
    color: 'blue',
  },
  {
    name: 'AI Service Python',
    url: 'http://localhost:8000',
    port: 8000,
    color: 'yellow',
  },
];

async function checkService(service) {
  try {
    await axios.get(service.url, { timeout: 2000 });
    return { ...service, status: 'online' };
  } catch (error) {
    return { ...service, status: 'offline' };
  }
}

async function checkAllServices() {
  console.log('\n=== CHECKING ALL SERVICES ===\n');

  const results = await Promise.all(services.map(checkService));

  results.forEach((service) => {
    const status = service.status === 'online' ? '✓ ONLINE' : '✗ OFFLINE';
    const color = service.status === 'online' ? 'green' : 'red';
    console.log(`${service.name.padEnd(20)} [Port ${service.port}]: ${status}`);
  });

  const allOnline = results.every((s) => s.status === 'online');

  console.log('\n=== STATUS SUMMARY ===\n');
  if (allOnline) {
    console.log('✓ All services are running!');
    console.log('\nAccess URLs:');
    console.log('- Frontend: http://localhost:3001');
    console.log('- Backend:  http://localhost:3000/api');
    console.log('- AI API:   http://localhost:8000');
    console.log('- AI Docs:  http://localhost:8000/docs');
  } else {
    console.log('✗ Some services are not running!');
    const offlineServices = results.filter((s) => s.status === 'offline');
    console.log('\nOffline services:');
    offlineServices.forEach((s) => {
      console.log(`- ${s.name} (Port ${s.port})`);
    });
    console.log('\nTo start all services, run: START_ALL_SERVICES.bat');
  }

  console.log('\n');
}

checkAllServices();
