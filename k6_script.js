import http from 'k6/http';
import { sleep } from 'k6';
import { Rate } from 'k6/metrics';
const myFailRate = new Rate('failed requests');

export let options = {
  stages: [
    { duration: '2m', target: 100, rps: 1000 }, // below normal load
    { duration: '5m', target: 100, rps: 1000 },
    { duration: '2m', target: 200, rps: 1000 }, // normal load
    { duration: '5m', target: 200, rps: 1000 },
    { duration: '2m', target: 300, rps: 1000 }, // around the breaking point
    { duration: '5m', target: 300, rps: 1000 },
    { duration: '2m', target: 400, rps: 1000 }, // beyond the breaking point
    { duration: '5m', target: 400, rps: 1000 },
    { duration: '10m', target: 0 }, // scale down. Recovery stage.
  ],
  thresholds: {
    'failed requests': ['rate<0.1'], // threshold on a custom metric
    // 90% of requests must finish within 400ms, 95% within 800, and 99.9% within 2s.
    http_req_duration: ['p(90) < 400', 'p(95) < 800', 'p(99.9) < 2000'],
  },
};

export default function () {
  const productNo = Math.ceil(Math.random() * 10000000);

  let url1 = `http://localhost:3000/products/${productNo}`;
  let res = http.get(url1);
  myFailRate.add(res.status != 200);

  sleep(1);
}
