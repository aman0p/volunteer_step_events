export default function TooFast() {
   return (
      <div className="absolute inset-0 flex flex-col items-center justify-center">
         <h1 className="text-light-100 text-5xl font-bold">
            Whoa, Slow Down There, Speedy!
         </h1>
         <p className="text-light-400 mt-3 max-w-xl text-center">
            Looks like you&apos;ve been a little too eager. We&apos;ve put a
            temporary pause on your excitement. 🚦 Chill for a bit, and try
            again shortly
         </p>
      </div>
   );
}
