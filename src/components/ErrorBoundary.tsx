// components/ErrorBoundary.tsx
import { Component, ReactNode } from 'react';

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
}

interface State {
  hasError: boolean;
  error?: Error;
}

export class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false
  };

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  public componentDidCatch(error: Error, errorInfo: any) {
    console.error('Uncaught error:', error, errorInfo);
  }

  public render() {
    if (this.state.hasError) {
      return this.props.fallback || (
        <div className="p-8 text-center bg-red-50 border border-red-200 rounded-lg">
          <h2 className="text-lg font-semibold text-red-800 mb-2">
            😕 Что-то пошло не так
          </h2>
          <p className="text-red-600 mb-4">
            Компонент не смог загрузиться
          </p>
          <button
            onClick={() => this.setState({ hasError: false })}
            className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700"
          >
            Попробовать снова
          </button>
        </div>
      );
    }

    return this.props.children;
  }
}