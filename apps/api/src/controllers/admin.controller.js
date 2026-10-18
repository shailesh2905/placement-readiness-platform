import prisma from '../config/db.js';

// GET /api/v1/admin/analytics - Overview statistics
export const getAdminAnalytics = async (req, res) => {
  try {
    const students = await prisma.user.findMany({
      where: { role: 'STUDENT' },
      include: {
        profile: {
          include: {
            education: true,
            skills: { include: { skill: true } }
          }
        }
      }
    });

    const totalStudents = students.length;
    let readyCount = 0;
    let refiningCount = 0;
    let criticalCount = 0;
    let totalScoreSum = 0;

    students.forEach((s) => {
      const score = s.profile?.readinessScore || 45;
      totalScoreSum += score;
      if (score >= 80) readyCount++;
      else if (score >= 60) refiningCount++;
      else criticalCount++;
    });

    const avgScore = totalStudents > 0 ? (totalScoreSum / totalStudents).toFixed(1) : '0';

    // Skill frequency distribution
    const skillCountMap = {};
    students.forEach((s) => {
      s.profile?.skills?.forEach((stSkill) => {
        const name = stSkill.skill?.name;
        if (name) {
          skillCountMap[name] = (skillCountMap[name] || 0) + 1;
        }
      });
    });

    const topSkills = Object.entries(skillCountMap)
      .map(([name, count]) => ({ name, count }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 8);

    res.json({
      success: true,
      data: {
        totalStudents,
        readyCount,
        refiningCount,
        criticalCount,
        avgScore: parseFloat(avgScore),
        readyPercentage: totalStudents > 0 ? Math.round((readyCount / totalStudents) * 100) : 0,
        topSkills
      }
    });
  } catch (error) {
    console.error('Error in admin analytics:', error);
    res.status(500).json({ success: false, message: 'Server error fetching analytics' });
  }
};

// GET /api/v1/admin/students - Filterable student roster
export const getStudentsRoster = async (req, res) => {
  try {
    const { role, minScore, minCgpa, search } = req.query;

    const students = await prisma.user.findMany({
      where: { role: 'STUDENT' },
      include: {
        profile: {
          include: {
            education: true,
            skills: { include: { skill: true } }
          }
        }
      },
      orderBy: { createdAt: 'desc' }
    });

    // In-memory filter for flexible multi-criteria search
    let filtered = students.map((s) => {
      const p = s.profile || {};
      const edu = p.education?.[0] || {};
      const score = p.readinessScore || 45;
      let status = 'Significant Prep Needed';
      if (score >= 80) status = 'Placement Ready';
      else if (score >= 60) status = 'Needs Refinement';

      return {
        id: s.id,
        name: s.name,
        email: s.email,
        phone: p.phone || 'N/A',
        targetRole: p.targetRole || 'Software Development Engineer',
        degree: edu.degree || 'B.Tech CSE',
        university: edu.university || 'Hindustan University',
        cgpa: edu.cgpa || 7.5,
        graduationYear: edu.graduationYear || 2026,
        readinessScore: Math.round(score),
        status,
        skills: (p.skills || []).map((sk) => sk.skill?.name).filter(Boolean)
      };
    });

    if (search) {
      const q = search.toLowerCase();
      filtered = filtered.filter(
        (st) =>
          st.name.toLowerCase().includes(q) ||
          st.email.toLowerCase().includes(q) ||
          st.skills.some((sk) => sk.toLowerCase().includes(q))
      );
    }

    if (role && role !== 'ALL') {
      filtered = filtered.filter((st) => st.targetRole.toLowerCase().includes(role.toLowerCase()));
    }

    if (minScore) {
      filtered = filtered.filter((st) => st.readinessScore >= parseFloat(minScore));
    }

    if (minCgpa) {
      filtered = filtered.filter((st) => st.cgpa >= parseFloat(minCgpa));
    }

    res.json({
      success: true,
      count: filtered.length,
      data: filtered
    });
  } catch (error) {
    console.error('Error fetching students roster:', error);
    res.status(500).json({ success: false, message: 'Server error fetching student roster' });
  }
};

// GET /api/v1/admin/export-csv - Generate CSV for campus recruitment
export const exportRosterCSV = async (req, res) => {
  try {
    const students = await prisma.user.findMany({
      where: { role: 'STUDENT' },
      include: {
        profile: {
          include: {
            education: true,
            skills: { include: { skill: true } }
          }
        }
      }
    });

    let csv = 'Student ID,Full Name,Email,Phone,Degree,CGPA,Target Role,Readiness Score (%),Status,Verified Skills\n';

    students.forEach((s) => {
      const p = s.profile || {};
      const edu = p.education?.[0] || {};
      const score = Math.round(p.readinessScore || 45);
      const status = score >= 80 ? 'Placement Ready' : score >= 60 ? 'Needs Refinement' : 'Needs Preparation';
      const skills = (p.skills || []).map((sk) => sk.skill?.name).join('; ') || 'None';

      const row = [
        `"${s.id}"`,
        `"${s.name}"`,
        `"${s.email}"`,
        `"${p.phone || 'N/A'}"`,
        `"${edu.degree || 'B.Tech'}"`,
        edu.cgpa || 7.5,
        `"${p.targetRole || 'Software Development Engineer'}"`,
        score,
        `"${status}"`,
        `"${skills}"`
      ];
      csv += row.join(',') + '\n';
    });

    res.setHeader('Content-Type', 'text/csv');
    res.setHeader('Content-Disposition', 'attachment; filename="placement_candidates_roster.csv"');
    res.status(200).send(csv);
  } catch (error) {
    console.error('Error exporting CSV:', error);
    res.status(500).json({ success: false, message: 'Failed to generate CSV export' });
  }
};
