import prisma from '../config/db.js';

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
      create: { userId: req.user.id, phone, location, targetRole }
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
