'use client';

import { LucideIcon, FileText, Mail, Zap, Phone, Wifi, AlertCircle } from 'lucide-react';

interface EmptyStateProps {
  icon?: LucideIcon;
  title: string;
  description: string;
  action?: {
    label: string;
    onClick: () => void;
    icon?: LucideIcon;
  };
  variant?: 'default' | 'compact' | 'inline';
}

export default function EmptyState({
  icon: Icon = FileText,
  title,
  description,
  action,
  variant = 'default'
}: EmptyStateProps) {
  if (variant === 'compact') {
    return (
      <div className="text-center py-8">
        <Icon className="w-10 h-10 text-gray-300 mx-auto mb-3" />
        <h3 className="font-medium text-gray-700 mb-1">{title}</h3>
        <p className="text-sm text-gray-500 mb-4">{description}</p>
        {action && (
          <button
            onClick={action.onClick}
            className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 text-white text-sm rounded-lg hover:bg-blue-700 transition"
          >
            {action.icon && <action.icon className="w-4 h-4" />}
            {action.label}
          </button>
        )}
      </div>
    );
  }

  if (variant === 'inline') {
    return (
      <div className="flex items-center gap-4 p-4 bg-gray-50 rounded-lg">
        <Icon className="w-8 h-8 text-gray-400 flex-shrink-0" />
        <div className="flex-1">
          <h4 className="font-medium text-gray-700">{title}</h4>
          <p className="text-sm text-gray-500">{description}</p>
        </div>
        {action && (
          <button
            onClick={action.onClick}
            className="px-4 py-2 bg-blue-600 text-white text-sm rounded-lg hover:bg-blue-700 transition flex-shrink-0"
          >
            {action.label}
          </button>
        )}
      </div>
    );
  }

  // Default variant
  return (
    <div className="bg-white rounded-xl border border-gray-200 p-12 text-center">
      <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
        <Icon className="w-10 h-10 text-gray-400" />
      </div>
      <h3 className="text-xl font-semibold text-gray-900 mb-2">{title}</h3>
      <p className="text-gray-500 max-w-md mx-auto mb-6">{description}</p>
      {action && (
        <button
          onClick={action.onClick}
          className="inline-flex items-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition font-medium shadow-lg shadow-blue-200"
        >
          {action.icon && <action.icon className="w-5 h-5" />}
          {action.label}
        </button>
      )}
    </div>
  );
}

// Pre-configured empty states for common use cases
export function NoContractsEmpty({ onAction }: { onAction?: () => void }) {
  return (
    <EmptyState
      icon={FileText}
      title="Ingen aftaler endnu"
      description="Når du har aktive aftaler, kan du se dem her og sammenligne med nye tilbud."
      action={onAction ? {
        label: "Find bedre aftaler",
        onClick: onAction
      } : undefined}
    />
  );
}

export function NoMessagesEmpty({ onAction }: { onAction?: () => void }) {
  return (
    <EmptyState
      icon={Mail}
      title="Ingen beskeder"
      description="Din indbakke er tom. Nye beskeder fra selskaber vil dukke op her."
    />
  );
}

export function NoQuotesEmpty({ onAction }: { onAction?: () => void }) {
  return (
    <EmptyState
      icon={Zap}
      title="Ingen tilbud endnu"
      description="Start en jagt for at indhente tilbud fra forskellige selskaber."
      action={onAction ? {
        label: "Start ny jagt",
        onClick: onAction
      } : undefined}
    />
  );
}

export function ErrorEmpty({ onRetry }: { onRetry?: () => void }) {
  return (
    <EmptyState
      icon={AlertCircle}
      title="Noget gik galt"
      description="Vi kunne ikke indlæse dataen. Prøv venligst igen."
      action={onRetry ? {
        label: "Prøv igen",
        onClick: onRetry
      } : undefined}
    />
  );
}



