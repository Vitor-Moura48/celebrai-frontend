import Image from "next/image";
import Link from "next/link";
import { MapPin } from "lucide-react";

interface ProdutoCardProps {
  id: number;
  title: string;
  price: number;
  image: string;
  location?: string;
}

export default function ProdutoCard({
  id,
  title,
  price,
  image,
  location = "Recife, PE",
}: ProdutoCardProps) {
  return (
    <Link
      href={`/produto/${id}`}
      className="bg-white shadow-md rounded-lg overflow-hidden hover:scale-[1.02] transition-transform block"
    >
      <Image
        src={image}
        alt={title}
        width={300}
        height={200}
        className="w-full h-40 object-contain bg-gray-50"
      />
      <div className="p-3">
        <p className="text-sm font-semibold line-clamp-2">{title}</p>
        <p className="text-sm text-gray-800 mt-1">
          R$ {(price * 5).toFixed(2)}
        </p>
        <p className="flex items-center text-sm text-gray-600 mt-1">
          <MapPin size={14} className="mr-1" /> {location}
        </p>
      </div>
    </Link>
  );
}
