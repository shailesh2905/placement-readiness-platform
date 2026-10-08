import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('Seeding Database with Assessments and Questions...');

  const assessment = await prisma.assessment.create({
    data: {
      title: 'Software Engineering Core Assessment',
      description: 'Test your knowledge on DSA, React, and SQL.',
      category: 'TECHNICAL',
      difficulty: 'MEDIUM',
      timeLimit: 15,
      questions: {
        create: [
          {
            question: {
              create: {
                text: 'What is the time complexity of binary search?',
                options: JSON.stringify(['O(1)', 'O(n)', 'O(log n)', 'O(n log n)']),
                correctAnswer: 'O(log n)',
                topic: 'DSA',
                difficulty: 'EASY',
                skill: 'Algorithms',
                explanation: 'Binary search halves the search space each time, resulting in O(log n) complexity.',
                marks: 2
              }
            }
          },
          {
            question: {
              create: {
                text: 'Which hook in React is used to manage side effects?',
                options: JSON.stringify(['useState', 'useEffect', 'useContext', 'useReducer']),
                correctAnswer: 'useEffect',
                topic: 'React',
                difficulty: 'EASY',
                skill: 'Frontend',
                explanation: 'useEffect is used for side effects like data fetching and subscriptions.',
                marks: 2
              }
            }
          },
          {
            question: {
              create: {
                text: 'What SQL keyword is used to filter results after an aggregation?',
                options: JSON.stringify(['WHERE', 'FILTER', 'HAVING', 'GROUP BY']),
                correctAnswer: 'HAVING',
                topic: 'SQL',
                difficulty: 'MEDIUM',
                skill: 'Database',
                explanation: 'HAVING filters records that work on summarized GROUP BY results.',
                marks: 2
              }
            }
          }
        ]
      }
    }
  });

  console.log('Seeded Assessment: ', assessment.title);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
