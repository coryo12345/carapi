import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

interface Props {
  endpoint: string;
  response: string;
}

export function DocsExample({ endpoint, response }: Props) {
  return (
    <section className="w-min">
      <Tabs defaultValue="endpoint">
        <TabsList>
          <TabsTrigger value="endpoint">Endpoint</TabsTrigger>
          <TabsTrigger value="response">Response</TabsTrigger>
        </TabsList>
        <TabsContent value="endpoint">
          <Card>
            <CardContent className="m-0 py-2 px-4">
              <p className="text-primary whitespace-nowrap">
                <code>{endpoint}</code>
              </p>
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="response">
          <Card>
            <CardContent className="m-0 py-2 px-4">
              <p>
                <pre>{response}</pre>
              </p>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </section>
  );
}
