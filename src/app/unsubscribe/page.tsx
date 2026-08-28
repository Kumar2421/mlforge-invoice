"use client";

import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { CheckCircle, XCircle, Loader2 } from "lucide-react";
import { MLForgeMark } from "@/components/icons";

export default function UnsubscribePage() {
  const searchParams = useSearchParams();
  const email = searchParams.get("email");
  const org = searchParams.get("org");
  
  const [status, setStatus] = useState<"loading" | "success" | "error">("loading");
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    if (!email) {
      setStatus("error");
      setErrorMessage("No email provided in the link.");
      return;
    }

    const processUnsubscribe = async () => {
      try {
        const res = await fetch("/api/v1/unsubscribe", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ email, organizationId: org }),
        });

        if (res.ok) {
          setStatus("success");
        } else {
          const data = await res.json();
          setStatus("error");
          setErrorMessage(data.error || "Failed to process request.");
        }
      } catch (err) {
        setStatus("error");
        setErrorMessage("An unexpected error occurred.");
      }
    };

    processUnsubscribe();
  }, [email, org]);

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md flex flex-col items-center">
        <MLForgeMark className="w-12 h-12 text-[#074E5B]" />
        <h2 className="mt-6 text-center text-2xl font-extrabold text-gray-900">
          Unsubscribe from Reminders
        </h2>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10 text-center">
          {status === "loading" && (
            <div className="flex flex-col items-center justify-center space-y-4">
              <Loader2 className="w-10 h-10 text-[#074E5B] animate-spin" />
              <p className="text-gray-500">Processing your request...</p>
            </div>
          )}

          {status === "success" && (
            <div className="flex flex-col items-center justify-center space-y-4">
              <CheckCircle className="w-12 h-12 text-green-500" />
              <div className="space-y-1">
                <p className="font-bold text-gray-900 text-lg">Successfully Unsubscribed</p>
                <p className="text-gray-500 text-sm">
                  <strong>{email}</strong> will no longer receive automated payment reminders.
                </p>
              </div>
            </div>
          )}

          {status === "error" && (
            <div className="flex flex-col items-center justify-center space-y-4">
              <XCircle className="w-12 h-12 text-red-500" />
              <div className="space-y-1">
                <p className="font-bold text-gray-900 text-lg">Error processing request</p>
                <p className="text-gray-500 text-sm">{errorMessage}</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
