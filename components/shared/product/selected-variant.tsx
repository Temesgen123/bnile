import { Button } from '@/components/ui/button';
import { IProduct } from '@/lib/db/models/product.model';
import Link from 'next/link';

export default function SelectVariant({
  product,
  size,
  color,
}: {
  product: IProduct;
  size: string;
  color: string;
}) {
  const selectedColor = color || product.colors[0];
  const selectedSize = size || product.sizes[0];
  return (
    <>
      {product.colors.length > 0 && (
        <div className="space-x-2 space-y-2">
          <div>Color :</div>
          {product.colors.map((x: string) => (
            <Button
              key={x}
              asChild
              variant="outline"
              className={
                selectedColor === x ? 'bordedr-2 border-primary' : 'border-2'
              }
            >
              <Link
                href={`?${new URLSearchParams({
                  color: x,
                  size: selectedSize,
                })}`}
                replace
                scroll={false}
                key={x}
              >
                <div
                  className="h-4 w-4 rounded-full border-muted-foreground"
                  style={{ backgroundColor: x }}
                ></div>
                {x}
              </Link>
            </Button>
          ))}
        </div>
      )}
      {product.sizes.length > 0 && (
        <div className="mt-2 space-x-2 space-y-2">
          <div>Size:</div>
          {product.sizes.map((x: string) => (
            <Button
              key={x}
              asChild
              variant="outline"
              className={
                selectedSize === x ? 'border-2 border-primary' : 'border-2'
              }
            >
              <Link
                replace
                scroll={false}
                href={`?${new URLSearchParams({
                  color: selectedColor,
                  size: x,
                })}`}
              >
                {x}
              </Link>
            </Button>
          ))}
        </div>
      )}
    </>
  );
}
