import { Component, type ReactNode } from 'react';

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

export class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  render() {
    if (this.state.hasError) {
      return (
        <div style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          height: '100vh',
          background: '#0d0d0d',
          color: '#ececf1',
          fontFamily: 'Inter, sans-serif',
          padding: '2rem',
          textAlign: 'center',
        }}>
          <h1 style={{ fontSize: '1.5rem', marginBottom: '1rem' }}>
            Что-то пошло не так
          </h1>
          <p style={{ color: '#9a9aab', marginBottom: '1.5rem', maxWidth: '400px' }}>
            {this.state.error?.message ?? 'Произошла непредвиденная ошибка'}
          </p>
          <button
            onClick={() => window.location.reload()}
            style={{
              padding: '0.5rem 1.5rem',
              background: '#8b5cf6',
              color: '#fff',
              border: 'none',
              borderRadius: '10px',
              cursor: 'pointer',
              fontSize: '0.9rem',
            }}
          >
            Перезагрузить
          </button>
        </div>
      );
    }

    return this.props.children;
  }
}
