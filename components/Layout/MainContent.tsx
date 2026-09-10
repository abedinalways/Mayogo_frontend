interface MainContentProps {
  children?: React.ReactNode;
}

export function MainContent({ children }: MainContentProps) {
  return (
    <main className="flex-1 overflow-y-auto bg-[#f6f9fc] p-5">{children}</main>
  );
}
