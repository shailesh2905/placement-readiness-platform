import prisma from '../config/db.js';

// Predefined Role-Skill Competency Matrix (Phase 8)
export const ROLE_MATRIX = {
  SDE: {
    id: 'SDE',
    title: 'Software Development Engineer (Full Stack)',
    category: 'Engineering',
    requiredSkills: ['Data Structures & Algorithms', 'JavaScript', 'React', 'Node.js', 'SQL', 'Git', 'Docker'],
    benchmarks: {
      cgpa: 7.5,
      dsa_score: 75,
      technical_score: 70,
      aptitude_score: 65,
      communication_score: 65
    },
    description: 'Focuses on end-to-end web architectures, algorithmic problem solving, scalable databases, and clean code.'
  },
  DATA_SCIENTIST: {
    id: 'DATA_SCIENTIST',
    title: 'Data Scientist / Machine Learning Engineer',
    category: 'Data & AI',
    requiredSkills: ['Python', 'Machine Learning', 'SQL', 'Pandas', 'NumPy', 'Data Structures & Algorithms', 'FastAPI'],
    benchmarks: {
      cgpa: 7.5,
      dsa_score: 65,
      technical_score: 80,
      aptitude_score: 75,
      communication_score: 60
    },
    description: 'Specializes in statistical modeling, feature engineering, predictive analytics, and ML pipeline deployment.'
  },
  FRONTEND_DEV: {
    id: 'FRONTEND_DEV',
    title: 'Frontend Engineer (React / Next.js)',
    category: 'Frontend',
    requiredSkills: ['JavaScript', 'TypeScript', 'React', 'HTML/CSS', 'Tailwind CSS', 'Git', 'Next.js'],
    benchmarks: {
      cgpa: 7.0,
      dsa_score: 60,
      technical_score: 85,
      aptitude_score: 60,
      communication_score: 70
    },
    description: 'Expertise in responsive UI, state management, modern CSS frameworks, and performant web applications.'
  },
  BACKEND_DEV: {
    id: 'BACKEND_DEV',
    title: 'Backend & Cloud Systems Engineer',
    category: 'Backend & Cloud',
    requiredSkills: ['Node.js', 'Express', 'SQL', 'PostgreSQL', 'MongoDB', 'Docker', 'AWS', 'Data Structures & Algorithms'],
    benchmarks: {
      cgpa: 7.0,
      dsa_score: 70,
      technical_score: 80,
      aptitude_score: 65,
      communication_score: 60
    },
    description: 'Designs reliable RESTful microservices, database schemas, authentication systems, and cloud deployments.'
  }
};

// In-memory progress store for demo persistence (or stored in profile)
const studentProgressStore = {};

