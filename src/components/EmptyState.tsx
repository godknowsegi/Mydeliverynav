import { Link } from "react-router-dom";
import { Badge } from "./ui/badge";
import "../App.css";

export default function EmptyState() {
  return (
    <div className="flex items-center justify-center w-full min-h-[80vh] px-4">
      <div className="grid items-center gap-4 text-center">
        <div className="space-y-2">
          <h1 className="text-3xl font-bold tracking-tighter sm:text-5xl md:text-6xl">
            Bandwidth Exhausted
          </h1>
          <p className="max-w-[600px]  md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed dark:text-gray-200">
            Your free bandwidth for this website has been exhausted. Contact the
            website owner to re-activate the bandwidth.
          </p>
        </div>
        <div className="space-y-7 ">
          <div className="flex items-center justify-center w-full gap-2">
            <div>Renew for another year</div>
            <Badge variant="outline">+$49.99</Badge>
          </div>
          <Link
            className="inline-flex  h-10 items-center justify-center rounded-md border border-gray-200  bg-white px-8 text-sm font-medium shadow-sm transition-colors hover:bg-gray-100 hover:text-gray-900 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-gray-950disabled:pointer-events-none disabled:opacity-50 dark:border-gray-800 dark:bg-gray-950 dark:hover:bg-gray-800 dark:hover:text-gray-50 dark:focus-visible:ring-gray-300"
            to={"#"}
          >
            View Reactivation Pricings
          </Link>
        </div>
      </div>
      <div className="absolute inset-0 z-[-1] bg-gradient-to-b from-gray-100 to-gray-200 dark:from-gray-800 dark:to-gray-850" />
    </div>
  );
}
