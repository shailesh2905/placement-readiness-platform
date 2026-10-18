import test from 'node:test';
import assert from 'node:assert/strict';
import axios from 'axios';

const API_BASE = 'http://localhost:8000/api/v1';

test('1. API Health Check', async () => {
  const res = await axios.get('http://localhost:8000/health');
  assert.equal(res.status, 200);
  assert.equal(res.data.status, 'ok');
});

test('2. Authentication - Demo Student Login', async () => {
  const res = await axios.post(`${API_BASE}/auth/login`, {
    email: 'student@demo.com',
    password: 'password123'
  });
  assert.equal(res.status, 200);
  assert.equal(res.data.success, true);
  assert.ok(res.data.data.token, 'Token should be returned');
});

test('3. Authentication - Demo Mentor / Admin Login', async () => {
  const res = await axios.post(`${API_BASE}/auth/login`, {
    email: 'admin@nexcart.ai',
    password: 'password123'
  });
  assert.equal(res.status, 200);
  assert.equal(res.data.success, true);
  assert.ok(['ADMIN', 'MENTOR'].includes(res.data.data.role), 'Role should be MENTOR or ADMIN');
});

test('4. Learning Plan & Skill Gap Calculation', async () => {
  const login = await axios.post(`${API_BASE}/auth/login`, {
    email: 'student@demo.com',
    password: 'password123'
  });
  const token = login.data.data.token;

  const res = await axios.get(`${API_BASE}/learning-plan?role=SDE`, {
    headers: { Authorization: `Bearer ${token}` }
  });
  assert.equal(res.status, 200);
  assert.equal(res.data.success, true);
  assert.ok(res.data.data.skillGapAnalysis.matchPercentage >= 0, 'Match percentage calculated');
  assert.equal(res.data.data.learningRoadmap.length, 4, '4-week roadmap generated');
});

test('5. Admin Analytics & Student Roster Filtering', async () => {
  const login = await axios.post(`${API_BASE}/auth/login`, {
    email: 'admin@nexcart.ai',
    password: 'password123'
  });
  const token = login.data.data.token;

  const analytics = await axios.get(`${API_BASE}/admin/analytics`, {
    headers: { Authorization: `Bearer ${token}` }
  });
  assert.equal(analytics.status, 200);
  assert.ok(analytics.data.data.totalStudents > 0, 'Students should be indexed');

  const roster = await axios.get(`${API_BASE}/admin/students?search=Rohan`, {
    headers: { Authorization: `Bearer ${token}` }
  });
  assert.equal(roster.status, 200);
  assert.ok(roster.data.data.length >= 1, 'Search filter should find candidate');
});

test('6. Admin CSV Roster Export', async () => {
  const login = await axios.post(`${API_BASE}/auth/login`, {
    email: 'admin@nexcart.ai',
    password: 'password123'
  });
  const token = login.data.data.token;

  const res = await axios.get(`${API_BASE}/admin/export-csv`, {
    headers: { Authorization: `Bearer ${token}` }
  });
  assert.equal(res.status, 200);
  assert.ok(res.data.includes('Student ID,Full Name,Email'), 'CSV headers should match schema');
});
