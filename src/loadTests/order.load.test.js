import http from 'k6/http';
import { check, fail } from "k6";
import { htmlReport } from "https://raw.githubusercontent.com/benc-uk/k6-reporter/main/dist/bundle.js"

export let options = {
    vus: 10,
    duration: '5s',
}

export function handleSummary(data) {
    return {
        'order-load-test-report.html': htmlReport(data)
    }
}

function getOrders() {
    let response = http.get("http://localhost:8000/order");
    const output = check(response, {
        'status is 200': (r) => r.status === 200,
    })
    if (!output) {
        console.log(response.body);
        fail('Unexpected response');
    }
}

export default function () {
    getOrders();
}