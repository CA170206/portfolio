import dotenv from 'dotenv';
dotenv.config();

const BASE_URL = 'http://localhost:5000';

async function runTests() {
  console.log('--- STARTING MILESTONE 5 COMPREHENSIVE TEST SUITE ---\n');

  // 1. Health API
  const healthRes = await fetch(`${BASE_URL}/api/health`);
  const healthJson = await healthRes.json();
  console.log(`[PASS] 1. GET /api/health: status ${healthRes.status}, message: "${healthJson.message}"`);
  if (healthRes.status !== 200) throw new Error('Health check failed');

  // 2. Admin Login
  const loginRes = await fetch(`${BASE_URL}/api/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      email: process.env.ADMIN_EMAIL,
      password: process.env.ADMIN_PASSWORD,
    }),
  });
  const loginJson = await loginRes.json();
  if (loginRes.status !== 200 || !loginJson.token) {
    throw new Error('Admin login failed');
  }
  const token = loginJson.token;
  const authHeaders = {
    'Content-Type': 'application/json',
    Authorization: `Bearer ${token}`,
  };
  console.log(`[PASS] 2. POST /api/auth/login: status ${loginRes.status}, token received.`);

  // 3. GET /api/auth/me
  const meRes = await fetch(`${BASE_URL}/api/auth/me`, { headers: authHeaders });
  const meJson = await meRes.json();
  console.log(`[PASS] 3. GET /api/auth/me: status ${meRes.status}, admin: ${meJson.data?.email}`);
  if (meRes.status !== 200) throw new Error('GET /api/auth/me failed');

  // 4. Unauthenticated Security Checks (Must be 401)
  const unauthPost = await fetch(`${BASE_URL}/api/projects`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ title: 'Hack', shortDescription: 'Hack' }),
  });
  console.log(`[PASS] 4a. Unauthenticated POST returns ${unauthPost.status} (Expected 401)`);
  if (unauthPost.status !== 401) throw new Error('Expected 401 for unauthenticated POST');

  const unauthPut = await fetch(`${BASE_URL}/api/projects/some-id`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ title: 'Hack' }),
  });
  console.log(`[PASS] 4b. Unauthenticated PUT returns ${unauthPut.status} (Expected 401)`);
  if (unauthPut.status !== 401) throw new Error('Expected 401 for unauthenticated PUT');

  const unauthDelete = await fetch(`${BASE_URL}/api/projects/some-id`, {
    method: 'DELETE',
  });
  console.log(`[PASS] 4c. Unauthenticated DELETE returns ${unauthDelete.status} (Expected 401)`);
  if (unauthDelete.status !== 401) throw new Error('Expected 401 for unauthenticated DELETE');

  // 5. Validation Check (Must be 400)
  const invalidBody = await fetch(`${BASE_URL}/api/projects`, {
    method: 'POST',
    headers: authHeaders,
    body: JSON.stringify({ title: '' }), // missing shortDescription and empty title
  });
  console.log(`[PASS] 5. Invalid body POST returns ${invalidBody.status} (Expected 400)`);
  if (invalidBody.status !== 400) throw new Error('Expected 400 for invalid body');

  // 6. Not Found Check (Must be 404)
  const notFoundRes = await fetch(`${BASE_URL}/api/projects/00000000-0000-0000-0000-000000000000`, {
    headers: authHeaders,
  });
  console.log(`[PASS] 6. Non-existent resource returns ${notFoundRes.status} (Expected 404)`);
  if (notFoundRes.status !== 404) throw new Error('Expected 404 for non-existent resource');

  // ================= 7. PROFILE CRUD =================
  console.log('\nTesting Profile CRUD:');
  // Clean up if existing
  await fetch(`${BASE_URL}/api/profile`, { method: 'DELETE', headers: authHeaders });

  // Create
  const createProf = await fetch(`${BASE_URL}/api/profile`, {
    method: 'POST',
    headers: authHeaders,
    body: JSON.stringify({
      name: 'Chaitanya Anmulwar',
      headline: 'Full Stack & Cloud Developer',
      shortBio: 'Passionate software engineer',
      about: 'Detailed about section...',
      location: 'India',
      email: 'chaitanyaanmulwar1702@gmail.com',
      phone: '+91 9876543210',
    }),
  });
  const profJson = await createProf.json();
  console.log(`[PASS] Profile POST: status ${createProf.status}, created id: ${profJson.data?.id}`);
  if (createProf.status !== 201) throw new Error('Profile creation failed');

  // Update
  const updateProf = await fetch(`${BASE_URL}/api/profile`, {
    method: 'PUT',
    headers: authHeaders,
    body: JSON.stringify({ headline: 'Senior Cloud & Full Stack Developer' }),
  });
  const updatedProfJson = await updateProf.json();
  console.log(`[PASS] Profile PUT: status ${updateProf.status}, updated headline: "${updatedProfJson.data?.headline}"`);

  // Public
  const publicProf = await fetch(`${BASE_URL}/api/profile/public`);
  const pubProfJson = await publicProf.json();
  console.log(`[PASS] Profile GET /public: status ${publicProf.status}, name: "${pubProfJson.data?.name}"`);

  // ================= 8. PROJECTS & IMAGES CRUD =================
  console.log('\nTesting Projects & Project Images CRUD:');
  const createProj = await fetch(`${BASE_URL}/api/projects`, {
    method: 'POST',
    headers: authHeaders,
    body: JSON.stringify({
      title: 'TryQuizzers Platform',
      tagline: 'Interactive Assessment Engine',
      shortDescription: 'AI-driven quiz platform for university students.',
      detailedDescription: 'Full description with architecture and features.',
      liveUrl: 'https://tryquizzers.example.com',
      githubUrl: 'https://github.com/example/tryquizzers',
      featured: true,
      sortOrder: 1,
      technologies: ['React', 'TypeScript', 'Node.js', 'PostgreSQL', 'Docker'],
    }),
  });
  const projJson = await createProj.json();
  const projectId = projJson.data?.id;
  console.log(`[PASS] Project POST: status ${createProj.status}, id: ${projectId}, techs: ${projJson.data?.technologies?.map((t: any) => t.technology.name).join(', ')}`);
  if (!projectId) throw new Error('Project creation failed');

  // Add Image
  const addImg = await fetch(`${BASE_URL}/api/projects/${projectId}/images`, {
    method: 'POST',
    headers: authHeaders,
    body: JSON.stringify({
      imageUrl: 'https://example.com/screenshot1.jpg',
      altText: 'Dashboard screenshot',
      isPrimary: true,
      sortOrder: 0,
    }),
  });
  const imgJson = await addImg.json();
  const imageId = imgJson.data?.id;
  console.log(`[PASS] Project Image POST: status ${addImg.status}, id: ${imageId}`);

  // Update Image
  const updateImg = await fetch(`${BASE_URL}/api/projects/${projectId}/images/${imageId}`, {
    method: 'PUT',
    headers: authHeaders,
    body: JSON.stringify({ altText: 'Updated dashboard screenshot' }),
  });
  console.log(`[PASS] Project Image PUT: status ${updateImg.status}`);

  // Public Projects
  const pubProj = await fetch(`${BASE_URL}/api/projects/public`);
  const pubProjJson = await pubProj.json();
  const foundProj = pubProjJson.data?.find((p: any) => p.id === projectId);
  console.log(`[PASS] Project GET /public: status ${pubProj.status}, thumbnail: ${foundProj?.thumbnail}, technologies: ${foundProj?.technologies?.join(', ')}`);

  // Delete Image
  const delImg = await fetch(`${BASE_URL}/api/projects/${projectId}/images/${imageId}`, {
    method: 'DELETE',
    headers: authHeaders,
  });
  console.log(`[PASS] Project Image DELETE: status ${delImg.status}`);

  // Delete Project
  const delProj = await fetch(`${BASE_URL}/api/projects/${projectId}`, {
    method: 'DELETE',
    headers: authHeaders,
  });
  console.log(`[PASS] Project DELETE: status ${delProj.status}`);

  // ================= 9. CERTIFICATES CRUD =================
  console.log('\nTesting Certificates CRUD:');
  const createCert = await fetch(`${BASE_URL}/api/certificates`, {
    method: 'POST',
    headers: authHeaders,
    body: JSON.stringify({
      title: 'AWS Certified Cloud Practitioner',
      issuer: 'Amazon Web Services',
      issueDate: '2025',
      imageUrl: 'https://example.com/aws.jpg',
      verificationUrl: 'https://aws.amazon.com/verify',
      sortOrder: 1,
      skills: ['Cloud', 'AWS', 'IAM'],
    }),
  });
  const certJson = await createCert.json();
  const certId = certJson.data?.id;
  console.log(`[PASS] Certificate POST: status ${createCert.status}, id: ${certId}`);

  const updateCert = await fetch(`${BASE_URL}/api/certificates/${certId}`, {
    method: 'PUT',
    headers: authHeaders,
    body: JSON.stringify({ title: 'AWS Certified Cloud Practitioner (CLF-C02)' }),
  });
  console.log(`[PASS] Certificate PUT: status ${updateCert.status}`);

  const pubCert = await fetch(`${BASE_URL}/api/certificates/public`);
  console.log(`[PASS] Certificate GET /public: status ${pubCert.status}`);

  const delCert = await fetch(`${BASE_URL}/api/certificates/${certId}`, {
    method: 'DELETE',
    headers: authHeaders,
  });
  console.log(`[PASS] Certificate DELETE: status ${delCert.status}`);

  // ================= 10. EXPERIENCE CRUD =================
  console.log('\nTesting Experience CRUD:');
  const createExp = await fetch(`${BASE_URL}/api/experience`, {
    method: 'POST',
    headers: authHeaders,
    body: JSON.stringify({
      company: 'Tech Solutions Inc',
      position: 'Software Engineering Intern',
      startDate: 'Jan 2025',
      endDate: 'Jun 2025',
      currentlyWorking: false,
      description: ['Developed RESTful microservices', 'Optimized database queries'],
      technologies: ['TypeScript', 'Express', 'PostgreSQL'],
      sortOrder: 1,
    }),
  });
  const expJson = await createExp.json();
  const expId = expJson.data?.id;
  console.log(`[PASS] Experience POST: status ${createExp.status}, id: ${expId}`);

  const updateExp = await fetch(`${BASE_URL}/api/experience/${expId}`, {
    method: 'PUT',
    headers: authHeaders,
    body: JSON.stringify({ position: 'Backend Developer Intern' }),
  });
  console.log(`[PASS] Experience PUT: status ${updateExp.status}`);

  const pubExp = await fetch(`${BASE_URL}/api/experience/public`);
  console.log(`[PASS] Experience GET /public: status ${pubExp.status}`);

  const delExp = await fetch(`${BASE_URL}/api/experience/${expId}`, {
    method: 'DELETE',
    headers: authHeaders,
  });
  console.log(`[PASS] Experience DELETE: status ${delExp.status}`);

  // ================= 11. EDUCATION CRUD =================
  console.log('\nTesting Education CRUD:');
  const createEdu = await fetch(`${BASE_URL}/api/education`, {
    method: 'POST',
    headers: authHeaders,
    body: JSON.stringify({
      institution: 'State Technological University',
      degree: 'Bachelor of Technology',
      fieldOfStudy: 'Computer Science and Engineering',
      startDate: '2022',
      endDate: '2026',
      grade: '8.8',
      gradeLabel: 'CGPA',
      coursework: ['Data Structures', 'DBMS', 'Operating Systems', 'Computer Networks'],
      sortOrder: 1,
    }),
  });
  const eduJson = await createEdu.json();
  const eduId = eduJson.data?.id;
  console.log(`[PASS] Education POST: status ${createEdu.status}, id: ${eduId}`);

  const updateEdu = await fetch(`${BASE_URL}/api/education/${eduId}`, {
    method: 'PUT',
    headers: authHeaders,
    body: JSON.stringify({ grade: '8.85' }),
  });
  console.log(`[PASS] Education PUT: status ${updateEdu.status}`);

  const pubEdu = await fetch(`${BASE_URL}/api/education/public`);
  console.log(`[PASS] Education GET /public: status ${pubEdu.status}`);

  const delEdu = await fetch(`${BASE_URL}/api/education/${eduId}`, {
    method: 'DELETE',
    headers: authHeaders,
  });
  console.log(`[PASS] Education DELETE: status ${delEdu.status}`);

  // ================= 12. SKILLS CRUD =================
  console.log('\nTesting Skills CRUD:');
  const createSkill = await fetch(`${BASE_URL}/api/skills`, {
    method: 'POST',
    headers: authHeaders,
    body: JSON.stringify({
      name: 'PostgreSQL',
      category: 'DATABASE',
      highlight: true,
      sortOrder: 1,
    }),
  });
  const skillJson = await createSkill.json();
  const skillId = skillJson.data?.id;
  console.log(`[PASS] Skill POST: status ${createSkill.status}, id: ${skillId}`);

  const updateSkill = await fetch(`${BASE_URL}/api/skills/${skillId}`, {
    method: 'PUT',
    headers: authHeaders,
    body: JSON.stringify({ highlight: false }),
  });
  console.log(`[PASS] Skill PUT: status ${updateSkill.status}`);

  const pubSkill = await fetch(`${BASE_URL}/api/skills/public`);
  console.log(`[PASS] Skill GET /public: status ${pubSkill.status}`);

  const delSkill = await fetch(`${BASE_URL}/api/skills/${skillId}`, {
    method: 'DELETE',
    headers: authHeaders,
  });
  console.log(`[PASS] Skill DELETE: status ${delSkill.status}`);

  // ================= 13. SOCIAL LINKS CRUD & VISIBILITY FILTERING =================
  console.log('\nTesting Social Links CRUD & Visibility Filtering:');
  // Visible link
  const createSocVis = await fetch(`${BASE_URL}/api/social-links`, {
    method: 'POST',
    headers: authHeaders,
    body: JSON.stringify({
      platform: 'GitHub',
      url: 'https://github.com/chaitanya',
      username: 'chaitanya',
      isVisible: true,
      sortOrder: 1,
    }),
  });
  const socVisJson = await createSocVis.json();
  const visId = socVisJson.data?.id;

  // Hidden link
  const createSocHidden = await fetch(`${BASE_URL}/api/social-links`, {
    method: 'POST',
    headers: authHeaders,
    body: JSON.stringify({
      platform: 'PrivatePlatform',
      url: 'https://private.example.com',
      isVisible: false,
      sortOrder: 2,
    }),
  });
  const socHiddenJson = await createSocHidden.json();
  const hiddenId = socHiddenJson.data?.id;
  console.log(`[PASS] Social Links created: visible (${visId}), hidden (${hiddenId})`);

  // Admin GET - both should be present
  const adminSoc = await fetch(`${BASE_URL}/api/social-links`, { headers: authHeaders });
  const adminSocJson = await adminSoc.json();
  const adminHasHidden = adminSocJson.data?.some((l: any) => l.id === hiddenId);
  console.log(`[PASS] Admin GET /api/social-links has hidden link: ${adminHasHidden} (Expected true)`);
  if (!adminHasHidden) throw new Error('Admin should see hidden social link');

  // Public GET - hidden must NOT be present
  const pubSoc = await fetch(`${BASE_URL}/api/social-links/public`);
  const pubSocJson = await pubSoc.json();
  const pubHasHidden = pubSocJson.data?.some((l: any) => l.id === hiddenId);
  const pubHasVisible = pubSocJson.data?.some((l: any) => l.id === visId);
  console.log(`[PASS] Public GET /api/social-links/public has visible link: ${pubHasVisible}, has hidden link: ${pubHasHidden} (Expected true, false)`);
  if (pubHasHidden || !pubHasVisible) throw new Error('Visibility filtering failed for social links');

  // Delete both
  await fetch(`${BASE_URL}/api/social-links/${visId}`, { method: 'DELETE', headers: authHeaders });
  await fetch(`${BASE_URL}/api/social-links/${hiddenId}`, { method: 'DELETE', headers: authHeaders });
  console.log(`[PASS] Cleaned up social links`);

  console.log('\n--- ALL MILESTONE 5 TESTS PASSED SUCCESSFULLY! ---');
}

runTests().catch((err) => {
  console.error('\n[FAIL] Test suite encountered error:', err.message);
  process.exit(1);
});
