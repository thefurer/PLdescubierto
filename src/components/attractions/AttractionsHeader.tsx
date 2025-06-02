
interface AttractionsHeaderProps {
  totalCount: number;
}

export const AttractionsHeader = ({ totalCount }: AttractionsHeaderProps) => {
  return (
    <div className="text-center mb-12">
      <h2 className="text-3xl md:text-4xl font-bold text-ocean-dark mb-4">
        {totalCount} Atracciones <span className="text-green-primary">Imprescindibles</span>
      </h2>
      <p className="text-lg text-gray-600 max-w-3xl mx-auto leading-relaxed">
        Explora la belleza natural, riqueza cultural y aventuras sin fin que te esperan en Puerto López. 
        Desde playas vírgenes hasta encuentros con vida silvestre, hay algo para todos.
      </p>
    </div>
  );
};
