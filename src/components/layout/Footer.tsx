export const Footer = () => {
  return (
    <footer className="w-full py-16 bg-primary mt-auto  text-white">
      <div className="container mx-auto px-4 lg:px-12 grid grid-cols-12 gap-8 items-center">

        <div className="col-span-4">
          <h2 className="text-2xl font-extrabold">ClinicSys</h2>
        </div>
        <div className="col-span-4 flex flex-col gap-3">
          <a href="#" className="text-lg font-medium hover:underline">Home</a>
          <a href="#" className="text-lg font-medium hover:underline">Features</a>
          <a href="#" className="text-lg font-medium hover:underline">Contact</a>
        </div>

        <div className="col-span-4 flex flex-col gap-3">
          <span className="text-lg  font-medium cursor-default">Copyright</span>
          <a href="#" className="text-lg  font-medium hover:underline">Terms</a>
          <a href="#" className="text-lg  font-medium hover:underline">Privacy</a>
        </div>

      </div>
    </footer>
  );
};
