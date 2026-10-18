import prisma from '../config/db.js';

// In-memory application tracking state (persisted during process runtime)
const applications = new Map(); // key: `${userId}_${driveId}`, value: { driveId, userId, appliedAt, status: 'APPLIED' }

const CAMPUS_DRIVES = [
  {
    id: 'drive-amazon-2026',
    company: 'Amazon',
    logo: 'https://upload.wikimedia.org/wikipedia/commons/4/4a/Amazon_icon.svg',
    role: 'Software Development Engineer I (SDE-1)',
    packageCTC: '₹28.5 LPA',
    location: 'Bangalore / Hyderabad',
    minCgpa: 7.5,
    minReadiness: 75,
    targetRoles: ['Software Development Engineer', 'Backend Developer'],
    requiredSkills: ['Data Structures', 'Algorithms', 'Java', 'System Design'],
    openings: 15,
    deadline: '2026-11-15',
    driveDate: '2026-11-20',
    description: 'Amazon is hiring top engineering talent for core tier-1 retail, AWS infrastructure, and logistics services teams.',
    rounds: ['Online Assessment (DSA + Work Style)', 'Technical Interview 1 (Algorithms)', 'Technical Interview 2 (System Design)', 'Bar Raiser (Behavioral STAR)']
  },
  {
    id: 'drive-microsoft-2026',
    company: 'Microsoft',
    logo: 'https://upload.wikimedia.org/wikipedia/commons/4/44/Microsoft_logo.svg',
    role: 'Software Engineer',
    packageCTC: '₹44.0 LPA',
    location: 'Hyderabad / Noida / Bangalore',
    minCgpa: 8.0,
    minReadiness: 80,
    targetRoles: ['Software Development Engineer'],
    requiredSkills: ['C++', 'DSA', 'Operating Systems', 'Cloud'],
    openings: 8,
    deadline: '2026-11-10',
    driveDate: '2026-11-18',
    description: 'Join Azure, Developer Division, or Office 365 engineering orgs building hyper-scale cloud platforms.',
    rounds: ['Online Coding Round', 'Technical Screening', 'System Architecture Round', 'Director / Culture Fit Interview']
  },
  {
    id: 'drive-tcs-digital-2026',
    company: 'TCS Digital',
    logo: 'https://upload.wikimedia.org/wikipedia/commons/b/b1/Tata_Consultancy_Services_Logo.svg',
    role: 'Digital Systems Engineer',
    packageCTC: '₹7.5 LPA',
    location: 'Pan-India',
    minCgpa: 6.5,
    minReadiness: 60,
    targetRoles: ['Software Development Engineer', 'Frontend Developer', 'Backend Developer', 'Data Scientist'],
    requiredSkills: ['Python', 'SQL', 'Aptitude', 'Java'],
    openings: 85,
    deadline: '2026-11-25',
    driveDate: '2026-12-02',
    description: 'Premier engineering talent stream at Tata Consultancy Services focused on AI, IoT, Cloud, and Cybersecurity innovation.',
    rounds: ['TCS NQT Advanced Cognitive & Coding', 'Technical + Managerial Interview', 'HR Final Round']
  },
  {
    id: 'drive-infosys-dse-2026',
    company: 'Infosys',
    logo: 'https://upload.wikimedia.org/wikipedia/commons/9/95/Infosys_logo.svg',
    role: 'Specialist Programmer (DSE)',
    packageCTC: '₹9.5 LPA',
    location: 'Bangalore / Pune',
    minCgpa: 7.0,
    minReadiness: 65,
    targetRoles: ['Software Development Engineer', 'Backend Developer'],
    requiredSkills: ['DSA', 'Competitive Programming', 'Python', 'Databases'],
    openings: 40,
    deadline: '2026-11-28',
    driveDate: '2026-12-05',
    description: 'High-impact product engineering group building financial technology and digital transformation suites.',
    rounds: ['InfyTQ / HackWithInfy Technical Challenge', 'System Design Interview', 'HR Behavioral Round']
  },
  {
    id: 'drive-deloitte-2026',
    company: 'Deloitte USI',
    logo: 'https://upload.wikimedia.org/wikipedia/commons/5/56/Deloitte.svg',
    role: 'Technology Consultant',
    packageCTC: '₹8.8 LPA',
    location: 'Hyderabad / Bangalore / Mumbai',
    minCgpa: 7.0,
    minReadiness: 65,
    targetRoles: ['Data Scientist', 'Software Development Engineer'],
    requiredSkills: ['SQL', 'Analytics', 'Communication', 'Python'],
    openings: 30,
    deadline: '2026-12-05',
    driveDate: '2026-12-12',
    description: 'Strategic IT advisory and enterprise AI solution engineering for Fortune 500 corporations worldwide.',
    rounds: ['Versant & Analytical Aptitude Assessment', 'Case Study Presentation', 'Partner Interview']
  },
  {
    id: 'drive-zoho-2026',
    company: 'Zoho Corporation',
    logo: 'https://upload.wikimedia.org/wikipedia/commons/6/6d/Zoho_Corporation_2023_logo.svg',
    role: 'Member Technical Staff',
    packageCTC: '₹8.5 LPA',
    location: 'Chennai / Tenkasi / Salem',
    minCgpa: 6.0,
    minReadiness: 60,
    targetRoles: ['Software Development Engineer', 'Frontend Developer', 'Backend Developer'],
    requiredSkills: ['C', 'Java', 'Problem Solving', 'Web Dev'],
    openings: 25,
    deadline: '2026-12-10',
    driveDate: '2026-12-18',
    description: 'SaaS product powerhouse crafting globally adopted enterprise software solutions from grassroots engineering.',
    rounds: ['Basic C/Java Problem Solving (No IDE)', 'Advanced Programming & Design', 'Technical HR Round']
  }
];

