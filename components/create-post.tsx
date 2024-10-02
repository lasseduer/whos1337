"use client";

import { useState, ChangeEvent } from "react";
import { useRouter } from "next/navigation";
import { Spacer } from "@nextui-org/spacer";
import { Button } from "@nextui-org/button";
import { Input } from "@nextui-org/input";
import { format } from "date-fns";

import { NewPostDto } from "@/app/models/dtos";
import { getLocalTimezoneOffset } from "@/app/utils";

interface FormData {
  message: string;
}

export const CreatePost: React.FC = () => {
  const router = useRouter();
  // State to hold form inputs with typed data
  const [formData, setFormData] = useState<FormData>({
    message: "",
  });

  // State to track submission status
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;

    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleSubmit = async (e: any) => {
    const postCreated = new Date();

    e.preventDefault(); // Prevent page reload on form submit
    setIsSubmitting(true);

    const requestBody: NewPostDto = {
      message: formData.message,
      timestamp: `${format(postCreated, "yyyy-MM-dd HH:mm:ss.SSS")}${getLocalTimezoneOffset()}`,
      timeZone: Intl.DateTimeFormat().resolvedOptions().timeZone,
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
      setIsSubmitting(false);
      console.error("Error submitting the form:", error);
    }
    router.push("/whos1337");
  };

  return (
    <div>
      <form>
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
        <Button
          color="primary"
          disabled={isSubmitting || !formData.message}
          isLoading={isSubmitting}
          onClick={handleSubmit}
        >
          {isSubmitting ? "Submitting..." : "Submit"}
        </Button>
      </form>
    </div>
  );
};