// GET /api/v1/learning-plan
export const getSkillGapAndPlan = async (req, res) => {
  try {
    const userId = req.user.id;
    const requestedRole = req.query.role;

    const profile = await prisma.profile.findUnique({
      where: { userId },
      include: {
        education: true,
        skills: { include: { skill: true } },
        projects: true,
        experiences: true,
        attempts: {
          include: { assessment: true }
        }
      }
    });

    if (!profile) {
      return res.status(404).json({ success: false, message: 'Student profile not found.' });
    }

    // Determine target role
    let activeRoleKey = 'SDE';
    if (requestedRole && ROLE_MATRIX[requestedRole]) {
      activeRoleKey = requestedRole;
    } else if (profile.targetRole) {
      const lower = profile.targetRole.toLowerCase();
      if (lower.includes('data') || lower.includes('machine learning')) activeRoleKey = 'DATA_SCIENTIST';
      else if (lower.includes('front')) activeRoleKey = 'FRONTEND_DEV';
      else if (lower.includes('back') || lower.includes('cloud')) activeRoleKey = 'BACKEND_DEV';
    }

    const targetMatrix = ROLE_MATRIX[activeRoleKey];

    // 1. Skill Gap Analysis (Phase 8)
    const studentSkillNames = (profile.skills || []).map(s => s.skill.name.toLowerCase());
    const acquiredSkills = [];
    const missingSkills = [];

    targetMatrix.requiredSkills.forEach(reqSkill => {
      const isMatched = studentSkillNames.some(s => s.includes(reqSkill.toLowerCase()) || reqSkill.toLowerCase().includes(s));
      if (isMatched) {
        acquiredSkills.push(reqSkill);
      } else {
        missingSkills.push(reqSkill);
      }
    });

    const skillMatchPercentage = Math.round(
      (acquiredSkills.length / targetMatrix.requiredSkills.length) * 100
    );

    // Compute Assessment Performance against benchmarks
    const completedAttempts = (profile.attempts || []).filter(a => a.status === 'COMPLETED');
    let avgScore = 40;
    if (completedAttempts.length > 0) {
      avgScore = Math.round(
        completedAttempts.reduce((acc, curr) => acc + (curr.totalScore || 0), 0) / completedAttempts.length
      );
    }

    const currentMetrics = {
      cgpa: profile.education?.[0]?.cgpa || 7.8,
      dsa_score: Math.min(Math.round(avgScore * 0.9 + (acquiredSkills.includes('Data Structures & Algorithms') ? 30 : 0)), 100),
      technical_score: Math.min(Math.round(avgScore * 0.85 + (acquiredSkills.length * 6)), 100),
      aptitude_score: Math.min(Math.round(avgScore * 0.8 + 15), 100),
      communication_score: 70
    };

    const benchmarkGaps = {
      dsa: Math.max(0, targetMatrix.benchmarks.dsa_score - currentMetrics.dsa_score),
      technical: Math.max(0, targetMatrix.benchmarks.technical_score - currentMetrics.technical_score),
      aptitude: Math.max(0, targetMatrix.benchmarks.aptitude_score - currentMetrics.aptitude_score)
    };

    // 2. Dynamic 4-Week Learning Roadmap Generation (Phase 9)
    const learningRoadmap = [
      {
        week: 1,
        title: 'Core Problem Solving & Algorithmic Patterns',
        theme: 'Data Structures & Algorithms',
        status: 'In Progress',
        estimatedHours: 12,
        tasks: [
          {
            id: `${activeRoleKey}-w1-t1`,
            title: 'Arrays & Two Pointers Mastery',
            desc: 'Practice Two Sum, 3Sum, Container With Most Water (LeetCode Top 75).',
            type: 'PRACTICE',
            completed: false
          },
          {
            id: `${activeRoleKey}-w1-t2`,
            title: 'Sliding Window & Binary Search',
            desc: 'Solve 5 medium difficulty questions on LeetCode focusing on O(log N) searches.',
            type: 'PRACTICE',
            completed: false
          },
          {
            id: `${activeRoleKey}-w1-t3`,
            title: 'Placement Assessment: DSA Mock 1',
            desc: 'Take timed 30-min Technical assessment on the Placement platform.',
            type: 'ASSESSMENT',
            completed: false
          }
        ]
      },
      {
        week: 2,
        title: `${targetMatrix.title} Domain Competencies`,
        theme: 'Core Frameworks & Databases',
        status: 'Upcoming',
        estimatedHours: 14,
        tasks: [
          {
            id: `${activeRoleKey}-w2-t1`,
            title: `Close Gap: ${missingSkills[0] || 'Database Optimization & Indexing'}`,
            desc: `Master core principles of ${missingSkills[0] || 'SQL query tuning'} for technical interviews.`,
            type: 'THEORY_PRACTICE',
            completed: false
          },
          {
            id: `${activeRoleKey}-w2-t2`,
            title: `Hands-on Project Architecture: ${missingSkills[1] || 'REST APIs & State'}`,
            desc: `Implement practical feature using ${missingSkills[1] || 'Express / React'} in your portfolio repository.`,
            type: 'PROJECT',
            completed: false
          },
          {
            id: `${activeRoleKey}-w2-t3`,
            title: 'System Design & Scalability Fundamentals',
            desc: 'Review caching (Redis), indexing strategies, and database normalization.',
            type: 'THEORY',
            completed: false
          }
        ]
      },
      {
        week: 3,
        title: 'Quantitative Aptitude, Logical Reasoning & Soft Skills',
        theme: 'Recruiter Screening Rounds',
        status: 'Upcoming',
        estimatedHours: 10,
        tasks: [
          {
            id: `${activeRoleKey}-w3-t1`,
            title: 'Speed Math, Permutations & Probability',
            desc: 'Solve 25 quantitative aptitude problems typical in campus placement round 1.',
            type: 'APTITUDE',
            completed: false
          },
          {
            id: `${activeRoleKey}-w3-t2`,
            title: 'Behavioral Preparation (STAR Framework)',
            desc: 'Draft answers for: "Tell me about a challenging project" and "How do you handle conflict?".',
            type: 'COMMUNICATION',
            completed: false
          },
          {
            id: `${activeRoleKey}-w3-t3`,
            title: 'Placement Assessment: Aptitude Mock',
            desc: 'Complete the Aptitude & Quantitative screening test on the platform.',
            type: 'ASSESSMENT',
            completed: false
          }
        ]
      },
      {
        week: 4,
        title: 'Interview Simulation, ATS Resume Check & Final Polish',
        theme: 'Placement Drive Readiness',
        status: 'Upcoming',
        estimatedHours: 8,
        tasks: [
          {
            id: `${activeRoleKey}-w4-t1`,
            title: 'AI Resume Keyword Optimization',
            desc: `Re-upload resume to ensure all target competencies (${targetMatrix.requiredSkills.slice(0, 4).join(', ')}) are highlighted.`,
            type: 'RESUME',
            completed: false
          },
          {
            id: `${activeRoleKey}-w4-t2`,
            title: 'Peer Mock Technical Interview',
            desc: 'Conduct a 45-minute live pair coding simulation with a peer or faculty mentor.',
            type: 'MOCK',
            completed: false
          },
          {
            id: `${activeRoleKey}-w4-t3`,
            title: 'Final Full-Length Placement Readiness Exam',
            desc: 'Submit all assessments to achieve a Placement Ready score (≥ 80%).',
            type: 'FINAL_EVAL',
            completed: false
          }
        ]
      }
    ];

    // Merge persisted student task completions
    const completedTasks = studentProgressStore[userId] || [];
    let totalTasksCount = 0;
    let completedTasksCount = 0;

    learningRoadmap.forEach(w => {
      w.tasks.forEach(t => {
        totalTasksCount++;
        if (completedTasks.includes(t.id)) {
          t.completed = true;
          completedTasksCount++;
        }
      });
    });

    const overallProgress = totalTasksCount > 0 
      ? Math.round((completedTasksCount / totalTasksCount) * 100) 
      : 0;

    res.json({
      success: true,
      data: {
        activeRole: targetMatrix,
        allRoles: Object.values(ROLE_MATRIX).map(r => ({ id: r.id, title: r.title, category: r.category })),
        skillGapAnalysis: {
          matchPercentage: skillMatchPercentage,
          acquiredSkills,
          missingSkills,
          benchmarkGaps,
          currentMetrics,
          benchmarks: targetMatrix.benchmarks
        },
        learningRoadmap,
        progress: {
          totalTasks: totalTasksCount,
          completedTasks: completedTasksCount,
          progressPercentage: overallProgress
        }
      }
    });

  } catch (error) {
    console.error('Error generating learning plan:', error);
    res.status(500).json({ success: false, message: 'Server error generating learning plan' });
  }
};

// POST /api/v1/learning-plan/progress
export const toggleTaskProgress = async (req, res) => {
  try {
    const userId = req.user.id;
    const { taskId, completed } = req.body;

    if (!studentProgressStore[userId]) {
      studentProgressStore[userId] = [];
    }

    if (completed) {
      if (!studentProgressStore[userId].includes(taskId)) {
        studentProgressStore[userId].push(taskId);
      }
    } else {
      studentProgressStore[userId] = studentProgressStore[userId].filter(id => id !== taskId);
    }

    res.json({
      success: true,
      message: 'Progress updated',
      completedTasks: studentProgressStore[userId]
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: 'Failed to update progress' });
  }
};
