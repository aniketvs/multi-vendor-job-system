import http from 'k6/http';
import { check, sleep } from 'k6';

export let options = {
  vus: 100,           
  duration: '30s',    
};

const BASE_URL = 'http://localhost:3000'; 

export default function () {
  const payload = JSON.stringify({
    vin: "XYZ123",
    make: "Toyota",
    email: "user@example.com"
  });

  const headers = {
    'Content-Type': 'application/json',
  };

  const res = http.post(`${BASE_URL}/jobs?vendor=mock-sync-vendor`, payload, { headers });

  check(res, {
    'POST status is 200': (r) => r.status === 200,
  });

  sleep(1);
}
