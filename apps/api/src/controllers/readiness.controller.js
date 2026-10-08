import prisma from '../config/db.js';
import axios from 'axios';

const ML_API_URL = process.env.ML_API_URL || 'http://localhost:8001';

export const getReadinessScore = async (req, res) => {
  try {
    const userId = req.user.id;

    const profile = await prisma.profile.findUnique({
      where: { userId },
      include: {
        education: true,
        skills: { include: { skill: true } },
        projects: true,
        experiences: true,
        attempts: {
          include: {
            assessment: true
          }
        }
      }
    });

    if (!profile) return res.status(404).json({ success: false, message: 'Profile not found' });

    // Aggregate Data to send to ML Service
    
    // CGPA Calculation (average if multiple)
    let cgpa = 0;
    if (profile.education.length > 0) {
      cgpa = profile.education.reduce((acc, curr) => acc + curr.cgpa, 0) / profile.education.length;
    }

    // Projects & Internships
    const projects_count = profile.projects.length;
    const internships_count = profile.experiences.length;

    // Default scores based on self-reported skills if no assessments taken
    let dsa_score = 30;
    let react_score = 30;
    let sql_score = 30;
    let aptitude_score = 30;
    let communication_score = 30;

    // Refine scores based on actual Assessment Attempts
    // We categorize assessments based on their categories
    const attempts = profile.attempts.filter(a => a.status === 'COMPLETED');
    
    attempts.forEach(attempt => {
      // Very basic scoring logic for demo
      // Assuming attempt.totalScore is out of 100 for simplicity here, 
      // or we scale it if needed. 
      // Let's assume standard out of 100.
      const score = (attempt.totalScore || 0) * 10; // Demo scaling
      
      if (attempt.assessment.title.toLowerCase().includes('software')) {
        dsa_score = Math.max(dsa_score, score);
        react_score = Math.max(react_score, score);
        sql_score = Math.max(sql_score, score);
      }
      if (attempt.assessment.category === 'APTITUDE') {
        aptitude_score = Math.max(aptitude_score, score);
      }
      if (attempt.assessment.category === 'COMMUNICATION') {
        communication_score = Math.max(communication_score, score);
      }
    });

    // Form payload for ML service
    const mlPayload = {
      cgpa,
      dsa_score,
      react_score,
      sql_score,
      aptitude_score,
      communication_score,
      projects_count,
      internships_count
    };

    // Call Python ML Microservice
    const mlResponse = await axios.post(`${ML_API_URL}/predict-readiness`, mlPayload);
    const mlData = mlResponse.data;

    // Save readiness score to profile optionally
    await prisma.profile.update({
      where: { id: profile.id },
      data: { readinessScore: mlData.readiness_score }
    });

    res.json({
      success: true,
      data: mlData
    });

  } catch (error) {
    console.error("ML Service Error:", error.message);
    res.status(500).json({ success: false, message: 'Error calculating readiness. Ensure ML Service is running.' });
  }
};
