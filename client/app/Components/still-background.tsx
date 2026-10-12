import Image from "next/image";
import { apiImageUrl, isImageOptimizable } from "../../lib/transport-api";

export default function StillBackground({
  src,
  dim = "bg-slate-950/75",
}: {
  src?: string | null;
  dim?: string;
}) {
  return (
    <>
      {src && (
        <div aria-hidden="true" className="fixed inset-0 -z-20">
          <Image
            src={apiImageUrl(src) || src}
            alt=""
            fill
            priority
            unoptimized={!isImageOptimizable(src)}
            sizes="100vw"
            className="object-cover object-center"
          />
        </div>
      )}
      <div aria-hidden="true" className={`absolute inset-0 -z-10 ${dim}`} />
    </>
  );
}