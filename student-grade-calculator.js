/**
 * Simple Student Grade Calculator (ES6)
 * ------------------------------------
 * Demonstrates:
 * - class
 * - arrow functions
 * - template strings (formatted output)
 * - default parameters (when marks not provided)
 * - rest parameters (collect variable number of marks)
 * - map, filter, find, every, some
 *
 * Run:
 *   node student-grade-calculator.js
 */

// ---------- Helpers (arrow functions) ----------

// Default mark to use when a student has no marks provided
const DEFAULT_MARK = 0;

// Keep marks within 0..100 and coerce to Number
const normalizeMark = (mark = DEFAULT_MARK) => {
  const n = Number(mark);
  if (Number.isNaN(n)) return DEFAULT_MARK;
  return Math.max(0, Math.min(100, n));
};

const average = (marks = []) => {
  if (marks.length === 0) return 0;
  const sum = marks.reduce((acc, m) => acc + m, 0);
  return sum / marks.length;
};

// Grade rule (simple and common)
const gradeFromAvg = (avg = 0) => {
  if (avg >= 90) return "A";
  if (avg >= 80) return "B";
  if (avg >= 70) return "C";
  if (avg >= 60) return "D";
  return "F";
};

// ---------- Core (class) ----------

class Student {
  /**
   * @param {string} name
   * @param {number[]} marks - default parameter: if marks not provided, it becomes []
   */
  constructor(name, marks = []) {
    this.name = name;
    // map: normalize all marks
    this.marks = marks.map(normalizeMark);
  }

  /**
   * rest parameter: accept any number of marks
   * @param  {...number} newMarks
   */
  addMarks(...newMarks) {
    // map: normalize incoming marks, then push
    const cleaned = newMarks.map(normalizeMark);
    this.marks.push(...cleaned);
    return this; // chaining-friendly
  }

  get average() {
    return average(this.marks);
  }

  get grade() {
    return gradeFromAvg(this.average);
  }

  /**
   * template string: formatted display
   */
  toString() {
    const marksText = this.marks.length ? this.marks.join(", ") : "(no marks)";
    return (
      `Student: ${this.name}\n` +
      `  Marks: ${marksText}\n` +
      `  Average: ${this.average.toFixed(2)}\n` +
      `  Grade: ${this.grade}\n`
    );
  }
}

class GradeBook {
  constructor(students = []) {
    this.students = students;
  }

  addStudent(student) {
    this.students.push(student);
    return this;
  }

  /**
   * find: locate a single student by name
   */
  findStudentByName(name) {
    return this.students.find((s) => s.name.toLowerCase() === name.toLowerCase());
  }

  /**
   * filter: get all students that match a condition
   */
  studentsWithGrade(gradeLetter) {
    return this.students.filter((s) => s.grade === gradeLetter);
  }

  /**
   * some: check if ANY student is failing (grade F)
   */
  hasAnyFailingStudent() {
    return this.students.some((s) => s.grade === "F");
  }

  /**
   * every: check if ALL students have at least one mark recorded
   */
  doAllStudentsHaveMarks() {
    return this.students.every((s) => s.marks.length > 0);
  }

  /**
   * map: create a summary table (array of plain objects)
   */
  summary() {
    return this.students.map((s) => ({
      name: s.name,
      marks: [...s.marks],
      average: Number(s.average.toFixed(2)),
      grade: s.grade,
    }));
  }
}

// ---------- Demo data + usage ----------

// default parameter demo: marks omitted -> []
const amit = new Student("Amit"); // no marks provided
amit.addMarks(95, 91, 88);

const priya = new Student("Priya", [70, 76, 72]);
const rahul = new Student("Rahul", [55, 63, 58]); // D/F-ish depending on avg
const sneha = new Student("Sneha", [100, 99, 98, 97]);

// rest parameter demo: add variable marks
rahul.addMarks(60); // improves average a bit

const gradeBook = new GradeBook([amit, priya, rahul, sneha]);

// template strings + formatted output
console.log("=== Student Report ===\n");
gradeBook.students.forEach((s) => console.log(s.toString()));

// find
const searched = "Rahul";
const found = gradeBook.findStudentByName(searched);
console.log(`Find "${searched}": ${found ? "FOUND" : "NOT FOUND"}`);
if (found) console.log(found.toString());

// filter
const aStudents = gradeBook.studentsWithGrade("A");
console.log(`Students with grade "A": ${aStudents.map((s) => s.name).join(", ") || "(none)"}`);

// some
console.log(`Any failing student (grade "F")? ${gradeBook.hasAnyFailingStudent() ? "Yes" : "No"}`);

// every
console.log(`Do all students have at least one mark? ${gradeBook.doAllStudentsHaveMarks() ? "Yes" : "No"}`);

// map (summary)
console.log("\n=== Summary Table (map) ===");
console.table(gradeBook.summary());


