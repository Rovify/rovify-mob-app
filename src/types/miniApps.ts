export interface MiniApp {
    id: string;
    name: string;
    description: string;
    category: MiniAppCategory;
    version: string;
    author: string;
    icon: string;
    screenshots: string[];
    supportedActions: MiniAppAction[];
    permissions: MiniAppPermission[];
    isActive: boolean;
    isVerified: boolean;
    rating: number;
    downloadCount: number;
    size: number; // in bytes
    lastUpdated: Date;
    createdAt: Date;
}

export type MiniAppCategory = 'payment' | 'gaming' | 'trading' | 'social' | 'utility' | 'entertainment';

export interface MiniAppAction {
    id: string;
    name: string;
    description: string;
    inputSchema: Record<string, any>;
    outputSchema: Record<string, any>;
    requiresAuth: boolean;
}

export interface MiniAppPermission {
    type: PermissionType;
    reason: string;
    required: boolean;
}

export type PermissionType = 'wallet' | 'camera' | 'location' | 'contacts' | 'storage' | 'notifications';

export interface MiniAppSession {
    id: string;
    appId: string;
    conversationId: string;
    participants: string[];
    state: Record<string, any>;
    isActive: boolean;
    createdAt: Date;
    updatedAt: Date;
    expiresAt?: Date;
}

export interface MiniAppMessageData {
    appId: string;
    appName: string;
    action: string;
    sessionId?: string;
    payload: Record<string, any>;
    ui?: MiniAppUIData;
}

export interface MiniAppUIData {
    type: 'card' | 'modal' | 'inline' | 'overlay';
    title?: string;
    content: MiniAppUIComponent[];
    actions?: MiniAppUIAction[];
}

export interface MiniAppUIComponent {
    type: 'text' | 'button' | 'input' | 'image' | 'chart' | 'list' | 'progress';
    props: Record<string, any>;
}

export interface MiniAppUIAction {
    id: string;
    label: string;
    action: string;
    style?: 'primary' | 'secondary' | 'danger';
    disabled?: boolean;
}

export interface MiniAppsState {
    apps: Record<string, MiniApp>;
    sessions: Record<string, MiniAppSession>;
    installedApps: string[];
    isLoading: boolean;
    error: string | null;
}