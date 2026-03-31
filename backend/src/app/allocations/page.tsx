import React from 'react';

const mockStudents = [
  { student_id: 1, reg_no: "22CS001", name: "Anjali", dept: "CSE" },
  { student_id: 2, reg_no: "22CS002", name: "Pooja", dept: "CSE" },
  { student_id: 3, reg_no: "22CS003", name: "Sneha", dept: "CSE" },
  { student_id: 4, reg_no: "22EC004", name: "Meena", dept: "ECE" },
  { student_id: 5, reg_no: "22EC005", name: "Lakshmi", dept: "ECE" },
  { student_id: 6, reg_no: "22EC006", name: "Kavya", dept: "ECE" },
  { student_id: 7, reg_no: "22IT007", name: "Divya", dept: "IT" },
  { student_id: 8, reg_no: "22IT008", name: "Priya", dept: "IT" },
  { student_id: 9, reg_no: "22IT009", name: "Nisha", dept: "IT" },
  { student_id: 10, reg_no: "22IT010", name: "Swathi", dept: "IT" }
];

export default function AllocationsPage() {
  // Branch Sector Divide Algorithm Mock Implementation
  // Zipping students intelligently so that no two same-branch students sit adjacently
  const cse = mockStudents.filter(s => s.dept === "CSE");
  const ece = mockStudents.filter(s => s.dept === "ECE");
  const it = mockStudents.filter(s => s.dept === "IT");

  // Create a 12-seat classroom (4 columns x 3 rows grid)
  const seats = [];
  const maxSeats = 12; 
  
  let i = 0, c = 0, e = 0, t = 0;
  
  // Custom manual interleaving to guarantee the "sector divide" logic visually
  // Sequence IT -> CSE -> ECE -> IT -> CSE -> ECE etc...
  while (seats.length < maxSeats) {
    if (i % 3 === 0 && t < it.length) { seats.push(it[t++]); }
    else if (i % 3 === 1 && c < cse.length) { seats.push(cse[c++]); }
    else if (i % 3 === 2 && e < ece.length) { seats.push(ece[e++]); }
    else if (t < it.length) { seats.push(it[t++]); } // Fallback
    else { seats.push(null); } // Empty seat
    i++;
  }

  const getSeatColor = (dept?: string) => {
    switch (dept) {
      case 'CSE': return "bg-blue-50 border-blue-200 dark:bg-blue-900/20 dark:border-blue-800 shadow-blue-500/10";
      case 'ECE': return "bg-purple-50 border-purple-200 dark:bg-purple-900/20 dark:border-purple-800 shadow-purple-500/10";
      case 'IT': return "bg-emerald-50 border-emerald-200 dark:bg-emerald-900/20 dark:border-emerald-800 shadow-emerald-500/10";
      default: return "bg-gray-50 border-dashed border-gray-300 dark:bg-[#1a1a1a] dark:border-zinc-700 shadow-none opacity-60";
    }
  };

  const getBadgeColor = (dept?: string) => {
    switch (dept) {
      case 'CSE': return "bg-blue-100 text-blue-800 dark:bg-blue-900/40 dark:text-blue-300";
      case 'ECE': return "bg-purple-100 text-purple-800 dark:bg-purple-900/40 dark:text-purple-300";
      case 'IT': return "bg-emerald-100 text-emerald-800 dark:bg-emerald-900/40 dark:text-emerald-300";
      default: return "";
    }
  };

  return (
    <div className="min-h-screen bg-white dark:bg-[#0a0a0a] py-12 px-4 sm:px-6 lg:px-8 font-sans">
      <div className="max-w-5xl mx-auto space-y-12">
        
        {/* Header */}
        <div className="text-center space-y-4">
          <h1 className="text-4xl font-extrabold tracking-tight text-gray-900 dark:text-white sm:text-5xl">
            Exam Hall Seating Plan
          </h1>
          <p className="max-w-2xl mx-auto text-lg text-gray-500 dark:text-gray-400">
            Applying the <span className="font-semibold text-gray-900 dark:text-gray-200">Branch Sector Divide</span> Algorithm. 
            Students from the same branch are physically separated to prevent malpractice and ensure fairness.
          </p>
          
          <div className="flex justify-center gap-4 pt-4">
            <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-sm font-medium bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 text-blue-700 dark:text-blue-400">
              <span className="w-2 h-2 rounded-full bg-blue-500"></span> CSE ({cse.length})
            </span>
            <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-sm font-medium bg-purple-50 dark:bg-purple-900/20 border border-purple-200 dark:border-purple-800 text-purple-700 dark:text-purple-400">
              <span className="w-2 h-2 rounded-full bg-purple-500"></span> ECE ({ece.length})
            </span>
            <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-sm font-medium bg-emerald-50 dark:bg-emerald-900/20 border border-emerald-200 dark:border-emerald-800 text-emerald-700 dark:text-emerald-400">
              <span className="w-2 h-2 rounded-full bg-emerald-500"></span> IT ({it.length})
            </span>
          </div>
        </div>

        {/* Room Container */}
        <div className="relative p-8 sm:p-12 rounded-3xl border border-gray-200 dark:border-zinc-800 bg-gray-50/50 dark:bg-[#111] shadow-2xl">
          <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-gray-900 dark:bg-white text-white dark:text-black px-6 py-2 rounded-full text-sm font-bold tracking-widest uppercase shadow-lg">
            Teacher's Desk (Front)
          </div>

          {/* Grid Layout (4 columns = columns in real life, 3 rows) */}
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-6 mt-8">
            {seats.map((student, index) => (
              <div 
                key={index}
                className={`flex flex-col h-32 relative rounded-xl border p-4 shadow-sm transition-all duration-300 hover:shadow-md hover:-translate-y-1 ${getSeatColor(student?.dept)}`}
              >
                <div className="absolute -top-3 -left-3 w-8 h-8 flex items-center justify-center rounded-full bg-white dark:bg-zinc-800 border border-gray-200 dark:border-zinc-700 text-xs font-bold text-gray-500 dark:text-gray-400 shadow-sm z-10">
                  {index + 1}
                </div>

                {student ? (
                  <div className="flex flex-col h-full justify-between">
                    <div>
                      <h3 className="font-bold text-gray-900 dark:text-white truncate">{student.name}</h3>
                      <p className="text-xs font-mono text-gray-500 dark:text-gray-400 mt-1">{student.reg_no}</p>
                    </div>
                    <div>
                      <span className={`inline-flex px-2 py-0.5 rounded text-[10px] font-bold tracking-wider uppercase ${getBadgeColor(student.dept)}`}>
                        {student.dept}
                      </span>
                    </div>
                  </div>
                ) : (
                  <div className="flex flex-col h-full items-center justify-center text-gray-400 dark:text-gray-600">
                    <span className="text-sm font-medium">Empty Seat</span>
                  </div>
                )}
              </div>
            ))}
          </div>
          
          <div className="mt-12 pt-6 border-t border-gray-200 dark:border-zinc-800 text-center">
            <span className="text-xs font-mono text-gray-500 dark:text-gray-400">
              Exam Hall A101 • Capacity: 12 • Configured using Branch-Sector Divide Algorithm
            </span>
          </div>
        </div>

      </div>
    </div>
  );
}
