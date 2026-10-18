import prisma from '../config/db.js';

// In-memory feedback store (persists across runtime)
const mentorFeedbackStore = {};

// GET /api/v1/mentor/students
export const getMentorStudents = async (req, res) => {
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

    const mentees = students.map((s) => {
      const p = s.profile || {};
      const score = Math.round(p.readinessScore || 45);
      const skills = (p.skills || []).map((sk) => sk.skill?.name).filter(Boolean);

      return {
        id: s.id,
        name: s.name,
        email: s.email,
        phone: p.phone || 'N/A',
        targetRole: p.targetRole || 'Software Development Engineer',
        degree: p.education?.[0]?.degree || 'B.Tech',
        cgpa: p.education?.[0]?.cgpa || 8.0,
        readinessScore: score,
        status: score >= 80 ? 'Placement Ready' : score >= 60 ? 'Needs Refinement' : 'Needs Preparation',
        skills,
        feedback: mentorFeedbackStore[s.id] || []
      };
    });

    res.json({
      success: true,
      count: mentees.length,
      data: mentees
    });
  } catch (error) {
    console.error('Error fetching mentor students:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

// POST /api/v1/mentor/feedback
export const submitMentorFeedback = async (req, res) => {
  try {
    const { studentId, technicalRating, communicationRating, remarks } = req.body;

    if (!studentId || !remarks) {
      return res.status(400).json({ success: false, message: 'Student ID and remarks are required' });
    }

    if (!mentorFeedbackStore[studentId]) {
      mentorFeedbackStore[studentId] = [];
    }

    const newFeedback = {
      id: 'fb-' + Date.now(),
      mentorName: req.user.name || 'Faculty Reviewer',
      technicalRating: parseInt(technicalRating) || 4,
      communicationRating: parseInt(communicationRating) || 4,
      remarks,
      createdAt: new Date().toISOString()
    };

    mentorFeedbackStore[studentId].unshift(newFeedback);

    res.json({
      success: true,
      message: 'Feedback submitted successfully',
      feedback: newFeedback
    });
  } catch (error) {
    console.error('Error saving mentor feedback:', error);
    res.status(500).json({ success: false, message: 'Server error saving feedback' });
  }
};
