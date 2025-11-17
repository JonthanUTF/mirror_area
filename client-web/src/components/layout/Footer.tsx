export default function Footer() {
  return (
    <footer className="bg-white shadow-inner mt-auto py-6">
      <div className="container mx-auto px-4 text-center text-gray-600">
        <p>&copy; {new Date().getFullYear()} AREA - Action Reaction Platform</p>
        <p className="text-sm mt-2">
          Made with ❤️ by the AREA Team
        </p>
      </div>
    </footer>
  );
}
