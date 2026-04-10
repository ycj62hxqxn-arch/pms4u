export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center text-center p-6">
      <h1 className="text-4xl font-bold mb-4">
        Control Your Business. Eliminate Chaos. Scale Execution.
      </h1>

      <p className="text-lg mb-6 max-w-xl">
        PMS4U helps businesses structure operations, track execution, and gain full control in less than 48 hours.
      </p>

      <div className="flex gap-4">
        <a
          href="https://wa.me/201XXXXXXXXX"
          className="bg-black text-white px-6 py-3 rounded-lg"
        >
          Book a Call
        </a>

        <a
          href="#"
          className="border px-6 py-3 rounded-lg"
        >
          View System Demo
        </a>
      </div>
    </main>
  );
}