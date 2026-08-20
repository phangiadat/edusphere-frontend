import { axiosClient } from './axiosClient';

export interface CreateAssignmentPayload {
  title: string;
  description?: string;
  dueDate?: string;
  chapterId: string;
}

export interface UpdateAssignmentPayload {
  title?: string;
  description?: string;
  dueDate?: string;
}

export interface AssignmentBackendModel {
  id: string;
  title: string;
  description?: string;
  dueDate?: string;
  chapterId: string;
  createdAt: string;
  updatedAt: string;
}

export interface GradeSubmissionPayload {
  score: number;
  feedback?: string;
}

export interface SubmissionBackendModel {
  id: string;
  content?: string;
  fileUrl?: string;
  score?: number;
  feedback?: string;
  status: 'SUBMITTED' | 'GRADED';
  userId: string;
  assignmentId: string;
  createdAt: string;
  updatedAt: string;
  user?: {
    id: string;
    fullName: string;
    email: string;
    avatarUrl?: string;
  };
  assignment?: {
    id: string;
    title: string;
    chapter?: {
      id: string;
      title: string;
      course?: {
        id: string;
        title: string;
      };
    };
  };
}

export interface PaginatedSubmissionsResponse {
  data: SubmissionBackendModel[];
  meta: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

export const assignmentService = {
  // Create Assignment
  async createAssignment(payload: CreateAssignmentPayload): Promise<AssignmentBackendModel> {
    return (await axiosClient.post('/assignments', payload)) as unknown as AssignmentBackendModel;
  },

  // Get Submissions for an Assignment
  async getSubmissions(assignmentId: string, page = 1, limit = 20): Promise<PaginatedSubmissionsResponse> {
    return (await axiosClient.get(`/assignments/${assignmentId}/submissions`, {
      params: { page, limit },
    })) as unknown as PaginatedSubmissionsResponse;
  },

  // Grade Submission
  async gradeSubmission(submissionId: string, payload: GradeSubmissionPayload): Promise<SubmissionBackendModel> {
    return (await axiosClient.patch(`/assignments/submissions/${submissionId}/grade`, payload)) as unknown as SubmissionBackendModel;
  },
};
