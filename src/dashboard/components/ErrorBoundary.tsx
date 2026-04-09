import { Component, type ReactNode, type ErrorInfo } from 'react';
import * as Sentry from '@sentry/react';
import { AlertOctagon, RefreshCcw } from 'lucide-react';
import StateCard from './StateCard';

interface ErrorBoundaryProps {
  children: ReactNode;
  fallbackEyebrow?: string;
  fallbackTitle?: string;
  moduleLabel?: string;
  guildId?: string | null;
  onRetry?: () => void;
}

interface ErrorBoundaryState {
  hasError: boolean;
  error: Error | null;
}

export default class ErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    Sentry.captureException(error, {
      tags: {
        area: 'dashboard-module',
        module: this.props.moduleLabel ?? 'unknown',
      },
      extra: {
        guildId: this.props.guildId ?? null,
        componentStack: errorInfo.componentStack,
      },
    });

    if (import.meta.env.DEV) {
      // eslint-disable-next-line no-console
      console.error('[ErrorBoundary] Capturo un error en el renderizado del modulo:', error, errorInfo);
    }
  }

  handleReset = () => {
    this.setState({ hasError: false, error: null });
    this.props.onRetry?.();
  };

  render() {
    if (this.state.hasError) {
      const moduleMessage = this.props.moduleLabel
        ? `El modulo "${this.props.moduleLabel}" fallo al renderizar.`
        : 'Ocurrio un error inesperado en la interfaz.';

      return (
        <div className="flex h-full min-h-[50vh] w-full items-center justify-center p-6">
          <div className="w-full max-w-2xl">
            <StateCard
              eyebrow={this.props.fallbackEyebrow ?? 'Error de renderizado'}
              title={this.props.fallbackTitle ?? 'No se pudo mostrar esta seccion'}
              description={this.state.error?.message ?? moduleMessage}
              icon={AlertOctagon}
              tone="danger"
              actions={(
                <button
                  type="button"
                  onClick={this.handleReset}
                  className="dashboard-primary-button"
                >
                  <RefreshCcw className="h-4 w-4" />
                  Reintentar renderizado
                </button>
              )}
            />
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
