import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { getRandomVehicles } from "@/services/vehicles";
import { useEffect, useState } from "react";

const NUM_CARDS = 4;

const skeletons = [...Array(NUM_CARDS)];

export function VehicleCards() {
  const [vehicles, setVehicles] = useState<any[] | null>(null);

  useEffect(() => {
    const controller = new AbortController();
    getRandomVehicles({ count: NUM_CARDS, signal: controller.signal }).then(
      (vs) => {
        setVehicles(vs);
      },
    );
    return () => {
      controller.abort();
    };
  }, []);

  return (
    <article className="grid grid-cols-1 gap-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
      {!vehicles &&
        skeletons.map((_, idx) => (
          <Card key={idx}>
            <CardHeader>
              <Skeleton className="w-full h-4" />
              <Skeleton className="w-1/2 h-4" />
            </CardHeader>
            <CardContent>
              <Skeleton className="w-full h-32 mb-2" />
              <Skeleton className="w-full h-4 mb-2" />
              <Skeleton className="w-1/2 h-4" />
            </CardContent>
          </Card>
        ))}
      {vehicles &&
        vehicles.map((vehicle) => (
          <VehicleCard key={vehicle.id} vehicle={vehicle} />
        ))}
    </article>
  );
}
export default VehicleCards;

function VehicleCard({ vehicle }: { vehicle: any }) {
  return (
    <section>
      <Card>
        <CardHeader>
          <CardTitle>{vehicle.model}</CardTitle>
          <CardDescription>{vehicle.make}</CardDescription>
        </CardHeader>
        <CardContent>
          {vehicle.bodyStyle && <p>{vehicle.bodyStyle}</p>}

          <p>
            {vehicle.image && (
              <img
                src={vehicle.image}
                alt={vehicle.make + " " + vehicle.model}
              />
            )}
            {!vehicle.image && (
              <span className="italic">No Image Available</span>
            )}
          </p>

          {vehicle.years && (
            <ol className="my-1">
              {vehicle.years.map((range: any, idx: number) => (
                <li key={idx}>
                  {range.start}-{range.end}
                </li>
              ))}
            </ol>
          )}

          {vehicle.region && <p className="my-1">{vehicle.region}</p>}

          {vehicle.description && <p className="my-2">{vehicle.description}</p>}
        </CardContent>
      </Card>
    </section>
  );
}
