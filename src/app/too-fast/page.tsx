export default function TooFast() {
    return (
        <div className="absolute inset-0 flex items-center justify-center flex-col">
            <h1 className="text-5xl font-bold text-light-100">
                Whoa, Slow Down There, Speedy!
            </h1>
            <p className="mt-3 max-w-xl text-center text-light-400">
                Looks like you&apos;ve been a little too eager. We&apos;ve put a
                temporary pause on your excitement. 🚦 Chill for a bit, and try again
                shortly
            </p>
        </div>
    )
}