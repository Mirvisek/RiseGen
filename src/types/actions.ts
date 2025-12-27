// Shared types for server actions using useActionState

export interface ActionState {
    success: boolean;
    message: string;
}

// Type for prevState parameter in server actions used with useActionState
// This allows either ActionState, undefined, or null for initial state
export type PrevActionState = ActionState | undefined | null;