export const getDrives = async (req, res) => {
  try {
    const profile = await prisma.profile.findUnique({
      where: { userId: req.user.id },
      include: {
        education: true,
        skills: { include: { skill: true } }
      }
    });

    const userCgpa = profile?.education?.[0]?.cgpa || 7.0;
    const readinessScore = profile?.readinessScore || 70;
    const userSkills = (profile?.skills || []).map(s => s.skill.name.toLowerCase());
    const targetRole = profile?.targetRole || 'Software Development Engineer';

    // Evaluate live eligibility for each drive
    const drivesWithEligibility = CAMPUS_DRIVES.map(drive => {
      const meetsCgpa = userCgpa >= drive.minCgpa;
      const meetsReadiness = readinessScore >= drive.minReadiness;
      const isEligible = meetsCgpa && meetsReadiness;

      // Calculate skill overlap
      const matchingSkills = drive.requiredSkills.filter(sk => 
        userSkills.some(us => us.includes(sk.toLowerCase()) || sk.toLowerCase().includes(us))
      );
      const skillMatchPercentage = Math.round((matchingSkills.length / drive.requiredSkills.length) * 100);

      // Application status check
      const appKey = `${req.user.id}_${drive.id}`;
      const application = applications.get(appKey) || null;

      return {
        ...drive,
        isEligible,
        eligibilityDetails: {
          meetsCgpa,
          userCgpa,
          requiredCgpa: drive.minCgpa,
          meetsReadiness,
          userReadiness: Math.round(readinessScore),
          requiredReadiness: drive.minReadiness,
          skillMatchPercentage,
          matchingSkills
        },
        hasApplied: !!application,
        applicationStatus: application ? application.status : null,
        appliedAt: application ? application.appliedAt : null
      };
    });

    res.json({
      success: true,
      data: drivesWithEligibility,
      summary: {
        totalDrives: CAMPUS_DRIVES.length,
        eligibleDrives: drivesWithEligibility.filter(d => d.isEligible).length,
        appliedDrives: drivesWithEligibility.filter(d => d.hasApplied).length,
        userMetrics: {
          cgpa: userCgpa,
          readinessScore: Math.round(readinessScore),
          targetRole
        }
      }
    });
  } catch (error) {
    console.error('Error fetching drives:', error);
    res.status(500).json({ success: false, message: 'Failed to load recruitment drives' });
  }
};

export const applyToDrive = async (req, res) => {
  const { id } = req.params;
  const drive = CAMPUS_DRIVES.find(d => d.id === id);

  if (!drive) {
    return res.status(404).json({ success: false, message: 'Recruitment drive not found' });
  }

  try {
    const profile = await prisma.profile.findUnique({
      where: { userId: req.user.id },
      include: { education: true }
    });

    const userCgpa = profile?.education?.[0]?.cgpa || 7.0;
    const readinessScore = profile?.readinessScore || 70;

    if (userCgpa < drive.minCgpa) {
      return res.status(400).json({
        success: false,
        message: `CGPA requirement not met (Required: ${drive.minCgpa}, Your CGPA: ${userCgpa})`
      });
    }

    if (readinessScore < drive.minReadiness) {
      return res.status(400).json({
        success: false,
        message: `Placement Readiness score requirement not met (Required: ${drive.minReadiness}%, Your Score: ${Math.round(readinessScore)}%)`
      });
    }

    const appKey = `${req.user.id}_${drive.id}`;
    const applicationRecord = {
      driveId: drive.id,
      company: drive.company,
      role: drive.role,
      userId: req.user.id,
      studentName: req.user.name,
      appliedAt: new Date().toISOString(),
      status: 'APPLICATION_SUBMITTED'
    };

    applications.set(appKey, applicationRecord);

    res.json({
      success: true,
      message: `Successfully applied to ${drive.company} for ${drive.role}! Placement cell will notify of online assessment schedules.`,
      data: applicationRecord
    });
  } catch (error) {
    console.error('Error applying to drive:', error);
    res.status(500).json({ success: false, message: 'Application submission failed' });
  }
};
