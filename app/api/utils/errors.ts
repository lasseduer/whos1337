import { AppError } from "@/app/store";

  export const handleError = (id: number, error: any): AppError => {
    if (error instanceof Error) {
      return { id: id, message: error.message }
    } else if (typeof error === 'string') {
      return { id: id, message: error }
    } else {
      return {id: id, message: 'An unknown error occurred'} 
    }
  }