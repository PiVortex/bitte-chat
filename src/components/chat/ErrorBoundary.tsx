import React from "react";

interface Props {
  children: React.ReactNode;
}

interface State {
  hasError: boolean;
}

export class ErrorBoundary extends React.Component<Props, State> {
  state = { hasError: false };

  static getDerivedStateFromError(): State {
    return { hasError: true };
  }

  componentDidCatch(error: Error) {
    console.error("Generationerror:", error);
  }

  render() {
    if (this.state.hasError) {
      return (
        <p className="my-6 overflow-auto text-center text-text-secondary">
          Something went wrong
        </p>
      );
    }

    return this.props.children;
  }
}
