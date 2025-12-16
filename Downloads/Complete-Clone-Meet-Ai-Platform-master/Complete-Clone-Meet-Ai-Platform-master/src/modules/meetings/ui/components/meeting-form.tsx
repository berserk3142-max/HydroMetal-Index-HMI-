"use client";

import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useTRPC } from "@/trpc/client";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useEffect, useRef } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import type { z } from "zod";
import { Loader2Icon } from "lucide-react";

import { meetingsInsertSchema } from "../../schemas";
import { MeetingGetOne } from "../../types";

interface MeetingFormProps {
  onSuccess?: (id?: string) => void;
  onCancel?: () => void;
  initialValues?: MeetingGetOne;
}

export const MeetingForm = ({ onSuccess, onCancel, initialValues }: MeetingFormProps) => {
  const trpc = useTRPC();
  const queryClient = useQueryClient();
  const firstInputRef = useRef<HTMLInputElement>(null);

  // Fetch agents for the select dropdown
  const { data: agentsData, isLoading: isLoadingAgents } = useQuery(
    trpc.agents.getMany.queryOptions({ page: 1, pageSize: 100 })
  );

  const createMeeting = useMutation(
    trpc.meetings.create.mutationOptions({
      onSuccess: async (data) => {
        await queryClient.invalidateQueries(trpc.meetings.getMany.queryOptions({}));
        toast.success("Meeting created successfully!");
        onSuccess?.(data.id);
      },
      onError: (error) => {
        toast.error(`Error creating meeting: ${error.message}`);
      },
    })
  );

  const updateMeeting = useMutation(
    trpc.meetings.update.mutationOptions({
      onSuccess: async () => {
        await queryClient.invalidateQueries(trpc.meetings.getMany.queryOptions({}));

        if (initialValues?.id) {
          await queryClient.invalidateQueries(
            trpc.meetings.getOne.queryOptions({ id: initialValues.id })
          );
        }

        toast.success("Meeting updated successfully!");
        onSuccess?.();
      },
      onError: (error) => {
        toast.error(`Error updating meeting: ${error.message}`);
      },
    })
  );

  const form = useForm<z.infer<typeof meetingsInsertSchema>>({
    resolver: zodResolver(meetingsInsertSchema),
    defaultValues: {
      name: initialValues?.name ?? "",
      agentId: initialValues?.agentId ?? "",
    },
  });

  // Focus management for accessibility
  useEffect(() => {
    const timer = setTimeout(() => {
      firstInputRef.current?.focus();
    }, 100);

    return () => clearTimeout(timer);
  }, []);

  const isEdit = !!initialValues?.id;
  const isPending = createMeeting.isPending || updateMeeting.isPending;
  const agents = agentsData?.items ?? [];

  const onSubmit = (values: z.infer<typeof meetingsInsertSchema>) => {
    if (isEdit) {
      updateMeeting.mutate({ id: initialValues.id, ...values });
    } else {
      createMeeting.mutate(values);
    }
  };

  return (
    <Form {...form}>
      <form className="space-y-4" onSubmit={form.handleSubmit(onSubmit)}>
        <FormField
          name="name"
          control={form.control}
          render={({ field }) => (
            <FormItem>
              <FormLabel>Meeting Name</FormLabel>
              <FormControl>
                <Input
                  {...field}
                  ref={firstInputRef}
                  placeholder="Enter meeting name"
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          name="agentId"
          control={form.control}
          render={({ field }) => (
            <FormItem>
              <FormLabel>AI Agent</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger disabled={isLoadingAgents}>
                    {isLoadingAgents ? (
                      <div className="flex items-center gap-2">
                        <Loader2Icon className="h-4 w-4 animate-spin" />
                        <span>Loading agents...</span>
                      </div>
                    ) : (
                      <SelectValue placeholder="Select an AI agent" />
                    )}
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {agents.length === 0 ? (
                    <div className="p-2 text-sm text-muted-foreground">
                      No agents found. Create one first.
                    </div>
                  ) : (
                    agents.map((agent) => (
                      <SelectItem key={agent.id} value={agent.id}>
                        {agent.name}
                      </SelectItem>
                    ))
                  )}
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="flex justify-between gap-x-2">
          {onCancel && (
            <Button
              onClick={onCancel}
              disabled={isPending}
              variant="ghost"
              className="mr-2"
              type="button"
            >
              Cancel
            </Button>
          )}
          <Button type="submit" disabled={isPending || isLoadingAgents || agents.length === 0}>
            {isPending ? (
              <>
                <Loader2Icon className="mr-2 h-4 w-4 animate-spin" />
                {isEdit ? "Updating..." : "Creating..."}
              </>
            ) : (
              isEdit ? "Update Meeting" : "Create Meeting"
            )}
          </Button>
        </div>
      </form>
    </Form>
  );
};
