'use client';

export default function Features() {
  return (
    <section className="py-20 bg-gray-100">
      <div className="container mx-auto text-center">
        <h2 className="text-4xl font-bold mb-12">Features Designed for Speed & Flexibility</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          <div className="p-6 bg-white rounded-lg shadow-md">
            <h3 className="text-2xl font-bold mb-4">Visual Drag-and-Drop</h3>
            <p className="text-gray-700">
              Assemble your pages effortlessly with our intuitive visual editor. See your design come to life in real-time.
            </p>
          </div>
          <div className="p-6 bg-white rounded-lg shadow-md">
            <h3 className="text-2xl font-bold mb-4">Rich Component Library</h3>
            <p className="text-gray-700">
              Access a curated collection of production-ready UI components to build stunning Next.js websites.
            </p>
          </div>
          <div className="p-6 bg-white rounded-lg shadow-md">
            <h3 className="text-2xl font-bold mb-4">Intuitive Properties Panel</h3>
            <p className="text-gray-700">
              Tailor every component to your exact needs. Adjust styles, content, and behavior with powerful, easy-to-use controls.
            </p>
          </div>
          <div className="p-6 bg-white rounded-lg shadow-md">
            <h3 className="text-2xl font-bold mb-4">Integrated Code Editor</h3>
            <p className="text-gray-700">
              Go beyond visual. Dive into the code editor to fine-tune logic, add custom scripts, or integrate with your backend.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}