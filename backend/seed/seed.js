require('dotenv').config();

const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const { faker } = require('@faker-js/faker');

const User = require('../models/User');
const Volunteer = require('../models/Volunteer');
const Program = require('../models/Program');
const Application = require('../models/Application');

const programCategories = [
  'Education',
  'Food Support',
  'Healthcare',
  'Environment',
  'Women Empowerment',
];

const skillOptions = [
  'Teaching',
  'Management',
  'Fundraising',
  'First Aid',
  'Content Writing',
  'Event Planning',
  'Counselling',
  'Data Entry',
];

const statuses = ['pending', 'approved', 'approved', 'approved'];

function pickRandom(items) {
  return items[Math.floor(Math.random() * items.length)];
}

function getRandomSkills() {
  return faker.helpers.arrayElements(skillOptions, { min: 2, max: 4 });
}

async function clearData() {
  await Application.deleteMany();
  await Volunteer.deleteMany();
  await Program.deleteMany();
  await User.deleteMany();

  console.log('Data cleared');
}

async function createAdmin(hashedPassword) {
  return User.create({
    name: 'Admin',
    email: 'admin@gmail.com',
    password: hashedPassword,
    role: 'Admin',
  });
}

async function createVolunteers(hashedPassword) {
  const volunteers = [];

  for (let i = 0; i < 30; i += 1) {
    const user = await User.create({
      name: faker.person.fullName(),
      email: faker.internet.email().toLowerCase(),
      password: hashedPassword,
      role: 'Volunteer',
    });

    const volunteer = await Volunteer.create({
      user: user._id,
      phone: faker.phone.number(),
      city: faker.location.city(),
      skills: getRandomSkills(),
      availability: pickRandom(['Weekends', 'Weekdays', 'Evenings', 'Flexible']),
      status: pickRandom(statuses),
    });

    volunteers.push(volunteer);
  }

  return volunteers;
}

async function createPrograms(adminId) {
  const programs = [];

  for (let i = 0; i < 12; i += 1) {
    const category = pickRandom(programCategories);

    const program = await Program.create({
      title: `${category} Drive - ${faker.location.city()}`,
      description: faker.lorem.paragraph({ min: 3, max: 5 }),
      location: faker.location.city(),
      category,
      date: faker.date.future({ years: 1 }),
      createdBy: adminId,
    });

    programs.push(program);
  }

  return programs;
}

async function createApplications(volunteers, programs) {
  const usedPairs = new Set();
  const applications = [];

  while (applications.length < 50) {
    const volunteer = pickRandom(volunteers);
    const program = pickRandom(programs);
    const pairKey = `${volunteer._id}-${program._id}`;

    if (usedPairs.has(pairKey)) {
      continue;
    }

    usedPairs.add(pairKey);

    const application = await Application.create({
      volunteer: volunteer._id,
      program: program._id,
      status: pickRandom(['pending', 'pending', 'approved']),
    });

    applications.push(application);
  }

  return applications;
}

async function seedDatabase() {
  try {
    if (!process.env.URI) {
      throw new Error('URI is missing in .env');
    }

    await mongoose.connect(process.env.URI);
    console.log('MongoDB connected');

    await clearData();

    const hashedPassword = await bcrypt.hash('admin123', 10);
    const admin = await createAdmin(hashedPassword);
    const volunteers = await createVolunteers(hashedPassword);
    const programs = await createPrograms(admin._id);
    const applications = await createApplications(volunteers, programs);

    console.log(`Users created: ${volunteers.length + 1}`);
    console.log(`Volunteers created: ${volunteers.length}`);
    console.log(`Programs created: ${programs.length}`);
    console.log(`Applications created: ${applications.length}`);
    console.log('Database seeded');
  } catch (error) {
    console.log(error);
  } finally {
    await mongoose.connection.close();
    process.exit();
  }
}

seedDatabase();
