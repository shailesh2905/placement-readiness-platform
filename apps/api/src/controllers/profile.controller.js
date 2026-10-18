import prisma from '../config/db.js';
import FormData from 'form-data';
import axios from 'axios';

const ML_API_URL = process.env.ML_API_URL || 'http://localhost:8001';

// Get Profile
export const getProfile = async (req, res) => {
  try {
    let profile = await prisma.profile.findUnique({
      where: { userId: req.user.id },
      include: {
        education: true,
        skills: { include: { skill: true } },
        projects: true,
        experiences: true,
        certifications: true
      }
    });

    if (!profile) {
      // Auto-create basic profile if it doesn't exist
      profile = await prisma.profile.create({
        data: {
          userId: req.user.id
        },
        include: {
          education: true,
          skills: { include: { skill: true } },
          projects: true,
          experiences: true,
          certifications: true
        }
      });
    }

    res.json({ success: true, data: profile });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

// Update Profile
export const updateProfile = async (req, res) => {
  const { phone, location, targetRole } = req.body;

  try {
    const profile = await prisma.profile.upsert({
      where: { userId: req.user.id },
      update: { phone, location, targetRole },
      create: { userId: req.user.id, phone, location, targetRole },
      include: {
        education: true,
        skills: { include: { skill: true } },
        projects: true,
        experiences: true,
        certifications: true
      }
    });
    res.json({ success: true, data: profile });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

// Add Education
export const addEducation = async (req, res) => {
  const { degree, university, cgpa, graduationYear } = req.body;
  
  try {
    const profile = await prisma.profile.findUnique({ where: { userId: req.user.id } });
    if (!profile) return res.status(404).json({ success: false, message: 'Profile not found' });

    const education = await prisma.education.create({
      data: {
        profileId: profile.id,
        degree,
        university,
        cgpa: parseFloat(cgpa),
        graduationYear: parseInt(graduationYear)
      }
    });
    res.status(201).json({ success: true, data: education });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

// Upload & Parse Resume via AI Microservice
export const uploadResume = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ success: false, message: 'No resume PDF file uploaded.' });
    }

    // Forward file buffer to Python ML Service
    const form = new FormData();
    form.append('file', req.file.buffer, {
      filename: req.file.originalname || 'resume.pdf',
      contentType: 'application/pdf'
    });

    const mlResponse = await axios.post(`${ML_API_URL}/parse-resume`, form, {
      headers: {
        ...form.getHeaders()
      },
      timeout: 30000
    });

    const parsedData = mlResponse.data?.data;
    if (!parsedData) {
      return res.status(500).json({ success: false, message: 'Failed to extract resume data from AI engine.' });
    }

    // Ensure student profile exists
    let profile = await prisma.profile.findUnique({
      where: { userId: req.user.id },
      include: { education: true, skills: true }
    });

    if (!profile) {
      profile = await prisma.profile.create({
        data: { userId: req.user.id }
      });
    }

    // 1. Update phone if present and not set
    const updateData = {};
    if (parsedData.phone && !profile.phone) {
      updateData.phone = parsedData.phone;
    }
    if (Object.keys(updateData).length > 0) {
      await prisma.profile.update({
        where: { id: profile.id },
        data: updateData
      });
    }

    // 2. Add education if extracted and none exists
    if (parsedData.education_degree && (!profile.education || profile.education.length === 0)) {
      await prisma.education.create({
        data: {
          profileId: profile.id,
          degree: parsedData.education_degree,
          university: 'University / College',
          cgpa: parsedData.extracted_cgpa || 8.0,
          graduationYear: 2026
        }
      });
    }

    // 3. Upsert extracted skills into DB and link to profile
    const skillsAdded = [];
    if (Array.isArray(parsedData.skills) && parsedData.skills.length > 0) {
      for (const skillName of parsedData.skills) {
        const skillRecord = await prisma.skill.upsert({
          where: { name: skillName },
          update: {},
          create: {
            name: skillName,
            category: 'TECHNICAL'
          }
        });

        await prisma.studentSkill.upsert({
          where: {
            profileId_skillId: {
              profileId: profile.id,
              skillId: skillRecord.id
            }
          },
          update: {},
          create: {
            profileId: profile.id,
            skillId: skillRecord.id,
            level: 'INTERMEDIATE'
          }
        });
        skillsAdded.push(skillName);
      }
    }

    // Re-fetch the updated profile with relations
    const updatedProfile = await prisma.profile.findUnique({
      where: { id: profile.id },
      include: {
        education: true,
        skills: { include: { skill: true } },
        projects: true,
        experiences: true,
        certifications: true
      }
    });

    res.json({
      success: true,
      message: 'Resume parsed and profile updated successfully!',
      extracted: parsedData,
      skillsAdded,
      data: updatedProfile
    });

  } catch (error) {
    console.error('Resume Parsing Error:', error.response?.data || error.message);
    const errorMsg = error.response?.data?.detail || error.message || 'Error processing resume';
    res.status(500).json({ success: false, message: `Resume parsing failed: ${errorMsg}` });
  }
};

