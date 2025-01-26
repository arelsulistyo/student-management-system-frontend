"use client";

import { useEffect, useState, useCallback } from "react";

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
import { UpdateStudentForm } from "./components/update-student-form";
import {
  getStudents,
  addStudent,
  updateStudent,
  deleteStudent,
} from "./actions";
import type { Student, StudentFormData } from "./types/student";

export default function StudentManagement() {
  const [students, setStudents] = useState<Student[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchStudents = useCallback(async () => {
    try {
      setIsLoading(true);
      const data = await getStudents();
      setStudents(data);
    } catch (err) {
      setError("Failed to fetch students");
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchStudents();
  }, [fetchStudents]);

  const handleAddStudent = async (data: StudentFormData) => {
    try {
      const newStudent = await addStudent(data);
      setStudents((prevStudents) => [...prevStudents, newStudent]);
    } catch (err) {
      setError("Failed to add student");
      console.error(err);
    }
  };

  const handleUpdateStudent = async (id: number, data: StudentFormData) => {
    try {
      const updatedStudent = await updateStudent(id, data);
      setStudents((prevStudents) =>
        prevStudents.map((student) =>
          student.studentId === id ? updatedStudent : student
        )
      );
    } catch (err) {
      setError("Failed to update student");
      console.error(err);
    }
  };

  const handleDeleteStudent = async (id: number) => {
    try {
      await deleteStudent(id);
      setStudents((prevStudents) =>
        prevStudents.filter((student) => student.studentId !== id)
      );
    } catch (err) {
      setError("Failed to delete student");
      console.error(err);
    }
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-screen">
        Loading...
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex justify-center items-center h-screen text-red-500">
        Error: {error}
      </div>
    );
  }

  return (
    <div className="container py-10">
      <div className="rounded-lg border bg-card text-card-foreground shadow-sm">
        <div className="p-6">
          <div className="flex items-center justify-between">
            <h1 className="text-2xl font-bold">Student Management System</h1>
            <StudentForm onSubmit={handleAddStudent} />
          </div>
          <div className="mt-6">
            {students.length > 0 ? (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>ID</TableHead>
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
                          <UpdateStudentForm
                            student={student}
                            onSubmit={handleUpdateStudent}
                          />
                          <Button
                            variant="destructive"
                            size="sm"
                            className="w-20"
                            onClick={() =>
                              handleDeleteStudent(student.studentId)
                            }
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
              <p className="text-center py-4">No students found.</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
