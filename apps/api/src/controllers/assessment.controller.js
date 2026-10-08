import prisma from '../config/db.js';

// Get all available assessments
export const getAssessments = async (req, res) => {
  try {
    const assessments = await prisma.assessment.findMany({
      include: {
        _count: {
          select: { questions: true }
        }
      }
    });
    res.json({ success: true, data: assessments });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

// Get single assessment with questions (hiding answers)
export const getAssessmentById = async (req, res) => {
  try {
    const { id } = req.params;
    
    const assessment = await prisma.assessment.findUnique({
      where: { id },
      include: {
        questions: {
          include: {
            question: {
              select: {
                id: true,
                text: true,
                options: true,
                topic: true,
                difficulty: true,
                marks: true
              }
            }
          }
        }
      }
    });

    if (!assessment) {
      return res.status(404).json({ success: false, message: 'Assessment not found' });
    }

    res.json({ success: true, data: assessment });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

// Submit assessment and calculate score
export const submitAssessment = async (req, res) => {
  try {
    const { id } = req.params;
    const { answers } = req.body; // Array of { questionId, selectedOption }
    const userId = req.user.id;

    const profile = await prisma.profile.findUnique({ where: { userId } });
    if (!profile) return res.status(404).json({ success: false, message: 'Profile not found' });

    // Fetch the actual questions to verify answers
    const assessmentQuestions = await prisma.assessmentQuestion.findMany({
      where: { assessmentId: id },
      include: { question: true }
    });

    let totalScore = 0;
    const answerRecords = [];

    for (const aq of assessmentQuestions) {
      const q = aq.question;
      const studentAnswer = answers.find(a => a.questionId === q.id);
      
      let isCorrect = false;
      let marksAwarded = 0;
      
      if (studentAnswer && studentAnswer.selectedOption === q.correctAnswer) {
        isCorrect = true;
        marksAwarded = q.marks;
        totalScore += marksAwarded;
      }

      answerRecords.push({
        questionId: q.id,
        selectedOption: studentAnswer?.selectedOption || null,
        isCorrect,
        marksAwarded
      });
    }

    // Save the attempt
    const attempt = await prisma.attempt.create({
      data: {
        profileId: profile.id,
        assessmentId: id,
        status: 'COMPLETED',
        totalScore,
        endTime: new Date(),
        answers: {
          create: answerRecords
        }
      },
      include: {
        answers: true
      }
    });

    res.json({ success: true, data: attempt });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

// Get Assessment Result (Attempt)
export const getAttemptById = async (req, res) => {
  try {
    const { attemptId } = req.params;
    const attempt = await prisma.attempt.findUnique({
      where: { id: attemptId },
      include: {
        assessment: true,
        answers: {
          include: {
            question: true
          }
        }
      }
    });

    if (!attempt) return res.status(404).json({ success: false, message: 'Attempt not found' });
    
    // Ensure the student owns this attempt
    const profile = await prisma.profile.findUnique({ where: { userId: req.user.id } });
    if (attempt.profileId !== profile.id) {
      return res.status(403).json({ success: false, message: 'Not authorized to view this attempt' });
    }

    res.json({ success: true, data: attempt });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};
