📘 Application Overview – MCQ Management System with Levels

This application is an Admin and Student-based MCQ (Multiple Choice Questions) Management System designed to create, manage, deliver, and evaluate MCQ-based assessments. The system supports two methods of question creation: manual entry by administrators and automatic question generation using AI. All questions are organized by difficulty levels, and students must complete each level before unlocking the next one.

The main objective of this system is to provide a structured, scalable, and automated platform for conducting MCQ-based tests while tracking student performance and learning progress.

🧑‍💼 Admin Module – What the Admin Can Do

The admin dashboard is simplified to show only two main sections:

1. Manage Questions
2. Manage Students

This ensures the admin interface remains clean and focused only on essential functionalities.

1️⃣ Manage Questions

The “Manage Questions” section allows administrators to create and manage MCQs in two different ways:

➤ Manual Question Creation

In this method, the admin manually enters questions into the system. The admin can:

- Select the subject and topic of the question
- Choose the difficulty level (for example: easy, medium, hard)
- Enter the question text
- Decide how many answer options the question should have
- Enter each option dynamically based on the selected number
- Select the correct answer from the entered options

These manually created questions are stored in the database under a dedicated collection for manual questions. Each question is tagged with its difficulty level so that it can later be filtered and shown to students based on their current level.

➤ AI-Generated Questions

In this method, the admin provides inputs such as:

- Subject
- Topic
- Number of questions required
- Difficulty level

Based on these inputs, the system automatically generates MCQ questions along with multiple answer options and correct answers using an AI-based question generation mechanism. These questions are stored separately in the database under a dedicated collection for AI-generated questions. Each AI-generated question also includes the selected difficulty level to ensure proper categorization and retrieval.

This separation between manual and AI-generated questions helps in better management, analysis, and future expansion of the system.

🎯 Level-Based Question Management

All questions in the system are organized based on difficulty levels such as:

- Easy
- Medium
- Hard

Both manually created questions and AI-generated questions are stored along with their respective difficulty levels. This allows the system to fetch and display questions to students based on their current learning stage.

The level-based structure ensures that students follow a progressive learning path, starting from easier questions and moving towards more complex ones only after completing the previous levels.

🧑‍🎓 Student Module – What the Student Can Do

The student dashboard allows students to attempt MCQ tests based on their unlocked difficulty levels.

1️⃣ Question Access

Students can view and attempt questions that belong only to the difficulty levels that are currently unlocked for them. Questions are fetched from both manual and AI-generated question collections and displayed together in a unified test interface. This provides a diverse set of questions while maintaining a consistent difficulty level.

2️⃣ Level Locking Mechanism

The system enforces a level-locking mechanism to ensure structured progression:

- Students must complete and pass the Entry/Easy level before accessing the Medium level.
- Students must complete and pass the Medium level before accessing the Hard level.

Until a student successfully completes the current level, higher levels remain locked and cannot be accessed. This encourages gradual learning and prevents students from skipping foundational content.

3️⃣ Answer Submission and Validation

When a student attempts an MCQ test:

- The system compares the selected answer with the correct answer stored in the database.
- Each response is evaluated instantly to determine whether it is correct or incorrect.

This validation ensures accurate scoring and fair assessment of student performance.

📊 Student Performance Tracking

After a student completes a test, the system records detailed performance data, including:

- Which questions the student attempted
- Which answers were selected
- Which questions were answered correctly
- The difficulty level of each attempted question

These records are stored in a separate database collection dedicated to student results. This allows the system to track performance over time and analyze student progress.

🔓 Level Unlocking Based on Performance

The system automatically evaluates the student’s performance at the end of each level. If the student meets the required performance criteria (such as achieving a minimum score or pass percentage), the next difficulty level is unlocked for that student.

This creates a controlled learning path where students advance only after demonstrating sufficient understanding of the current level.

🎯 Overall System Objective

The system brings together content creation, assessment delivery, and performance tracking into a single platform. It enables:

- Admins to efficiently create and manage MCQs using both manual input and AI generation
- Structured organization of questions based on difficulty levels
- Controlled access to questions through level-based locking
- Automated evaluation of student answers
- Long-term tracking of student performance and progress

Overall, this application provides a robust and scalable solution for conducting MCQ-based assessments in educational and training environments, ensuring both flexibility for administrators and a guided learning experience for students.
