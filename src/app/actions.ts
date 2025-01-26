"use server";

import type { Student, StudentFormData } from "./types/student";

interface ApiResponse<T> {
  statusCode: number;
  message: string;
  data: T;
}

export async function getStudents(): Promise<Student[]> {
  try {
    const response = await fetch("http://localhost:8080/students");
    if (!response.ok) {
      throw new Error("Failed to fetch students");
    }
    const result: ApiResponse<Student[]> = await response.json();
    return result.data;
  } catch (error) {
    console.error("Error fetching students:", error);
    throw error;
  }
}

export async function addStudent(data: StudentFormData): Promise<Student> {
  try {
    const response = await fetch("http://localhost:8080/students/create", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      throw new Error("Failed to add student");
    }

    const result = await response.json();

    return {
      studentId: result.data.studentId,
      fullName: `${result.data.firstName} ${result.data.lastName}`,
      age: calculateAge(result.data.birthDate),
    };
  } catch (error) {
    console.error("Error adding student:", error);
    throw error;
  }
}

export async function updateStudent(
  id: number,
  data: StudentFormData
): Promise<Student> {
  try {
    const response = await fetch(`http://localhost:8080/students/${id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      throw new Error("Failed to update student");
    }

    const result = await response.json();

    return {
      studentId: result.data.studentId,
      fullName: `${result.data.firstName} ${result.data.lastName}`,
      age: calculateAge(result.data.birthDate),
    };
  } catch (error) {
    console.error("Error updating student:", error);
    throw error;
  }
}

export async function deleteStudent(id: number): Promise<void> {
  try {
    const response = await fetch(`http://localhost:8080/students/${id}`, {
      method: "DELETE",
    });

    if (!response.ok) {
      throw new Error("Failed to delete student");
    }
  } catch (error) {
    console.error("Error deleting student:", error);
    throw error;
  }
}

function calculateAge(birthDate: string): number {
  const today = new Date();
  const birthDateObj = new Date(birthDate);
  let age = today.getFullYear() - birthDateObj.getFullYear();
  const monthDiff = today.getMonth() - birthDateObj.getMonth();

  if (
    monthDiff < 0 ||
    (monthDiff === 0 && today.getDate() < birthDateObj.getDate())
  ) {
    age--;
  }

  return age;
}
