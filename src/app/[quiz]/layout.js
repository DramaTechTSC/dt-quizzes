export default function Layout({ children }) {
  return (
    <main className="grow flex flex-col items-stretch justify-center w-full max-w-3xl p-8 gap-8">
      {children}
    </main>
  );
}