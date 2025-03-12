"use client";
import { title } from "@/components/primitives";
import { useUser, withPageAuthRequired } from "@auth0/nextjs-auth0/client";
import { Button, Input, Spacer } from "@nextui-org/react";
import { ChangeEvent, useState } from "react";
import { useSharedContext, User, AppError } from "../store";
import { UserDto } from "../models/dtos";
import { handleError } from "../api/utils/errors";

interface FormData {
  nickname: string;
}

export const Profile = (): any => {
  const store = useSharedContext();
  const { user } = useUser();
  const [error, setError] = useState<AppError[]>([]);

  // State to hold form inputs with typed data
  const [formData, setFormData] = useState<FormData>({
    nickname: "",
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
    e.preventDefault(); // Prevent page reload on form submit
    setIsSubmitting(true);

    const requestBody: UserDto = {
      nickname: formData.nickname,
      points: undefined,
      personalBest: undefined,
    };

    try {
      await fetch("api/user", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(requestBody),
      })
        .then((response) => {
          if (!response.ok) {
            throw new Error("Something went wrong");
          }

          return response.json();
        })
        .then((response: UserDto) => {
          if (user) {
            const newUser = {
              ...store.user,
              nickname: response.nickname,
            } as User;

            store.setUser(newUser);
            setFormData({ nickname: "" });
          }
        });
    } catch (error) {
      setError([handleError(400, error)]);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      <div className="flex justify-center pb-[30px]">
        <h1 className={title()}>{store.user?.nickname}</h1>
      </div>
      <form>
        <Spacer y={1.5} /> {/* Adds space between form elements */}
        <Input
          fullWidth
          required
          label="Change your nickname"
          name="nickname"
          type="text"
          value={formData.nickname}
          onChange={handleChange}
        />
        <Spacer y={1.5} />
        <Button
          color="primary"
          disabled={isSubmitting || !formData.nickname}
          isLoading={isSubmitting}
          onPress={handleSubmit}
        >
          {isSubmitting ? "Submitting..." : "Submit"}
        </Button>
      </form>
    </>
  );
};
export default withPageAuthRequired(Profile);
