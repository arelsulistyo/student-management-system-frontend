"use client";

import { useEffect, useState } from "react";

import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { StudentForm } from "./components/student-form";
import { getStudents } from "./actions";
import type { Student, StudentFormData } from "./types/student";

export default function StudentManagement() {
  const [students, setStudents] = useState<Student[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchStudents = async () => {
      try {
        setIsLoading(true);
        const data = await getStudents();
        if (Array.isArray(data)) {
          setStudents(data);
        } else {
          throw new Error("Fetched data is not an array");
        }
      } catch (err) {
        setError("Failed to fetch students");
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    };
    fetchStudents();
  }, []);

  const addStudent = (data: StudentFormData) => {
    // This will be implemented when we add the POST endpoint
    setStudents((prevStudents) => [
      ...prevStudents,
      {
        studentId: prevStudents.length + 1,
        ...data,
      },
    ]);
  };

  const deleteStudent = (id: number) => {
    // This will be implemented when we add the DELETE endpoint
    setStudents((prevStudents) =>
      prevStudents.filter((student) => student.studentId !== id)
    );
  };

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  return (
    <div className="container py-10">
      <div className="rounded-lg border bg-card text-card-foreground shadow-sm">
        <div className="p-6">
          <div className="flex items-center justify-between">
            <h1 className="text-2xl font-bold">Student Management System</h1>
            <StudentForm onSubmit={addStudent} />
          </div>
          <div className="mt-6">
            {students.length > 0 ? (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Student ID</TableHead>
                    <TableHead>Full Name</TableHead>
                    <TableHead>Age</TableHead>
                    <TableHead>Operation</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {students.map((student) => (
                    <TableRow key={student.studentId}>
                      <TableCell>{student.studentId}</TableCell>
                      <TableCell>{student.fullName}</TableCell>
                      <TableCell>{student.age}</TableCell>
                      <TableCell>
                        <div className="flex gap-2">
                          <Button
                            variant="default"
                            size="sm"
                            className="w-[80px]"
                          >
                            Update
                          </Button>
                          <Button
                            variant="destructive"
                            size="sm"
                            className="w-[80px]"
                            onClick={() => deleteStudent(student.studentId)}
                          >
                            Delete
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            ) : (
              <p>No students found.</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
