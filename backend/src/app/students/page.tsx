import React from 'react';

const studentsData = [
  { student_id: 1, reg_no: "22CS001", name: "Anjali", dept: "CSE", year: 3, semester: 6, phone: "9876543210" },
  { student_id: 2, reg_no: "22CS002", name: "Pooja", dept: "CSE", year: 3, semester: 6, phone: "9876543211" },
  { student_id: 3, reg_no: "22CS003", name: "Sneha", dept: "CSE", year: 3, semester: 6, phone: "9876543212" },
  { student_id: 4, reg_no: "22EC004", name: "Meena", dept: "ECE", year: 3, semester: 6, phone: "9876543213" },
  { student_id: 5, reg_no: "22EC005", name: "Lakshmi", dept: "ECE", year: 3, semester: 6, phone: "9876543214" },
  { student_id: 6, reg_no: "22EC006", name: "Kavya", dept: "ECE", year: 3, semester: 6, phone: "9876543215" },
  { student_id: 7, reg_no: "22IT007", name: "Divya", dept: "IT", year: 3, semester: 6, phone: "9876543216" },
  { student_id: 8, reg_no: "22IT008", name: "Priya", dept: "IT", year: 3, semester: 6, phone: "9876543217" },
  { student_id: 9, reg_no: "22IT009", name: "Nisha", dept: "IT", year: 3, semester: 6, phone: "9876543218" },
  { student_id: 10, reg_no: "22IT010", name: "Swathi", dept: "IT", year: 3, semester: 6, phone: "9876543219" }
];

const getBadgeStyle = (dept: string) => {
  switch (dept) {
    case 'CSE':
      return "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300 ring-blue-700/10 dark:ring-blue-400/20";
    case 'ECE':
      return "bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-300 ring-purple-700/10 dark:ring-purple-400/20";
    case 'IT':
      return "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-300 ring-emerald-700/10 dark:ring-emerald-400/20";
    default:
      return "bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-300 ring-gray-600/10";
  }
};

export default function StudentsPage() {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-[#0a0a0a] py-12 px-4 sm:px-6 lg:px-8 font-sans">
      <div className="max-w-6xl mx-auto space-y-8">
        
        {/* Header Section */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div>
            <h1 className="text-4xl font-extrabold tracking-tight text-gray-900 dark:text-white sm:text-5xl">
              Student Directory
            </h1>
            <p className="mt-2 text-base text-gray-500 dark:text-gray-400">
              A complete list of all registered students for the upcoming examination.
            </p>
          </div>
          <div className="flex items-center space-x-2">
            <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300 ring-1 ring-inset ring-blue-500/20">
              {studentsData.length} Total Students
            </span>
          </div>
        </div>

        {/* Table Container */}
        <div className="relative overflow-hidden shadow-2xl ring-1 ring-gray-900/5 dark:ring-white/10 sm:rounded-2xl transition-all duration-300">
          <div className="absolute inset-0 bg-white/40 dark:bg-zinc-900/40 backdrop-blur-xl"></div>
          
          <div className="relative overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200 dark:divide-zinc-800">
              <thead className="bg-gray-100/80 dark:bg-zinc-900/80 backdrop-blur-sm">
                <tr>
                  <th scope="col" className="py-4 pl-6 pr-3 text-left text-xs font-semibold uppercase tracking-wider text-gray-500 dark:text-gray-400">Reg No</th>
                  <th scope="col" className="px-3 py-4 text-left text-xs font-semibold uppercase tracking-wider text-gray-500 dark:text-gray-400">Student Name</th>
                  <th scope="col" className="px-3 py-4 text-left text-xs font-semibold uppercase tracking-wider text-gray-500 dark:text-gray-400">Branch</th>
                  <th scope="col" className="px-3 py-4 text-left text-xs font-semibold uppercase tracking-wider text-gray-500 dark:text-gray-400">Year / Sem</th>
                  <th scope="col" className="px-3 py-4 text-left text-xs font-semibold uppercase tracking-wider text-gray-500 dark:text-gray-400">Phone</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200 dark:divide-zinc-800/50 bg-white dark:bg-zinc-950/50">
                {studentsData.map((student, idx) => (
                  <tr 
                    key={student.student_id} 
                    className={`transition-colors duration-200 hover:bg-gray-50/80 dark:hover:bg-zinc-800/40 ${idx % 2 === 0 ? 'bg-transparent' : 'bg-gray-50/30 dark:bg-black/20'}`}
                  >
                    <td className="whitespace-nowrap py-4 pl-6 pr-3 text-sm font-medium text-gray-900 dark:text-white">
                      <div className="flex items-center gap-2">
                        <div className="w-2 h-2 rounded-full bg-emerald-500"></div>
                        {student.reg_no}
                      </div>
                    </td>
                    <td className="whitespace-nowrap px-3 py-4 text-sm font-medium text-gray-900 dark:text-gray-100">
                      {student.name}
                    </td>
                    <td className="whitespace-nowrap px-3 py-4 text-sm">
                      <span className={`inline-flex items-center px-2 py-1 rounded-md text-xs font-medium ring-1 ring-inset ${getBadgeStyle(student.dept)}`}>
                        {student.dept}
                      </span>
                    </td>
                    <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-600 dark:text-gray-300 font-medium">
                      Year {student.year} • Sem {student.semester}
                    </td>
                    <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500 dark:text-gray-400 font-mono">
                      +91 {student.phone.slice(0, 5)} {student.phone.slice(5)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
