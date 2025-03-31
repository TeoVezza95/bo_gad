import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"

type ItemData = {
  title: string
  value: string
}

interface CardsContainerProps {
  items: ItemData[]
  className?: string
  cardClass?: string,
}

export function CardsContainer({ items, className, cardClass }: CardsContainerProps) {
  return (
    <div className={`grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-4 ${className}`}>
      {items.map((item, index) => (
        <Card key={index} className={`${cardClass}`}>
          <CardHeader>
            <CardTitle>{item.title}</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-semibold">{item.value}</p>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}
