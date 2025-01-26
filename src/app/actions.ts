"use server";

import type { Student } from "./types/student";

interface ApiResponse {
  statusCode: number;
  message: string;
  data: Student[];
}

export async function getStudents(): Promise<Student[]> {
  try {
    const response = await fetch("http://localhost:8080/students");
    if (!response.ok) {
      throw new Error("Failed to fetch students");
    }
    const result: ApiResponse = await response.json();
    if (!Array.isArray(result.data)) {
      throw new Error("Fetched data is not an array");
    }
    return result.data;
  } catch (error) {
    console.error("Error fetching students:", error);
    throw error;
  }
}
