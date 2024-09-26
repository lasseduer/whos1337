"use client";

import { useState, ChangeEvent } from "react";
import { Input, Button, Spacer } from '@nextui-org/react';

import { NewPostDto } from "@/app/models/dtos";

interface FormData {
  name: string;
  message: string;
}

export const CreatePost: React.FC = () => {
  // State to hold form inputs with typed data
  const [formData, setFormData] = useState<FormData>({
    name: "",
    message: "",
  });

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;

    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleSubmit = async (e: any) => {
    e.preventDefault(); // Prevent page reload on form submit
    const requestBody: NewPostDto = {
      message: formData.message,
      name: formData.name,
      timestamp: new Date().toISOString(),
    };

    try {
      const response = await fetch("api/post", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(requestBody), // Convert form data to JSON
      });

      if (!response.ok) {
        throw new Error("Failed to submit form");
      }
    } catch (error) {
      console.error("Error submitting the form:", error);
    }
  };

  return (
    <div>
      <h2>Submit your info</h2>
      <form>
        <Input
          fullWidth
          required
          label="Name"
          name="name"
          value={formData.name}
          onChange={handleChange}
        />
        <Spacer y={1.5} /> {/* Adds space between form elements */}
        <Input
          fullWidth
          required
          label="Message"
          name="message"
          type="email"
          value={formData.message}
          onChange={handleChange}
        />
        <Spacer y={1.5} />
        <Button color="primary" onClick={handleSubmit}>
          Submit
        </Button>
      </form>
    </div>
  );
};
