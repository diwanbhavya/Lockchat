import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Camera, Save, User } from "lucide-react";
import { useAuth } from "@/context/AuthContext";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Alert, AlertDescription } from "@/components/ui/alert";

const profileFormSchema = z.object({
  username: z.string().min(2, {
    message: "Username must be at least 2 characters.",
  }),
  email: z.string().email({
    message: "Please enter a valid email address.",
  }),
  bio: z
    .string()
    .max(160, {
      message: "Bio must not be longer than 160 characters.",
    })
    .optional(),
  fullName: z.string().min(2, {
    message: "Full name must be at least 2 characters.",
  }),
});

type ProfileFormValues = z.infer<typeof profileFormSchema>;

interface ProfileManagementProps {
  user?: {
    username: string;
    email: string;
    bio?: string;
    fullName: string;
    avatarUrl?: string;
  };
}

const ProfileManagement = ({
  user = {
    username: "johndoe",
    email: "john.doe@example.com",
    bio: "Security enthusiast and software developer.",
    fullName: "John Doe",
    avatarUrl: "https://api.dicebear.com/7.x/avataaars/svg?seed=johndoe",
  },
}: ProfileManagementProps) => {
  const { updateProfile } = useAuth();
  const [avatarFile, setAvatarFile] = useState<File | null>(null);
  const [avatarPreview, setAvatarPreview] = useState<string | null>(
    user.avatarUrl || null,
  );
  const [updateSuccess, setUpdateSuccess] = useState(false);
  const [updateError, setUpdateError] = useState<string | null>(null);

  const form = useForm<ProfileFormValues>({
    resolver: zodResolver(profileFormSchema),
    defaultValues: {
      username: user.username,
      email: user.email,
      bio: user.bio || "",
      fullName: user.fullName,
    },
  });

  async function onSubmit(data: ProfileFormValues) {
    try {
      setUpdateSuccess(false);
      setUpdateError(null);

      // Save to localStorage to persist changes
      if (avatarPreview) {
        localStorage.setItem("userAvatar", avatarPreview);
      }
      localStorage.setItem("userFullName", data.fullName);
      localStorage.setItem("userBio", data.bio || "");
      localStorage.setItem("userUsername", data.username);
      localStorage.setItem("userEmail", data.email); // Store email updates

      // Update profile in auth context
      await updateProfile({
        username: data.username,
        email: data.email,
        bio: data.bio,
        fullName: data.fullName,
        avatarUrl: avatarPreview || undefined,
      });

      setUpdateSuccess(true);
    } catch (error) {
      setUpdateError(
        error instanceof Error ? error.message : "Failed to update profile",
      );
    }
  }

  const handleAvatarChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setAvatarFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setAvatarPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="bg-background min-h-screen p-6">
      <div className="max-w-4xl mx-auto space-y-8">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">
              Profile Management
            </h1>
            <p className="text-muted-foreground mt-2">
              Update your profile information and manage your account settings.
            </p>
          </div>
        </div>

        {updateSuccess && (
          <Alert className="bg-green-50 border-green-200 text-green-800">
            <AlertDescription>
              Your profile has been successfully updated.
            </AlertDescription>
          </Alert>
        )}

        {updateError && (
          <Alert variant="destructive">
            <AlertDescription>{updateError}</AlertDescription>
          </Alert>
        )}

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Avatar Section */}
          <Card className="md:col-span-1">
            <CardHeader>
              <CardTitle>Profile Picture</CardTitle>
              <CardDescription>
                Update your profile picture. This will be displayed in the chat.
              </CardDescription>
            </CardHeader>
            <CardContent className="flex flex-col items-center space-y-4">
              <Avatar className="h-32 w-32">
                {avatarPreview ? (
                  <AvatarImage src={avatarPreview} alt="Profile" />
                ) : (
                  <AvatarFallback className="text-4xl">
                    <User size={48} />
                  </AvatarFallback>
                )}
              </Avatar>
              <div className="flex flex-col items-center">
                <label htmlFor="avatar-upload" className="cursor-pointer">
                  <div className="flex items-center space-x-2 bg-primary text-primary-foreground px-4 py-2 rounded-md hover:bg-primary/90 transition-colors">
                    <Camera size={16} />
                    <span>Upload Photo</span>
                  </div>
                  <input
                    id="avatar-upload"
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={handleAvatarChange}
                  />
                </label>
                <p className="text-xs text-muted-foreground mt-2">
                  JPG, PNG or GIF. 1MB max size.
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Profile Information Form */}
          <Card className="md:col-span-2">
            <CardHeader>
              <CardTitle>Profile Information</CardTitle>
              <CardDescription>
                Update your account details and personal information.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Form {...form}>
                <form
                  onSubmit={form.handleSubmit(onSubmit)}
                  className="space-y-6"
                >
                  <FormField
                    control={form.control}
                    name="fullName"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Full Name</FormLabel>
                        <FormControl>
                          <Input placeholder="Your Name" {...field} />
                        </FormControl>
                        <FormDescription>
                          This is your full name that will be displayed to other
                          users.
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="username"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Username</FormLabel>
                        <FormControl>
                          <Input placeholder="username" {...field} />
                        </FormControl>
                        <FormDescription>
                          This is your public username. It can only contain
                          letters, numbers, and underscores.
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="email"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Email</FormLabel>
                        <FormControl>
                          <Input placeholder="youremail@gmail.com" {...field} />
                        </FormControl>
                        <FormDescription>
                          This is the email address associated with your
                          account.
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="bio"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Bio</FormLabel>
                        <FormControl>
                          <Textarea
                            placeholder="Tell us a little bit about yourself"
                            className="resize-none"
                            {...field}
                          />
                        </FormControl>
                        <FormDescription>
                          Write a short bio about yourself. This will be visible
                          on your profile.
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <CardFooter className="px-0 pt-6">
                    <Button type="submit" className="w-full sm:w-auto">
                      <Save className="mr-2 h-4 w-4" />
                      Save Changes
                    </Button>
                  </CardFooter>
                </form>
              </Form>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default ProfileManagement;
