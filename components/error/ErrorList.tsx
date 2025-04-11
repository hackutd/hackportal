import ErrorCard from './ErrorCard';

interface Props {
  errors: string[];
  onClose: (idx: number) => void;
}

export default function ErrorList({ errors, onClose }: Props) {
  return (
    <div className="p-4">
      {errors.map((error, idx) => (
        <ErrorCard
          key={idx}
          errorMsg={error}
          onClose={() => {
            onClose(idx);
          }}
        />
      ))}
    </div>
  );
}
